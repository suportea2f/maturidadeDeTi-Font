import React, { useState, useEffect, useCallback, useRef, useMemo } from 'react';
import {
  Container,
  Box,
  Button,
  CircularProgress,
  Alert,
  Typography,
  LinearProgress
} from '@mui/material';
import { useNavigate, useParams } from 'react-router-dom';
import { QuestionRepository } from '../../infrastructure/repositories/QuestionRepository';
import { IQuestion } from '../../core/domain/interfaces/IQuestion';
import { QuestionStepper } from '../components/QuestionStepper';
import { EvaluationRepository } from '../../infrastructure/repositories/EvaluationRepository';
import { EvaluationUseCase } from '../../core/useCases/EvaluationUseCase';
import { IEvaluation } from '../../core/domain/interfaces/IEvaluation';

export const EvaluationResponsePage: React.FC = () => {
  const navigate = useNavigate();
  const { id: evaluationId } = useParams<{ id: string }>();
  const [questions, setQuestions] = useState<IQuestion[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [evaluation, setEvaluation] = useState<IEvaluation | null>(null);
  const [timeLeft, setTimeLeft] = useState<number | null>(null); // em segundos
  const [timerExpired, setTimerExpired] = useState(false);
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const [startTime, setStartTime] = useState<number | null>(null);

  const questionRepository = useMemo(() => new QuestionRepository(), []);
  const evaluationUseCase = useMemo(() => new EvaluationUseCase(new EvaluationRepository()), []);

  // Função para buscar avaliação e perguntas
  const loadQuestions = useCallback(async () => {
    try {
      setLoading(true);
      if (evaluationId) {
        const evalData = await evaluationUseCase.getEvaluationById(evaluationId);
        setEvaluation(evalData);
        if (evalData && (evalData as any).questions && Array.isArray((evalData as any).questions)) {
          setQuestions((evalData as any).questions as IQuestion[]);
        } else {
          // fallback: fetch all
          const data = await questionRepository.getAll();
          setQuestions(data);
        }
        // Iniciar timer
        const tempoLimite = evalData?.tempoLimiteMinutos || 30;
        setTimeLeft(tempoLimite * 60); // segundos
        setStartTime(Date.now());
      }
      setError(null);
    } catch (err) {
      console.error('Erro ao carregar questões:', err);
      setError('Erro ao carregar questões. Por favor, tente novamente.');
    } finally {
      setLoading(false);
    }
  }, [evaluationId, evaluationUseCase, questionRepository]);

  // Timer regressivo
  useEffect(() => {
    if (timeLeft === null || timerExpired) return;
    if (timeLeft <= 0) {
      setTimerExpired(true);
      return;
    }
    timerRef.current = setTimeout(() => setTimeLeft((t) => (t ? t - 1 : 0)), 1000);
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, [timeLeft, timerExpired]);

  // Carregar perguntas e avaliação
  useEffect(() => {
    loadQuestions();
    // eslint-disable-next-line
  }, [loadQuestions]);

  // Finalizar avaliação (manual ou automático)
  const handleFinish = async () => {
    if (!evaluationId) return;
    try {
      // Calcular tempo gasto
      if (startTime) {
        // Se quiser enviar para a API, use:
        // const tempoGastoSegundos = Math.floor((Date.now() - startTime) / 1000);
      }
      await new EvaluationRepository().finalize(evaluationId);
      navigate(`/evaluations/${evaluationId}/results`);
    } catch (err) {
      console.error('Erro ao finalizar avaliação:', err);
      setError('Erro ao finalizar avaliação');
    }
  };

  // Finalizar automaticamente quando o tempo acabar
  useEffect(() => {
    if (timerExpired) {
      handleFinish();
    }
    // eslint-disable-next-line
  }, [timerExpired]);

  // Formatar tempo mm:ss
  const formatTime = (seconds: number) => {
    const m = Math.floor(seconds / 60).toString().padStart(2, '0');
    const s = (seconds % 60).toString().padStart(2, '0');
    return `${m}:${s}`;
  };

  if (loading) {
    return (
      <Container>
        <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
          <CircularProgress />
        </Box>
      </Container>
    );
  }

  if (error) {
    return (
      <Container>
        <Alert severity="error" sx={{ mt: 4 }}>
          {error}
        </Alert>
        <Button onClick={loadQuestions} sx={{ mt: 2 }}>
          Tentar Novamente
        </Button>
      </Container>
    );
  }

  return (
    <Container maxWidth="md" sx={{ py: 6 }}>
      {timeLeft !== null && (
        <Box mb={4} display="flex" alignItems="center" gap={2}>
          <Typography variant="h6" color={timeLeft < 60 ? 'error' : 'primary'}>
            Tempo restante: {formatTime(timeLeft)}
          </Typography>
          <Box flex={1}>
            <LinearProgress
              variant="determinate"
              value={evaluation?.tempoLimiteMinutos ? ((timeLeft / (evaluation.tempoLimiteMinutos * 60)) * 100) : 100}
              color={timeLeft < 60 ? 'error' : 'primary'}
              sx={{ height: 8, borderRadius: 5 }}
            />
          </Box>
        </Box>
      )}
      <QuestionStepper
        evaluationId={evaluationId || ''}
        questions={questions}
        onFinish={handleFinish}
      />
    </Container>
  );
}; 