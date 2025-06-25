import { IEvaluationResponse, IEvaluationResponseRepository, IEvaluationAnswer } from '../domain/interfaces/IEvaluationResponse';
import { IEvaluationTemplateRepository } from '../domain/interfaces/IEvaluationTemplate';
import { IAnswer as IQuestionAnswer } from '../domain/interfaces/IQuestion';

export class EvaluationResponseUseCase {
  constructor(
    private evaluationResponseRepository: IEvaluationResponseRepository,
    private evaluationTemplateRepository: IEvaluationTemplateRepository
  ) {}

  async getAllResponses(): Promise<IEvaluationResponse[]> {
    return this.evaluationResponseRepository.getAll();
  }

  async getResponseById(id: string): Promise<IEvaluationResponse | null> {
    return this.evaluationResponseRepository.getById(id);
  }

  async getUserResponses(userId: string): Promise<IEvaluationResponse[]> {
    return this.evaluationResponseRepository.getByUserId(userId);
  }

  async getTemplateResponses(templateId: string): Promise<IEvaluationResponse[]> {
    return this.evaluationResponseRepository.getByTemplateId(templateId);
  }

  async startResponse(userId: string, templateId: string): Promise<IEvaluationResponse> {
    // Verificar se o template existe e está publicado
    const template = await this.evaluationTemplateRepository.getById(templateId);
    
    if (!template) {
      throw new Error('Template de avaliação não encontrado');
    }
    
    if (template.status !== 'publicada') {
      throw new Error('Este template não está disponível para respostas');
    }
    
    // Criar resposta inicial
    const newResponse: IEvaluationResponse = {
      userId,
      evaluationId: templateId,
      answers: [],
      score: 0,
      pontuacao: 0,
      status: 'em andamento',
      id: '', // Será preenchido pelo backend
      createdAt: new Date(),
      updatedAt: new Date()
    };
    
    return this.evaluationResponseRepository.create(newResponse);
  }

  async addAnswer(responseId: string, answer: IEvaluationAnswer): Promise<IEvaluationResponse> {
    return this.evaluationResponseRepository.addAnswer(responseId, answer);
  }

  async finalizeResponse(responseId: string): Promise<IEvaluationResponse> {
    return this.evaluationResponseRepository.finalizeResponse(responseId);
  }

  async cancelResponse(responseId: string): Promise<IEvaluationResponse> {
    return this.evaluationResponseRepository.update(responseId, {
      status: 'cancelada'
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

  async getByEvaluationId(evaluationId: string): Promise<IEvaluationResponse | null> {
    const responses = await this.evaluationResponseRepository.getByTemplateId(evaluationId);
    return responses[0] || null;
  }
} 