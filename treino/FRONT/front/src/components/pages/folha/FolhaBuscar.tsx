import { useState } from "react";
import { Folha } from "../../../models/Folha";
import axios from "axios";
import styles from "./FolhaBusca.module.css"; // Importe o CSS aqui

function FolhaBuscar() {
  const [cpf, setCpf] = useState("");
  const [mes, setMes] = useState<number | string>("");
  const [ano, setAno] = useState<number | string>("");
  const [folhas, setFolhas] = useState<Folha[]>([]);
  const [erro, setErro] = useState<string | null>(null);

  const buscarFolhas = () => {
    // Monta a URL de busca com os parâmetros
    let url = `http://localhost:5277/api/folha/buscar?`;
    if (cpf) url += `cpf=${cpf}&`;
    if (mes) url += `mes=${mes}&`;
    if (ano) url += `ano=${ano}&`;

    axios
      .get<Folha[]>(url)
      .then((resposta) => {
        setFolhas(resposta.data);
        setErro(null); // Limpa o erro em caso de sucesso
      })
      .catch((erro) => {
        setErro("Erro ao buscar as folhas de pagamento.");
        console.error("Erro ao buscar folhas:", erro);
      });
  };

  return (
    <div className={styles.container}>
      <h1>Buscar Folhas de Pagamento</h1>

      <div className={styles.formGroup}>
        <label htmlFor="cpf">CPF</label>
        <input
          type="text"
          id="cpf"
          value={cpf}
          onChange={(e) => setCpf(e.target.value)}
          placeholder="Digite o CPF"
          className={styles.input}
        />
      </div>

      <div className={styles.formGroup}>
        <label htmlFor="mes">Mês</label>
        <input
          type="number"
          id="mes"
          value={mes}
          onChange={(e) => setMes(e.target.value)}
          placeholder="Digite o mês"
          className={styles.input}
        />
      </div>

      <div className={styles.formGroup}>
        <label htmlFor="ano">Ano</label>
        <input
          type="number"
          id="ano"
          value={ano}
          onChange={(e) => setAno(e.target.value)}
          placeholder="Digite o ano"
          className={styles.input}
        />
      </div>

      <button onClick={buscarFolhas} className={styles.button}>
        Buscar
      </button>

      {erro && <p className={styles.error}>{erro}</p>}

      {folhas.length > 0 ? (
        <table className={styles.table}>
          <thead>
            <tr>
              <th>#</th>
              <th>Funcionário</th>
              <th>Mês</th>
              <th>Ano</th>
              <th>Valor</th>
              <th>Imposto IRRF</th>
              <th>Imposto INSS</th>
              <th>Imposto FGTS</th>
            </tr>
          </thead>
          <tbody>
            {folhas.map((folha) => (
              <tr key={folha.Id}>
                <td>{folha.Id}</td>
                <td>{folha.Funcionario?.Nome}</td>
                <td>{folha.Mes}</td>
                <td>{folha.Ano}</td>
                <td>{folha.Valor}</td>
                <td>{folha.ImpostoIRRF}</td>
                <td>{folha.ImpostoINSS}</td>
                <td>{folha.ImpostoFGTS}</td>
              </tr>
            ))}
          </tbody>
        </table>
      ) : (
        <p>Nenhuma folha de pagamento encontrada.</p>
      )}
    </div>
  );
}

export default FolhaBuscar;
