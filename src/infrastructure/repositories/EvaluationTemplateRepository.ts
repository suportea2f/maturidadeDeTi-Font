import { IEvaluationTemplate, IEvaluationTemplateRepository } from '../../core/domain/interfaces/IEvaluationTemplate';
import { api } from '../api/api';

export class EvaluationTemplateRepository implements IEvaluationTemplateRepository {
  async getAll(): Promise<IEvaluationTemplate[]> {
    try {
      const response = await api.get<IEvaluationTemplate[]>('/evaluations');
      return response.data;
    } catch (error: any) {
      console.error('Erro ao buscar templates de avaliação:', error);
      throw new Error('Erro ao buscar templates de avaliação');
    }
  }

  async getById(id: string): Promise<IEvaluationTemplate | null> {
    try {
      const response = await api.get<IEvaluationTemplate>(`/evaluations/${id}`);
      return response.data;
    } catch (error: any) {
      if (error.response?.status === 404) {
        return null;
      }
      console.error('Erro ao buscar template de avaliação:', error);
      throw new Error('Erro ao buscar template de avaliação');
    }
  }

  async getPublished(): Promise<IEvaluationTemplate[]> {
    try {
      const response = await api.get<IEvaluationTemplate[]>('/evaluations/published');
      return response.data;
    } catch (error: any) {
      console.error('Erro ao buscar templates publicados:', error);
      throw new Error('Erro ao buscar templates publicados');
    }
  }

  async create(template: IEvaluationTemplate): Promise<IEvaluationTemplate> {
    try {
      const response = await api.post<IEvaluationTemplate>('/evaluations', template);
      return response.data;
    } catch (error: any) {
      console.error('Erro ao criar template de avaliação:', error);
      throw new Error('Erro ao criar template de avaliação');
    }
  }

  async update(id: string, template: Partial<IEvaluationTemplate>): Promise<IEvaluationTemplate> {
    try {
      const response = await api.put<IEvaluationTemplate>(`/evaluations/${id}`, template);
      return response.data;
    } catch (error: any) {
      console.error('Erro ao atualizar template de avaliação:', error);
      throw new Error('Erro ao atualizar template de avaliação');
    }
  }

  async delete(id: string): Promise<void> {
    try {
      await api.delete(`/evaluations/${id}`);
    } catch (error: any) {
      console.error('Erro ao excluir template de avaliação:', error);
      throw new Error('Erro ao excluir template de avaliação');
    }
  }

  async publish(id: string): Promise<IEvaluationTemplate> {
    try {
      const response = await api.post<IEvaluationTemplate>(`/evaluations/${id}/publish`);
      return response.data;
    } catch (error: any) {
      console.error('Erro ao publicar template de avaliação:', error);
      throw new Error('Erro ao publicar template de avaliação');
    }
  }

  async addQuestion(templateId: string, questionId: string): Promise<IEvaluationTemplate> {
    try {
      const response = await api.post<IEvaluationTemplate>(
        `/evaluations/${templateId}/questions`,
        { questionId }
      );
      return response.data;
    } catch (error: any) {
      console.error('Erro ao adicionar questão ao template:', error);
      throw new Error('Erro ao adicionar questão ao template');
    }
  }

  async removeQuestion(templateId: string, questionId: string): Promise<IEvaluationTemplate> {
    try {
      const response = await api.delete<IEvaluationTemplate>(
        `/evaluations/${templateId}/questions/${questionId}`
      );
      return response.data;
    } catch (error: any) {
      console.error('Erro ao remover questão do template:', error);
      throw new Error('Erro ao remover questão do template');
    }
  }
} 