import { IEvaluation, IEvaluationRepository } from '../domain/interfaces/IEvaluation';

export class EvaluationUseCase {
  constructor(private evaluationRepository: IEvaluationRepository) {}

  async getAllEvaluations(): Promise<IEvaluation[]> {
    const evaluations = await this.evaluationRepository.getAll();
    return evaluations.map(e => ({ ...e, tempoLimiteMinutos: e.tempoLimiteMinutos }));
  }

  async getEvaluationById(id: string): Promise<IEvaluation | null> {
    const evaluation = await this.evaluationRepository.getById(id);
    if (!evaluation) return null;
    return { ...evaluation, tempoLimiteMinutos: evaluation.tempoLimiteMinutos };
  }

  async getEvaluationsByUserId(userId: string): Promise<IEvaluation[]> {
    return this.evaluationRepository.getByUserId(userId);
  }

  async createEvaluation(evaluation: Omit<IEvaluation, '_id' | 'createdAt' | 'updatedAt'>): Promise<IEvaluation> {
    const newEvaluation: IEvaluation = {
      titulo: evaluation.titulo,
      descricao: evaluation.descricao,
      status: evaluation.status || 'Rascunho',
      _id: '', // Será preenchido pelo backend
      userId: evaluation.userId,
      questionIds: evaluation.questionIds || [],
      pontuacao: evaluation.pontuacao || 0,
      nivelMaturidade: evaluation.nivelMaturidade || '',
      createdAt: new Date(),
      updatedAt: new Date(),
      tempoLimiteMinutos: evaluation.tempoLimiteMinutos,
      quantidadeParticipantes: evaluation.quantidadeParticipantes,
    };

    return this.evaluationRepository.create(newEvaluation);
  }

  async updateEvaluation(id: string, evaluation: Partial<IEvaluation>): Promise<IEvaluation> {
    return this.evaluationRepository.update(id, evaluation);
  }

  async deleteEvaluation(id: string): Promise<void> {
    await this.evaluationRepository.delete(id);
  }

  async publishEvaluation(id: string): Promise<IEvaluation> {
    return this.evaluationRepository.publish(id);
  }

  async finalizeEvaluation(id: string, pontuacao: number, nivelMaturidade: string): Promise<IEvaluation> {
    return this.evaluationRepository.update(id, {
      status: 'Finalizada',
      pontuacao,
      nivelMaturidade
    });
  }

  private calculateMaturityLevel(pontuacao: number): string {
    if (pontuacao < 30) {
      return 'Nível 1 - Inicial';
    } else if (pontuacao < 50) {
      return 'Nível 2 - Gerenciado';
    } else if (pontuacao < 70) {
      return 'Nível 3 - Definido';
    } else if (pontuacao < 85) {
      return 'Nível 4 - Quantitativamente Gerenciado';
    } else {
      return 'Nível 5 - Otimizado';
    }
  }
} 