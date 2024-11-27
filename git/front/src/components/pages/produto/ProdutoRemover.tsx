import axios from "axios";
import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";

function ProdutoRemover() {
  const { id } = useParams(); // Obtém o ID do produto da URL
  const navigate = useNavigate(); // Navegação após a remoção
  const [produto, setProduto] = useState<any>(null);

  useEffect(() => {
    if (id) {
      axios
        .get(`http://localhost:5117/api/produto/buscar/${id}`)
        .then((resposta) => {
          setProduto(resposta.data);
        })
        .catch(() => {
          alert("Erro ao buscar o produto.");
        });
    }
  }, [id]);

  function removerProduto() {
    if (id) {
      axios
        .delete(`http://localhost:5117/api/produto/deletar/${id}`)
        .then(() => {
          alert("Produto removido com sucesso!");
          navigate("/produtos"); // Redireciona para a lista de produtos
        })
        .catch(() => {
          alert("Erro ao remover o produto.");
        });
    }
  }

  return (
    <div>
      <h1>Remover Produto</h1>
      {produto ? (
        <div>
          <p>Tem certeza que deseja remover o produto abaixo?</p>
          <p><strong>Nome:</strong> {produto.nome}</p>
          <p><strong>Descrição:</strong> {produto.descricao}</p>
          <p><strong>Preço:</strong> R$ {produto.preco.toFixed(2)}</p>
          <p><strong>Quantidade:</strong> {produto.quantidade}</p>
          <button onClick={removerProduto}>Remover</button>
        </div>
      ) : (
        <p>Carregando produto...</p>
      )}
    </div>
  );
}

export default ProdutoRemover;
