import { Funcionario } from "./Funcionario";

export interface Folha {
  Id: number;
  Quantidade: number;
  Valor: number;
  Mes: number;
  Ano: number;
  SalarioLiquido: number;
  SalarioBruto: number;
  ImpostoIRRF: number;
  ImpostoINSS: number;
  ImpostoFGTS: number;
  FuncionarioId: number;
  Funcionario?: Funcionario;
}
