import { api } from '../api/api';
import { IQuestion } from '../../core/domain/interfaces/IQuestion';

export class QuestionRepository {
  async getAll(): Promise<IQuestion[]> {
    const response = await api.get<IQuestion[]>('/questions');
    return response.data;
  }

  async getQuestions(): Promise<IQuestion[]> {
    return this.getAll();
  }

  async getById(id: string): Promise<IQuestion | null> {
    try {
      const response = await api.get<IQuestion>(`/questions/${id}`);
      return response.data;
    } catch (error) {
      return null;
    }
  }

  async getQuestionById(id: string): Promise<IQuestion | null> {
    return this.getById(id);
  }

  async create(question: Omit<IQuestion, '_id' | 'authUserId' | 'createdAt' | 'updatedAt' | 'toJSON'>): Promise<IQuestion> {
    const response = await api.post<IQuestion>('/questions', question);
    return response.data;
  }

  async update(id: string, question: Partial<IQuestion>): Promise<IQuestion> {
    const response = await api.put<IQuestion>(`/questions/${id}`, question);
    return response.data;
  }

  async delete(id: string): Promise<void> {
    await api.delete(`/questions/${id}`);
  }
} 