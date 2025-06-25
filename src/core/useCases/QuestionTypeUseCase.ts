import { IQuestionType } from '../domain/interfaces/IQuestionType';
import QuestionTypeRepository from '../../infrastructure/repositories/QuestionTypeRepository';

type CreateQuestionTypeDTO = {
  nome: string;
  descricao: string;
  ativo: boolean;
};

export class QuestionTypeUseCase {
  private repository: QuestionTypeRepository;

  constructor() {
    this.repository = new QuestionTypeRepository();
  }

  async getAllQuestionTypes(): Promise<IQuestionType[]> {
    return this.repository.getAll();
  }

  async getQuestionTypeById(id: string): Promise<IQuestionType> {
    return this.repository.getById(id);
  }

  async createQuestionType(questionType: CreateQuestionTypeDTO): Promise<IQuestionType> {
    return this.repository.create(questionType);
  }

  async updateQuestionType(id: string, questionType: Partial<CreateQuestionTypeDTO>): Promise<IQuestionType> {
    return this.repository.update(id, questionType);
  }

  async deleteQuestionType(id: string): Promise<void> {
    return this.repository.delete(id);
  }
} 