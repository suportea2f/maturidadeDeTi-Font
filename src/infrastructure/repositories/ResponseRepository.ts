import { IOption } from '../../core/domain/interfaces/IQuestion';
import api from '../api/axios';

export class ResponseRepository {
  async submitEvaluation(evaluationId: string, answers: Record<string, IOption>): Promise<any> {
    try {
      // Converte as respostas para o formato esperado pela API
      const responses = Object.entries(answers).map(([perguntaId, option]) => ({
        perguntaId,
        resposta: {
          texto: option.texto,
          selecionada: true,
          peso: option.peso
        }
      }));

      // Envia respostas para endpoint da avaliação
      const response = await api.post(`/evaluations/${evaluationId}/responses`, {
        respostas: responses
      });

      return response.data;
    } catch (error) {
      console.error('Erro ao enviar respostas:', error);
      throw new Error('Erro ao enviar as respostas da avaliação');
    }
  }
} 