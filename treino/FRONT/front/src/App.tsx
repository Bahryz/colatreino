import { useEffect, useState } from "react";
import { BrowserRouter, Link, Route, Routes } from "react-router-dom";
import FuncionarioListar from "./components/pages/folha/FuncionariosListar"; // Corrigido para usar FuncionarioListar
import FuncionarioCadastro from "./components/pages/folha/FuncionarioCadastrar";
import FolhaLista from "./components/pages/folha/FolhaListar";
import FolhaCadastro from "./components/pages/folha/FolhaCadastrar";
import ConsultarCEP from "./components/samples/ConsultarCEP"; 
import axios from "axios";
import { Funcionario } from "./models/Funcionario";  

function App() {
  const [funcionarios, setFuncionarios] = useState<Funcionario[]>([]);

  // Função para carregar funcionários
  const carregarFuncionarios = () => {
    axios
      .get("http://localhost:5277/api/funcionario/listar")
      .then((resposta) => {
        setFuncionarios(resposta.data);
      })
      .catch((erro) => {
        console.error("Erro ao carregar funcionários", erro);
      });
  };

  useEffect(() => {
    carregarFuncionarios();
  }, []);

  return (
    <div id="app">
      <BrowserRouter>
        <nav>
          <ul>
            <li>
              <Link to="/">Home</Link>
            </li>
            <li>
              <Link to="/funcionario/listar">Listar Funcionários</Link>
            </li>
            <li>
              <Link to="/funcionario/cadastrar">Cadastrar Funcionário</Link>
            </li>
            <li>
              <Link to="/folha/listar">Listar Folhas</Link>
            </li>
            <li>
              <Link to="/folha/cadastrar">Cadastrar Folha</Link>
            </li>
            <li>
              <Link to="/endereco/consultar">Consultar Endereço</Link>
            </li>
          </ul>
        </nav>

        <Routes>
          <Route
            path="/"
            element={<FuncionarioListar />} // Usando o componente correto
          />
          <Route
            path="/funcionario/listar"
            element={<FuncionarioListar />} // Usando o componente correto
          />
          <Route
            path="/funcionario/cadastrar"
            element={<FuncionarioCadastro carregarFuncionarios={carregarFuncionarios} />}
          />
          <Route path="/folha/listar" element={<FolhaLista />} />
          <Route path="/folha/cadastrar" element={<FolhaCadastro />} />
          <Route path="/endereco/consultar" element={<ConsultarCEP />} />
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
