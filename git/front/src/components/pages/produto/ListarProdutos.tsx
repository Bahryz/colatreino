import { useEffect, useState } from "react";
import { Produto } from "../../../models/Produto";
import styles from "./ProdutoLista.module.css";
import { Link } from "react-router-dom";
import axios from "axios";

function ListarProdutos() {
  const [produtos, setProdutos] = useState<Produto[]>([]);

  useEffect(() => {
    consultarProdutos();
  }, []);

  // Consulta os produtos na API
  function consultarProdutos() {
    axios
      .get<Produto[]>("http://localhost:5117/api/produto/listar")
      .then((resposta) => {
        setProdutos(resposta.data);
        console.table(resposta.data);
      })
      .catch((erro) => {
        console.error("Erro ao listar produtos:", erro);
      });
  }

  // Deleta um produto pelo ID e atualiza a lista
  function deletar(id: string) {
    axios
      .delete(`http://localhost:5117/api/produto/deletar/${id}`) // Certifique-se de usar a mesma porta
      .then(() => {
        // Atualiza a lista de produtos após deletar
        setProdutos((produtosAtuais) =>
          produtosAtuais.filter((produto) => produto.id !== id)
        );
        console.log(`Produto com ID ${id} foi deletado com sucesso.`);
      })
      .catch((erro) => {
        console.error("Erro ao deletar produto:", erro);
      });
  }

  return (
    <div id="listarprodutos" className="container">
      <h1>Listar Produtos</h1>
      <table className={styles.table}>
        <thead>
          <tr>
            <th>#</th>
            <th>Nome</th>
            <th>Criado em</th>
            <th>Deletar</th>
            <th>Alterar</th>
          </tr>
        </thead>
        <tbody>
          {produtos.map((produto) => (
            <tr key={produto.id}>
              <td>{produto.id}</td>
              <td>{produto.nome}</td>
              <td>{produto.criadoEm}</td>
              <td>
                <button onClick={() => deletar(produto.id!)}>Deletar</button>
              </td>
              <td>
                <Link to={`/pages/produto/alterar/${produto.id}`}>Alterar</Link>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default ListarProdutos;
