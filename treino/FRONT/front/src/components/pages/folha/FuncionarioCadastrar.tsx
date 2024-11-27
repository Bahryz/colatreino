import { useState } from "react";
import axios from "axios";
import styles from "./FuncionarioCadastro.module.css"; // Adapte o caminho do CSS conforme necessário

function FuncionarioCadastrar({ carregarFuncionarios }: { carregarFuncionarios: () => void }) {
  const [CPF, setCPF] = useState("");
  const [nome, setNome] = useState("");

  function enviarFuncionario(e: React.FormEvent) {
    e.preventDefault();

    const funcionario = {
      cpf: CPF,
      nome: nome,
    };

    axios
      .post("http://localhost:5277/api/funcionario/cadastrar", funcionario, {
        headers: {
          "Content-Type": "application/json",
        },
      })
      .then((resposta) => {
        console.log("Funcionário cadastrado com sucesso", resposta.data);
        // Limpar campos após cadastro
        setCPF("");
        setNome("");
        
        // Atualizar a lista de funcionários
        carregarFuncionarios();
      })
      .catch((erro) => {
        console.error("Erro ao cadastrar funcionário", erro);
      });
  }

  return (
    <div id="cadastrar_funcionario" className={styles.container}>
      <h1>Cadastrar Funcionário</h1>
      <form onSubmit={enviarFuncionario} className={styles.form}>
        <div className={styles.formGroup}>
          <label htmlFor="cpf" className={styles.label}>CPF</label>
          <input
            type="text"
            id="cpf"
            name="cpf"
            value={CPF}
            required
            onChange={(e) => setCPF(e.target.value)}
            className={styles.input}
          />
        </div>

        <div className={styles.formGroup}>
          <label htmlFor="nome" className={styles.label}>Nome</label>
          <input
            type="text"
            id="nome"
            name="nome"
            value={nome}
            required
            onChange={(e) => setNome(e.target.value)}
            className={styles.input}
          />
        </div>

        <button type="submit" className={styles.button}>Cadastrar Funcionário</button>
      </form>
    </div>
  );
}

export default FuncionarioCadastrar;
