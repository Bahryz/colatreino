using Diogo.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

var builder = WebApplication.CreateBuilder(args);

// Configurando o DbContext com uma string de conexão
builder.Services.AddDbContext<AppDataContext>(options =>
    options.UseSqlite("Data Source=app.db"));

// Adicionando a configuração de CORS
builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowAll", builder =>
    {
        builder.AllowAnyOrigin()
               .AllowAnyMethod()
               .AllowAnyHeader();
    });
});

var app = builder.Build();

// Usando o CORS
app.UseCors("AllowAll");

app.MapGet("/", () => "Prova A2 em dupla com consulta!");

// Endpoint para cadastrar funcionário
app.MapPost("/api/funcionario/cadastrar", ([FromBody] Funcionario funcionario,
    [FromServices] AppDataContext ctx) =>
{
    ctx.Funcionarios.Add(funcionario);
    ctx.SaveChanges();
    return Results.Created($"/api/funcionario/{funcionario.Id}", funcionario);
});

// Endpoint para listar funcionários
app.MapGet("/api/funcionario/listar", ([FromServices] AppDataContext ctx) =>
{
    return Results.Ok(ctx.Funcionarios.ToList());
});

// Endpoint para deletar funcionário
app.MapDelete("/api/funcionario/deletar/{id}", async ([FromRoute] int id, [FromServices] AppDataContext ctx) =>
{
    var funcionario = await ctx.Funcionarios.FindAsync(id);
    if (funcionario is null)
    {
        return Results.NotFound("Funcionário não encontrado.");
    }

    ctx.Funcionarios.Remove(funcionario);
    await ctx.SaveChangesAsync();

    return Results.Ok($"Funcionário com ID {id} deletado.");
});

// Endpoint para cadastrar folha
app.MapPost("/api/folha/cadastrar", ([FromBody] Folha folha,
    [FromServices] AppDataContext ctx) =>
{
    // Validar se o funcionário existe
    Funcionario? funcionario = ctx.Funcionarios.Find(folha.FuncionarioId);

    if (funcionario is null)
        return Results.NotFound("Funcionário não encontrado");

    folha.Funcionario = funcionario;

    // Calcular o salário bruto
    folha.SalarioBruto = folha.Quantidade * folha.Valor;

    // Cálculo do IRRF
    if (folha.SalarioBruto <= 1903.98)
        folha.ImpostoIRRF = 0;
    else if (folha.SalarioBruto <= 2826.65)
        folha.ImpostoIRRF = (folha.SalarioBruto * .075) - 142.80;
    else if (folha.SalarioBruto <= 3751.05)
        folha.ImpostoIRRF = (folha.SalarioBruto * .15) - 354.80;
    else if (folha.SalarioBruto <= 4664.68)
        folha.ImpostoIRRF = (folha.SalarioBruto * .225) - 636.13;
    else
        folha.ImpostoIRRF = (folha.SalarioBruto * .275) - 869.36;

    // Cálculo do INSS
    if (folha.SalarioBruto <= 1693.72)
        folha.ImpostoINSS = folha.SalarioBruto * .08;
    else if (folha.SalarioBruto <= 2822.90)
        folha.ImpostoINSS = folha.SalarioBruto * .09;
    else if (folha.SalarioBruto <= 5645.80)
        folha.ImpostoINSS = folha.SalarioBruto * .11;
    else
        folha.ImpostoINSS = 621.04;

    // Cálculo do FGTS
    folha.ImpostoFGTS = folha.SalarioBruto * .08;

    // Cálculo do salário líquido
    folha.SalarioLiquido = folha.SalarioBruto - folha.ImpostoIRRF - folha.ImpostoINSS;

    try
    {
        ctx.Folhas.Add(folha);
        ctx.SaveChanges();
        return Results.Created($"/api/folha/{folha.Id}", folha);
    }
    catch (Exception ex)
    {
        return Results.Problem($"Erro ao salvar a folha: {ex.Message}");
    }
});

// Endpoint para listar folhas
app.MapGet("/api/folha/listar", ([FromServices] AppDataContext ctx) =>
{
    return Results.Ok(ctx.Folhas.Include(x => x.Funcionario).ToList());
});

// Endpoint para buscar folha por CPF, mês e ano
app.MapGet("/api/folha/buscar/{cpf}/{mes}/{ano}", ([FromServices] AppDataContext ctx,
    [FromRoute] int mes, [FromRoute] int ano, [FromRoute] string cpf) =>
{
    Folha? folha = ctx.Folhas
        .Include(x => x.Funcionario)
        .FirstOrDefault(f => f.Funcionario != null && f.Funcionario.CPF == cpf && f.Mes == mes && f.Ano == ano);
    if (folha is null)
    {
        return Results.NotFound();
    }
    return Results.Ok(folha);
});

app.Run();
