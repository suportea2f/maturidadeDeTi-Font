import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Container,
  Typography,
  Box,
  Paper,
  CircularProgress,
  Alert,
  Button,
  Grid,
  LinearProgress,
} from '@mui/material';
import FinalizedEvaluationUseCase from '../../core/useCases/FinalizedEvaluationUseCase';
import { IFinalizedEvaluation } from '../../core/domain/interfaces/IFinalizedEvaluation';

const EvaluationResultPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [evaluation, setEvaluation] = useState<IFinalizedEvaluation | null>(null);
  const finalizedEvaluationUseCase = new FinalizedEvaluationUseCase();

  useEffect(() => {
    const loadEvaluation = async () => {
      try {
        if (!id) {
          throw new Error('ID da avaliação não fornecido');
        }
        const data = await finalizedEvaluationUseCase.getFinalizedEvaluationById(id);
        setEvaluation(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Erro ao carregar avaliação');
      } finally {
        setLoading(false);
      }
    };

    loadEvaluation();
  }, [id]);

  const getMaturityLevelColor = (score: number) => {
    if (score >= 80) return 'success';
    if (score >= 60) return 'info';
    if (score >= 40) return 'warning';
    return 'error';
  };

  const getRecommendations = (score: number): string[] => {
    if (score >= 0 && score < 20) {
      return [
        'Implementar processos básicos de TI',
        'Documentar procedimentos operacionais',
        'Estabelecer métricas iniciais',
      ];
    }
    if (score >= 20 && score < 40) {
      return [
        'Padronizar processos de TI',
        'Implementar ferramentas de gestão',
        'Treinar equipe em boas práticas',
      ];
    }
    if (score >= 40 && score < 60) {
      return [
        'Automatizar processos de TI',
        'Implementar gestão de qualidade',
        'Desenvolver métricas avançadas',
      ];
    }
    if (score >= 60 && score < 80) {
      return [
        'Otimizar processos existentes',
        'Implementar análise preditiva',
        'Desenvolver inovações em TI',
      ];
    }
    return [
      'Manter excelência operacional',
      'Explorar novas tecnologias',
      'Compartilhar melhores práticas',
    ];
  };

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="100vh">
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Container>
        <Alert severity="error" sx={{ mt: 2 }}>
          {error}
        </Alert>
        <Button
          variant="contained"
          color="primary"
          onClick={() => navigate('/evaluations')}
          sx={{ mt: 2 }}
        >
          Voltar para Lista de Avaliações
        </Button>
      </Container>
    );
  }

  if (!evaluation) {
    return (
      <Container>
        <Alert severity="warning" sx={{ mt: 2 }}>
          Avaliação não encontrada
        </Alert>
        <Button
          variant="contained"
          color="primary"
          onClick={() => navigate('/evaluations')}
          sx={{ mt: 2 }}
        >
          Voltar para Lista de Avaliações
        </Button>
      </Container>
    );
  }

  const recommendations = getRecommendations(evaluation.score);

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Paper elevation={3} sx={{ p: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          Resultado da Avaliação
        </Typography>

        <Grid container spacing={4}>
          <Grid item xs={12} md={6}>
            <Box sx={{ mb: 4 }}>
              <Typography variant="h6" gutterBottom>
                Informações Gerais
              </Typography>
              <Typography>
                <strong>ID da Avaliação:</strong> {evaluation.evaluationId}
              </Typography>
              <Typography>
                <strong>Data:</strong> {new Date(evaluation.createdAt).toLocaleDateString()}
              </Typography>
              <Typography>
                <strong>Pontuação:</strong> {evaluation.score.toFixed(2)}%
              </Typography>
            </Box>

            <Box sx={{ mb: 4 }}>
              <Typography variant="h6" gutterBottom>
                Nível de Maturidade
              </Typography>
              <Typography variant="h5" color="primary">
                {evaluation.maturityLevel}
              </Typography>
              <LinearProgress
                variant="determinate"
                value={evaluation.score}
                color={getMaturityLevelColor(evaluation.score)}
                sx={{ height: 10, borderRadius: 5, mt: 2 }}
              />
            </Box>
          </Grid>

          <Grid item xs={12} md={6}>
            <Box>
              <Typography variant="h6" gutterBottom>
                Recomendações
              </Typography>
              <ul>
                {recommendations.map((recommendation, index) => (
                  <li key={index}>
                    <Typography>{recommendation}</Typography>
                  </li>
                ))}
              </ul>
            </Box>
          </Grid>
        </Grid>

        <Box sx={{ mt: 4, display: 'flex', gap: 2 }}>
          <Button
            variant="contained"
            color="primary"
            onClick={() => navigate('/evaluations')}
          >
            Voltar para Lista de Avaliações
          </Button>
          <Button
            variant="outlined"
            color="primary"
            onClick={() => navigate(`/evaluations/${evaluation.evaluationId}`)}
          >
            Ver Detalhes da Avaliação
          </Button>
        </Box>
      </Paper>
    </Container>
  );
};

export default EvaluationResultPage; 