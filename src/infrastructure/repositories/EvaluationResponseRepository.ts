import { api } from '../api/api';
import { IEvaluationResponse, IEvaluationResponseRepository, IEvaluationAnswer } from '../../core/domain/interfaces/IEvaluationResponse';
import { IAnswer as IQuestionAnswer } from '../../core/domain/interfaces/IQuestion';

export class EvaluationResponseRepository implements IEvaluationResponseRepository {
  async getAll(): Promise<IEvaluationResponse[]> {
    const response = await api.get<IEvaluationResponse[]>('/evaluation-responses');
    return response.data;
  }

  async getById(id: string): Promise<IEvaluationResponse> {
    const response = await api.get<IEvaluationResponse>(`/evaluation-responses/${id}`);
    if (!response.data) {
      throw new Error('Resposta não encontrada');
    }
    return response.data;
  }

  async getByUserId(userId: string): Promise<IEvaluationResponse[]> {
    const response = await api.get<IEvaluationResponse[]>(`/evaluation-responses/user/${userId}`);
    return response.data;
  }

  async getByTemplateId(templateId: string): Promise<IEvaluationResponse[]> {
    const response = await api.get<IEvaluationResponse[]>(`/evaluation-responses/template/${templateId}`);
    return response.data;
  }

  async create(response: IEvaluationResponse): Promise<IEvaluationResponse> {
    const responseData = await api.post<IEvaluationResponse>('/evaluation-responses', response);
    return responseData.data;
  }

  async update(id: string, response: Partial<IEvaluationResponse>): Promise<IEvaluationResponse> {
    const responseData = await api.put<IEvaluationResponse>(`/evaluation-responses/${id}`, response);
    return responseData.data;
  }

  async delete(id: string): Promise<void> {
    await api.delete(`/evaluation-responses/${id}`);
  }

  async addAnswer(responseId: string, answer: IEvaluationAnswer): Promise<IEvaluationResponse> {
    const responseData = await api.post<IEvaluationResponse>(`/evaluation-responses/${responseId}/answers`, answer);
    return responseData.data;
  }

  async finalizeResponse(responseId: string): Promise<IEvaluationResponse> {
    const responseData = await api.post<IEvaluationResponse>(`/evaluation-responses/${responseId}/finalize`);
    return responseData.data;
  }
} 