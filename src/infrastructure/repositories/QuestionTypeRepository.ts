import { IQuestionType } from '../../core/domain/interfaces/IQuestionType';
import { api } from '../api/api';

type CreateQuestionTypeDTO = {
  nome: string;
  descricao: string;
  ativo: boolean;
};

export default class QuestionTypeRepository {
  async getAll(): Promise<IQuestionType[]> {
    const response = await api.get<IQuestionType[]>('/question-types');
    return response.data;
  }

  async getById(id: string): Promise<IQuestionType> {
    const response = await api.get<IQuestionType>(`/question-types/${id}`);
    return response.data;
  }

  async create(questionType: CreateQuestionTypeDTO): Promise<IQuestionType> {
    const response = await api.post<IQuestionType>('/question-types', questionType);
    return response.data;
  }

  async update(id: string, questionType: Partial<CreateQuestionTypeDTO>): Promise<IQuestionType> {
    const response = await api.put<IQuestionType>(`/question-types/${id}`, questionType);
    return response.data;
  }

  async delete(id: string): Promise<void> {
    await api.delete(`/question-types/${id}`);
  }
} 