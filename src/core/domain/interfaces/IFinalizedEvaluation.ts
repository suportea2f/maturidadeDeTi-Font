export interface IFinalizedEvaluation {
  id: string;
  evaluationId: string;
  userId: string;
  score: number;
  maturityLevel: string;
  createdAt: Date | string;
  updatedAt: Date | string;
  pesoAtingido?: number;
  pesoTotalPossivel?: number;
  pontuacaoTotal?: number;
  percentualAtual?: number;
  percentual?: number;
  userName?: string;
  companyName?: string;
  descricaoNivel?: string;
  status?: string;
  dataFinalizacao?: string;
} 