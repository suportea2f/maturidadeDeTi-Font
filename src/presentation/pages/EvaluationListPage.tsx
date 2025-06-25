import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Box, Typography, Button, Alert } from '@mui/material';
import { Add as AddIcon } from '@mui/icons-material';
import { EvaluationList } from '../components/EvaluationList';
import { EvaluationUseCase } from '../../core/useCases/EvaluationUseCase';
import { EvaluationRepository } from '../../infrastructure/repositories/EvaluationRepository';
import { IEvaluation } from '../../core/domain/interfaces/IEvaluation';

export const EvaluationListPage: React.FC = () => {
  const navigate = useNavigate();
  const [evaluations, setEvaluations] = useState<IEvaluation[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  const evaluationRepository = new EvaluationRepository();
  const evaluationUseCase = new EvaluationUseCase(evaluationRepository);

  useEffect(() => {
    const loadEvaluations = async () => {
      try {
        const data = await evaluationUseCase.getAllEvaluations();
        setEvaluations(data);
        setError(null);
      } catch (err) {
        setError('Erro ao carregar avaliações');
      } finally {
        setLoading(false);
      }
    };

    loadEvaluations();
  }, [evaluationUseCase]);

  const handleEdit = (evaluation: IEvaluation) => {
    navigate(`/evaluations/${evaluation._id}/edit`);
  };

  const handleDelete = async (id: string) => {
    try {
      await evaluationUseCase.deleteEvaluation(id);
      setEvaluations(prev => prev.filter(e => e._id !== id));
      setError(null);
    } catch (err) {
      setError('Erro ao deletar avaliação');
    }
  };

  if (loading) {
    return (
      <Box sx={{ p: 3, textAlign: 'center' }}>
        <Typography>Carregando...</Typography>
      </Box>
    );
  }

  return (
    <Box sx={{ p: 3 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h4">Avaliações</Typography>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={() => navigate('/evaluations/new')}
        >
          Nova Avaliação
        </Button>
      </Box>

      {error && (
        <Alert severity="error" sx={{ mb: 3 }}>
          {error}
        </Alert>
      )}

      <EvaluationList
        evaluations={evaluations}
        onEdit={handleEdit}
        onDelete={handleDelete}
      />
    </Box>
  );
}; 