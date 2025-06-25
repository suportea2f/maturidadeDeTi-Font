import { IEvaluation, IEvaluationRepository } from '../../core/domain/interfaces/IEvaluation';
import { api } from '../api/api';

export class EvaluationRepository implements IEvaluationRepository {
  async getAll(): Promise<IEvaluation[]> {
    const response = await api.get<IEvaluation[]>('/evaluations');
    return response.data;
  }

  async getById(id: string): Promise<IEvaluation | null> {
    const response = await api.get<IEvaluation>(`/evaluations/${id}`);
    return response.data;
  }

  async getByUserId(userId: string): Promise<IEvaluation[]> {
    const response = await api.get<IEvaluation[]>(`/evaluations/user/${userId}`);
    return response.data;
  }

  async create(evaluation: Omit<IEvaluation, '_id' | 'createdAt' | 'updatedAt'>): Promise<IEvaluation> {
    const response = await api.post<IEvaluation>('/evaluations', evaluation);
    return response.data;
  }

  async update(id: string, evaluation: Partial<IEvaluation>): Promise<IEvaluation> {
    const response = await api.put<IEvaluation>(`/evaluations/${id}`, evaluation);
    return response.data;
  }

  async delete(id: string): Promise<void> {
    await api.delete(`/evaluations/${id}`);
  }

  // Métodos adicionais não exigidos pela interface, mas úteis para a aplicação
  
  async publish(id: string): Promise<IEvaluation> {
    const response = await api.post<IEvaluation>(`/evaluations/${id}/publish`);
    return response.data;
  }

  async finalize(id: string): Promise<IEvaluation> {
    // Voltar a usar apenas o endpoint original de finalize
    const response = await api.post<IEvaluation>(`/evaluations/${id}/finalize`);
    return response.data;
  }
} 