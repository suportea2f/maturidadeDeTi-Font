import FinalizedEvaluationRepository from '../../infrastructure/repositories/FinalizedEvaluationRepository';
import { IFinalizedEvaluation } from '../domain/interfaces/IFinalizedEvaluation';

export default class FinalizedEvaluationUseCase {
  private repository: FinalizedEvaluationRepository;

  constructor() {
    this.repository = new FinalizedEvaluationRepository();
  }

  async getAllFinalizedEvaluations(): Promise<IFinalizedEvaluation[]> {
    return this.repository.getAll();
  }

  async getFinalizedEvaluationById(id: string): Promise<IFinalizedEvaluation> {
    return this.repository.getById(id);
  }

  async getFinalizedEvaluationsByUserId(userId: string): Promise<IFinalizedEvaluation[]> {
    return this.repository.getByUserId(userId);
  }

  async getFinalizedEvaluationsByEvaluationId(evaluationId: string): Promise<IFinalizedEvaluation[]> {
    return this.repository.getByEvaluationId(evaluationId);
  }

  async createFinalizedEvaluation(data: Omit<IFinalizedEvaluation, 'id' | 'createdAt' | 'updatedAt'>): Promise<IFinalizedEvaluation> {
    return this.repository.create(data);
  }

  async updateFinalizedEvaluation(id: string, data: Partial<IFinalizedEvaluation>): Promise<IFinalizedEvaluation> {
    return this.repository.update(id, data);
  }

  async deleteFinalizedEvaluation(id: string): Promise<void> {
    return this.repository.delete(id);
  }
} 