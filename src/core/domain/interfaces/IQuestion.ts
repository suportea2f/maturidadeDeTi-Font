export interface IAnswer {
  texto: string;
  peso: number;
}

export interface IOption {
  texto: string;
  peso: number;
}

export interface IQuestion {
  _id: string;
  tipo: string;
  pergunta: string;
  qtd_respostas: number;
  respostas: IOption[];
  pesoTotal: number;
  authUserId: string;
  createdAt?: Date;
  updatedAt?: Date;
  toJSON(): IQuestion;
} 