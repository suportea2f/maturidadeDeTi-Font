export interface IEvaluation {
  _id?: string;
  id?: string;
  titulo: string;
  descricao: string;
  status: 'Rascunho' | 'Publicada' | 'Finalizada' | 'Arquivada' | 'Em_andamento';
  userId: string;
  questionIds?: string[];
  pontuacao?: number;
  nivelMaturidade?: string;
  publicada?: boolean;
  createdAt?: Date;
  updatedAt?: Date;
  tempoLimiteMinutos?: number;
  quantidadeParticipantes?: number;
  usuariosFinalizadores?: { idParticipante: string }[];
}

export interface IEvaluationRepository {
  getAll(): Promise<IEvaluation[]>;
  getById(id: string): Promise<IEvaluation | null>;
  getByUserId(userId: string): Promise<IEvaluation[]>;
  create(evaluation: Omit<IEvaluation, '_id' | 'createdAt' | 'updatedAt'>): Promise<IEvaluation>;
  update(id: string, evaluation: Partial<IEvaluation>): Promise<IEvaluation>;
  delete(id: string): Promise<void>;
  publish(id: string): Promise<IEvaluation>;
  finalize(id: string): Promise<IEvaluation>;
} 