export interface ILogin {
  email: string;
  senha: string;
}

export interface ILoginResponse {
  token: string;
  user: {
    id: string;
    nome: string;
    email: string;
    empresa: string;
    porteEmpresa: string;
  };
} 