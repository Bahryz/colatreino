// FolhaLista.tsx
import { useEffect, useState } from "react";
import { Folha } from "../../../models/Folha";
import styles from "./FolhaTable.module.css"; // Importando o CSS
import axios from "axios";
import { Link } from "react-router-dom";

function FolhaListar() {
  const [folhas, setFolhas] = useState<Folha[]>([]);

  useEffect(() => {
    fetch("http://localhost:5277/api/folha/listar")
      .then((resposta) => {
        return resposta.json();
      })
      .then((folhas) => {
        setFolhas(folhas);
      });
  }, []);

  function deletar(id: number) {
    axios
      .delete(`http://localhost:5277/api/folha/deletar/${id}`)
      .then((resposta) => {
        console.log(resposta.data);
        setFolhas(folhas.filter(folha => folha.Id !== id)); // Atualiza a lista após deletar
      });
  }

  return (
    <div className="container">
      <h1>Lista de Folhas de Pagamento</h1>
      <table className={styles.table}>
        <thead>
          <tr>
            <th>#</th>
            <th>Funcionário</th>
            <th>Mês</th>
            <th>Ano</th>
            <th>Salário Bruto</th>
            <th>Salário Líquido</th>
            <th>Deletar</th>
            <th>Alterar</th>
          </tr>
        </thead>
        <tbody>
          {folhas.map((folha) => (
            <tr key={folha.Id}>
              <td>{folha.Id}</td>
              <td>{folha.Funcionario?.Nome}</td>
              <td>{folha.Mes}</td>
              <td>{folha.Ano}</td>
              <td>{folha.SalarioBruto}</td>
              <td>{folha.SalarioLiquido}</td>
              <td>
                <button onClick={() => deletar(folha.Id)}>
                  Deletar
                </button>
              </td>
              <td>
                <Link to={`/pages/folha/alterar/${folha.Id}`}>
                  Alterar
                </Link>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default FolhaListar;
