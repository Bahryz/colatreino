import { useEffect, useState } from "react";
import { Funcionario } from "../../../models/Funcionario";
import { Folha } from "../../../models/Folha";
import axios from "axios";

function FolhaCadastrar() {
  const [funcionarios, setFuncionarios] = useState<Funcionario[]>([]);
  const [funcionarioId, setFuncionarioId] = useState<number>(0);
  const [quantidade, setQuantidade] = useState<number>(0);
  const [valor, setValor] = useState<number>(0);
  const [mes, setMes] = useState<number>(0);
  const [ano, setAno] = useState<number>(0);

  useEffect(() => {
    axios
      .get<Funcionario[]>("http://localhost:5277/api/funcionario/listar")
      .then((resposta) => {
        setFuncionarios(resposta.data);
      });
  }, []);

  function enviarFolha(e: React.FormEvent) {
    e.preventDefault();

    if (quantidade <= 0 || valor <= 0) {
      alert("Quantidade e Valor devem ser maiores que zero.");
      return;
    }
    if (mes < 1 || mes > 12) {
      alert("Mês inválido.");
      return;
    }
    if (ano <= 0) {
      alert("Ano inválido.");
      return;
    }

    const novaFolha: Folha = {
      Id: 0, // Será gerado pelo backend
      Quantidade: quantidade,
      Valor: valor,
      Mes: mes,
      Ano: ano,
      SalarioBruto: 0, // Será calculado pelo backend
      SalarioLiquido: 0, // Será calculado pelo backend
      ImpostoIRRF: 0, // Será calculado pelo backend
      ImpostoINSS: 0, // Será calculado pelo backend
      ImpostoFGTS: 0, // Será calculado pelo backend
      FuncionarioId: funcionarioId,
    };

    axios
      .post("http://localhost:5277/api/folha/cadastrar", novaFolha)
      .then((resposta) => {
        console.log("Folha cadastrada:", resposta.data);
      })
      .catch((erro) => {
        console.error("Erro ao cadastrar folha:", erro);
      });
  }

  return (
    <div className="container">
      <h1>Cadastrar Folha de Pagamento</h1>
      <form onSubmit={enviarFolha}>
        <div>
          <label htmlFor="funcionario">Funcionário</label>
          <select
            id="funcionario"
            required
            value={funcionarioId}
            onChange={(e) => setFuncionarioId(Number(e.target.value))}
          >
            <option value="" disabled>
              Selecione um funcionário
            </option>
            {funcionarios.map((funcionario) => (
              <option value={funcionario.Id} key={funcionario.Id}>
                {funcionario.Nome}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label htmlFor="quantidade">Quantidade</label>
          <input
            type="number"
            id="quantidade"
            required
            value={quantidade}
            onChange={(e) => setQuantidade(Number(e.target.value))}
          />
        </div>

        <div>
          <label htmlFor="valor">Valor</label>
          <input
            type="number"
            id="valor"
            required
            value={valor}
            onChange={(e) => setValor(Number(e.target.value))}
          />
        </div>

        <div>
          <label htmlFor="mes">Mês</label>
          <input
            type="number"
            id="mes"
            min="1"
            max="12"
            required
            value={mes}
            onChange={(e) => setMes(Number(e.target.value))}
          />
        </div>

        <div>
          <label htmlFor="ano">Ano</label>
          <input
            type="number"
            id="ano"
            required
            value={ano}
            onChange={(e) => setAno(Number(e.target.value))}
          />
        </div>

        <button type="submit">Cadastrar Folha</button>
      </form>
    </div>
  );
}

export default FolhaCadastrar;
