import { IEvaluation, IEvaluationRepository } from '../../core/domain/interfaces/IEvaluation';
import { api } from '../api/api';

export class EvaluationRepository implements IEvaluationRepository {
  async getAll(): Promise<IEvaluation[]> {
    try {
      const response = await api.get<IEvaluation[]>('/evaluations');
      return response.data;
    } catch (error: any) {
      console.error('Erro ao buscar avaliações:', error);
      throw new Error('Erro ao buscar avaliações');
    }
  }

  async getById(id: string): Promise<IEvaluation | null> {
    try {
      const response = await api.get<IEvaluation>(`/evaluations/${id}`);
      return response.data;
    } catch (error: any) {
      if (error.response?.status === 404) {
        return null;
      }
      console.error('Erro ao buscar avaliação:', error);
      throw new Error('Erro ao buscar avaliação');
    }
  }

  async getByUserId(userId: string): Promise<IEvaluation[]> {
    try {
      const response = await api.get<IEvaluation[]>(`/evaluations/user/${userId}`);
      return response.data;
    } catch (error: any) {
      console.error('Erro ao buscar avaliações do usuário:', error);
      throw new Error('Erro ao buscar avaliações do usuário');
    }
  }

  async create(evaluation: Omit<IEvaluation, '_id' | 'createdAt' | 'updatedAt'>): Promise<IEvaluation> {
    try {
      const response = await api.post<IEvaluation>('/evaluations', evaluation);
      return response.data;
    } catch (error: any) {
      console.error('Erro ao criar avaliação:', error);
      throw new Error('Erro ao criar avaliação');
    }
  }

  async update(id: string, evaluation: Partial<IEvaluation>): Promise<IEvaluation> {
    try {
      const response = await api.put<IEvaluation>(`/evaluations/${id}`, evaluation);
      return response.data;
    } catch (error: any) {
      console.error('Erro ao atualizar avaliação:', error);
      throw new Error('Erro ao atualizar avaliação');
    }
  }

  async delete(id: string): Promise<void> {
    try {
      await api.delete(`/evaluations/${id}`);
    } catch (error: any) {
      console.error('Erro ao deletar avaliação:', error);
      throw new Error('Erro ao deletar avaliação');
    }
  }

  async publish(id: string): Promise<IEvaluation> {
    try {
      const response = await api.post<IEvaluation>(`/evaluations/${id}/publish`);
      return response.data;
    } catch (error: any) {
      console.error('Erro ao publicar avaliação:', error);
      throw new Error('Erro ao publicar avaliação');
    }
  }

  async finalize(id: string): Promise<IEvaluation> {
    try {
      const response = await api.post<IEvaluation>(`/evaluations/${id}/finalize`);
      return response.data;
    } catch (error: any) {
      console.error('Erro ao finalizar avaliação:', error);
      throw new Error('Erro ao finalizar avaliação');
    }
  }
} 