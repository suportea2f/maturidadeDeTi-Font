import { IAnswer, IEvaluationResponse, IEvaluationResponseRepository, IEvaluationAnswer } from '../../core/domain/interfaces/IEvaluationResponse';
import { api } from '../api/api';

export class EvaluationResponseRepository implements IEvaluationResponseRepository {
  async getAll(): Promise<IEvaluationResponse[]> {
    try {
      const response = await api.get<IEvaluationResponse[]>('/responses');
      return response.data;
    } catch (error: any) {
      console.error('Erro ao buscar respostas de avaliação:', error);
      throw new Error('Erro ao buscar respostas de avaliação');
    }
  }

  async getById(id: string): Promise<IEvaluationResponse> {
    try {
      const response = await api.get<IEvaluationResponse>(`/responses/${id}`);
      return response.data;
    } catch (error: any) {
      if (error.response?.status === 404) {
        throw new Error('Resposta não encontrada');
      }
      throw error;
    }
  }

  async getByUserId(userId: string): Promise<IEvaluationResponse[]> {
    try {
      const response = await api.get<IEvaluationResponse[]>(`/responses/user/${userId}`);
      return response.data;
    } catch (error: any) {
      console.error('Erro ao buscar respostas de avaliação do usuário:', error);
      throw new Error('Erro ao buscar respostas de avaliação do usuário');
    }
  }

  async getByTemplateId(templateId: string): Promise<IEvaluationResponse[]> {
    try {
      const response = await api.get<IEvaluationResponse[]>(`/evaluations/${templateId}/responses`);
      return response.data;
    } catch (error: any) {
      console.error('Erro ao buscar respostas para o template:', error);
      throw new Error('Erro ao buscar respostas para o template');
    }
  }

  async create(evaluationResponse: IEvaluationResponse): Promise<IEvaluationResponse> {
    try {
      const response = await api.post<IEvaluationResponse>(
        `/evaluations/${evaluationResponse.evaluationId}/responses`, 
        evaluationResponse
      );
      return response.data;
    } catch (error: any) {
      console.error('Erro ao criar resposta de avaliação:', error);
      throw new Error('Erro ao criar resposta de avaliação');
    }
  }

  async update(id: string, evaluationResponse: Partial<IEvaluationResponse>): Promise<IEvaluationResponse> {
    try {
      const response = await api.put<IEvaluationResponse>(`/responses/${id}`, evaluationResponse);
      return response.data;
    } catch (error: any) {
      console.error('Erro ao atualizar resposta de avaliação:', error);
      throw new Error('Erro ao atualizar resposta de avaliação');
    }
  }

  async delete(id: string): Promise<void> {
    try {
      await api.delete(`/responses/${id}`);
    } catch (error: any) {
      console.error('Erro ao excluir resposta de avaliação:', error);
      throw new Error('Erro ao excluir resposta de avaliação');
    }
  }

  async addAnswer(responseId: string, answer: IEvaluationAnswer): Promise<IEvaluationResponse> {
    try {
      const response = await api.post<IEvaluationResponse>(
        `/responses/${responseId}/answers`,
        answer
      );
      return response.data;
    } catch (error: any) {
      console.error('Erro ao adicionar resposta:', error);
      throw new Error('Erro ao adicionar resposta');
    }
  }

  async finalizeResponse(responseId: string): Promise<IEvaluationResponse> {
    try {
      const response = await api.post<IEvaluationResponse>(`/responses/${responseId}/finalize`);
      return response.data;
    } catch (error: any) {
      console.error('Erro ao finalizar resposta de avaliação:', error);
      throw new Error('Erro ao finalizar resposta de avaliação');
    }
  }
} 