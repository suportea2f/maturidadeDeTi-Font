import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Button,
  useTheme,
  CircularProgress,
  Alert,
  Chip,
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import FinalizedEvaluationUseCase from '../../core/useCases/FinalizedEvaluationUseCase';
import { IFinalizedEvaluation } from '../../core/domain/interfaces/IFinalizedEvaluation';

export const FinalizedEvaluationsPage: React.FC = () => {
  const theme = useTheme();
  const navigate = useNavigate();
  const [evaluations, setEvaluations] = useState<IFinalizedEvaluation[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const finalizedEvaluationUseCase = new FinalizedEvaluationUseCase();

  useEffect(() => {
    loadEvaluations();
  }, []);

  const loadEvaluations = async () => {
    try {
      setLoading(true);
      const data = await finalizedEvaluationUseCase.getAllFinalizedEvaluations();
      setEvaluations(data);
      setError(null);
    } catch (err) {
      setError('Erro ao carregar avaliações finalizadas');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const getMaturityLevelColor = (score: number) => {
    if (score >= 80) return 'success';
    if (score >= 60) return 'info';
    if (score >= 40) return 'warning';
    return 'error';
  };

  const getMaturityLevelLabel = (score: number) => {
    if (score >= 80) return 'Alto';
    if (score >= 60) return 'Médio-Alto';
    if (score >= 40) return 'Médio';
    return 'Baixo';
  };

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box sx={{ p: 3 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h4" component="h1">
          Avaliações Finalizadas
        </Typography>
      </Box>

      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}

      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>ID da Avaliação</TableCell>
              <TableCell>Data</TableCell>
              <TableCell>Pontuação</TableCell>
              <TableCell>Nível de Maturidade</TableCell>
              <TableCell align="right">Ações</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {evaluations.map((evaluation) => (
              <TableRow key={evaluation.id}>
                <TableCell>{evaluation.evaluationId}</TableCell>
                <TableCell>{new Date(evaluation.createdAt).toLocaleDateString()}</TableCell>
                <TableCell>{evaluation.score.toFixed(2)}%</TableCell>
                <TableCell>
                  <Chip
                    label={getMaturityLevelLabel(evaluation.score)}
                    color={getMaturityLevelColor(evaluation.score)}
                  />
                </TableCell>
                <TableCell align="right">
                  <Button
                    variant="outlined"
                    onClick={() => navigate(`/evaluations/${evaluation.id}/result`)}
                  >
                    Ver Resultado
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
}; 