export interface IAnswer {
  texto: string;
  peso: number;
}

export interface IEvaluationAnswer {
  questionId: string;
  answer: IAnswer;
}

export interface IEvaluationResponse {
  id: string;
  evaluationId: string;
  userId: string;
  answers: IEvaluationAnswer[];
  score: number;
  pontuacao: number;
  status: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface IEvaluationResponseRepository {
  getAll(): Promise<IEvaluationResponse[]>;
  getById(id: string): Promise<IEvaluationResponse>;
  getByUserId(userId: string): Promise<IEvaluationResponse[]>;
  getByTemplateId(templateId: string): Promise<IEvaluationResponse[]>;
  create(evaluationResponse: IEvaluationResponse): Promise<IEvaluationResponse>;
  update(id: string, evaluationResponse: Partial<IEvaluationResponse>): Promise<IEvaluationResponse>;
  delete(id: string): Promise<void>;
  addAnswer(responseId: string, answer: IEvaluationAnswer): Promise<IEvaluationResponse>;
  finalizeResponse(responseId: string): Promise<IEvaluationResponse>;
} 