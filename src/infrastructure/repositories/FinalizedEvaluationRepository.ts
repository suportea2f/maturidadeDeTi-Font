import api from '../services/api';
import { IFinalizedEvaluation } from '../../core/domain/interfaces/IFinalizedEvaluation';

// Função auxiliar para transformar o payload vindo do backend no formato usado pela aplicação
const transformEvaluation = (data: any): IFinalizedEvaluation => {
  return {
    id: data._id || data.id,
    evaluationId: data.evaluationId,
    userId: data.userId,
    // "score" no front-end representa o percentual atingido. Alguns payloads antigos já vêm com "score",
    // porém a nova API envia "percentualAtual". Manter compatibilidade.
    score: typeof data.score === 'number' ? data.score : (data.percentualAtual ?? data.pesoAtingido ?? 0),
    // "maturityLevel" era o campo anterior; a nova API devolve "nivelMaturidade".
    maturityLevel: data.maturityLevel || data.nivelMaturidade || '',

    // Datas podem vir como string ISO. Mantemos o tipo string para evitar parse desnecessário.
    createdAt: data.createdAt,
    updatedAt: data.updatedAt,

    // Campos adicionais que a UI utiliza de forma opcional
    pesoAtingido: data.pesoAtingido,
    pesoTotalPossivel: data.pesoTotalPossivel,
    pontuacaoTotal: data.pontuacaoTotal ?? data.pesoTotalPossivel,
    percentualAtual: data.percentualAtual,
    percentual: data.percentualAtual,
    userName: data.userName,
    companyName: data.companyName,
    descricaoNivel: data.descricaoNivel,
    status: data.status,
    dataFinalizacao: data.dataFinalizacao,
  } as IFinalizedEvaluation;
};

class FinalizedEvaluationRepository {
  async getAll(): Promise<IFinalizedEvaluation[]> {
    const response = await api.get('/finalized-evaluations');
    return (response.data as any[]).map(transformEvaluation);
  }

  async getById(id: string): Promise<IFinalizedEvaluation> {
    const response = await api.get(`/finalized-evaluations/${id}`);
    return transformEvaluation(response.data);
  }

  async getByUserId(userId: string): Promise<IFinalizedEvaluation[]> {
    const response = await api.get(`/finalized-evaluations/user/${userId}`);
    return (response.data as any[]).map(transformEvaluation);
  }

  async getByEvaluationId(evaluationId: string): Promise<IFinalizedEvaluation[]> {
    const response = await api.get(`/finalized-evaluations/evaluation/${evaluationId}`);
    return (response.data as any[]).map(transformEvaluation);
  }

  async create(data: Omit<IFinalizedEvaluation, 'id' | 'createdAt' | 'updatedAt'>): Promise<IFinalizedEvaluation> {
    const response = await api.post('/finalized-evaluations', data);
    return transformEvaluation(response.data);
  }

  async update(id: string, data: Partial<IFinalizedEvaluation>): Promise<IFinalizedEvaluation> {
    const response = await api.put(`/finalized-evaluations/${id}`, data);
    return transformEvaluation(response.data);
  }

  async delete(id: string): Promise<void> {
    await api.delete(`/finalized-evaluations/${id}`);
  }
}

export default FinalizedEvaluationRepository; 