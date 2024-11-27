using Microsoft.EntityFrameworkCore;

namespace Diogo.Models;

public class AppDataContext(DbContextOptions<AppDataContext> options) : DbContext(options)
{
    public DbSet<Funcionario> Funcionarios { get; set; }
    public DbSet<Folha> Folhas { get; set; }

    // Não é mais necessário sobrescrever OnConfiguring se a configuração for feita em Program.cs
    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        base.OnModelCreating(modelBuilder);
        // Aqui você pode configurar entidades adicionais, se necessário
    }
}
