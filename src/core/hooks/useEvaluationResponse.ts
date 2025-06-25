import { useState } from 'react';
import { IEvaluationResponse, IEvaluationAnswer } from '../domain/interfaces/IEvaluationResponse';
import { evaluationService } from '../services/evaluationService';

export const useEvaluationResponse = (evaluationId: string) => {
  const [response, setResponse] = useState<IEvaluationResponse | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const addAnswer = async (questionId: string, answer: IEvaluationAnswer) => {
    try {
      setLoading(true);
      const updatedResponse = await evaluationService.addAnswer(evaluationId, questionId, answer);
      setResponse(updatedResponse);
      return updatedResponse;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao adicionar resposta');
      return undefined;
    } finally {
      setLoading(false);
    }
  };

  const finalizeResponse = async () => {
    try {
      setLoading(true);
      const finalizedResponse = await evaluationService.finalizeResponse(evaluationId);
      setResponse(finalizedResponse);
      return finalizedResponse;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao finalizar avaliação');
      return undefined;
    } finally {
      setLoading(false);
    }
  };

  return {
    response,
    loading,
    error,
    addAnswer,
    finalizeResponse,
    isLoading: loading,
    saveAnswer: addAnswer,
    finalize: finalizeResponse
  };
}; 