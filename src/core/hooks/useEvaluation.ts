import { useState, useEffect } from 'react';
import { EvaluationTemplateUseCase } from '../useCases/EvaluationTemplateUseCase';
import { EvaluationTemplateRepository } from '../../infrastructure/repositories/EvaluationTemplateRepository';
import { IEvaluationTemplate } from '../domain/interfaces/IEvaluationTemplate';

export const useEvaluation = (evaluationId: string) => {
  const [evaluation, setEvaluation] = useState<IEvaluationTemplate | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const templateRepository = new EvaluationTemplateRepository();
  const templateUseCase = new EvaluationTemplateUseCase(templateRepository);

  useEffect(() => {
    const fetchEvaluation = async () => {
      try {
        setIsLoading(true);
        const data = await templateUseCase.getTemplateById(evaluationId);
        setEvaluation(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Erro ao carregar avaliação');
      } finally {
        setIsLoading(false);
      }
    };

    if (evaluationId) {
      fetchEvaluation();
    }
  }, [evaluationId]);

  const publish = async () => {
    try {
      setIsLoading(true);
      const updatedEvaluation = await templateUseCase.publishTemplate(evaluationId);
      setEvaluation(updatedEvaluation);
      return updatedEvaluation;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao publicar avaliação');
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  const archive = async () => {
    try {
      setIsLoading(true);
      const updatedEvaluation = await templateUseCase.updateTemplate(evaluationId, {
        status: 'arquivada'
      });
      setEvaluation(updatedEvaluation);
      return updatedEvaluation;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao arquivar avaliação');
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  const restore = async () => {
    try {
      setIsLoading(true);
      const updatedEvaluation = await templateUseCase.updateTemplate(evaluationId, {
        status: 'rascunho'
      });
      setEvaluation(updatedEvaluation);
      return updatedEvaluation;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao restaurar avaliação');
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  return {
    evaluation,
    isLoading,
    error,
    publish,
    archive,
    restore
  };
}; 