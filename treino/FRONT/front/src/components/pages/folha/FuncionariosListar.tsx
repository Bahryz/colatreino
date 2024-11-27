import { useEffect, useState } from "react";
import { Funcionario } from "../../../models/Funcionario";
import styles from "./FuncionarioListar.module.css";
import axios from "axios";
import FuncionarioCadastrar from "./FuncionarioCadastrar";

function FuncionariosListar() {
  const [funcionarios, setFuncionarios] = useState<Funcionario[]>([]);

  useEffect(() => {
    carregarFuncionarios();
  }, []);

  const carregarFuncionarios = () => {
    axios
      .get("http://localhost:5277/api/funcionario/listar")
      .then((resposta) => {
        console.log(resposta.data); // Verifique se os dados de funcionário estão corretos
        setFuncionarios(resposta.data); // Atualize o estado com os dados dos funcionários
      })
      .catch((erro) => {
        console.error("Erro ao carregar funcionários", erro);
      });
  };

  function deletar(id: number) {
    axios
      .delete(`http://localhost:5277/api/funcionario/deletar/${id}`)
      .then((resposta) => {
        console.log("Funcionário deletado", resposta.data);
        setFuncionarios(funcionarios.filter((func) => func.Id !== id)); // Atualiza a lista após excluir
      })
      .catch((erro) => {
        console.error("Erro ao deletar funcionário", erro);
      });
  }

  return (
    <div className="container">
      <h1>Lista de Funcionários</h1>
      
      {/* Botão de Cadastrar Funcionário - Colocando antes da tabela */}
      <FuncionarioCadastrar carregarFuncionarios={carregarFuncionarios} />

      <table className={styles.table}>
        <thead>
          <tr>
            <th>#</th>
            <th>Nome</th>
            <th>CPF</th>
            <th>Deletar</th>
          </tr>
        </thead>
        <tbody>
          {funcionarios.length > 0 ? (
            funcionarios.map((funcionario) => (
              <tr key={funcionario.Id}>
                <td>{funcionario.Id}</td>
                <td>{funcionario.Nome}</td> {/* Nome do funcionário */}
                <td>{funcionario.CPF}</td>  {/* CPF do funcionário */}
                <td>
                  <button onClick={() => deletar(funcionario.Id!)} className={styles.button}>
                    Deletar
                  </button>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan={4}>Nenhum funcionário encontrado</td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}

export default FuncionariosListar;
