import { IEvaluationResponse, IEvaluationAnswer } from '../domain/interfaces/IEvaluationResponse';
import { api } from '../config/api';

export const evaluationService = {
  async addAnswer(evaluationId: string, questionId: string, answer: IEvaluationAnswer): Promise<IEvaluationResponse> {
    const response = await api.post<IEvaluationResponse>(`/evaluations/${evaluationId}/answers`, {
      questionId,
      answer
    });
    return response.data;
  },

  async finalizeResponse(evaluationId: string): Promise<IEvaluationResponse> {
    const response = await api.post<IEvaluationResponse>(`/evaluations/${evaluationId}/finalize`);
    return response.data;
  },

  async getResponse(evaluationId: string): Promise<IEvaluationResponse> {
    const response = await api.get<IEvaluationResponse>(`/evaluations/${evaluationId}/response`);
    return response.data;
  }
}; 