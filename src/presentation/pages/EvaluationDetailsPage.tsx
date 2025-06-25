import React from 'react';
import {
  Container,
  Typography,
  Box,
  Paper,
  Button,
  List,
  ListItem,
  ListItemText,
  Divider,
  CircularProgress,
  Alert,
  useTheme,
} from '@mui/material';
import { useParams, useNavigate } from 'react-router-dom';
import { useEvaluation } from '../../core/hooks/useEvaluation';
import { ProgressBar } from '../components/ProgressBar';

export const EvaluationDetailsPage: React.FC = () => {
  const theme = useTheme();
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const { evaluation, isLoading, error, publish, archive, restore } = useEvaluation(id || '');

  const handlePublish = async () => {
    try {
      await publish();
    } catch (err) {
      console.error('Erro ao publicar avaliação:', err);
    }
  };

  const handleArchive = async () => {
    try {
      await archive();
    } catch (err) {
      console.error('Erro ao arquivar avaliação:', err);
    }
  };

  const handleRestore = async () => {
    try {
      await restore();
    } catch (err) {
      console.error('Erro ao restaurar avaliação:', err);
    }
  };

  if (isLoading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', py: 4 }}>
        <CircularProgress />
      </Box>
    );
  }

  if (error || !evaluation) {
    return (
      <Alert severity="error" sx={{ m: 2 }}>
        {error || 'Avaliação não encontrada'}
      </Alert>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Paper sx={{ p: 4, mb: 4 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 3 }}>
          <Box>
            <Typography variant="h4" component="h1" gutterBottom>
              {evaluation.nome}
            </Typography>
            <Typography variant="body1" color="text.secondary" paragraph>
              {evaluation.descricao}
            </Typography>
          </Box>
          
          <Box sx={{ display: 'flex', gap: 2 }}>
            {evaluation.status === 'rascunho' && (
              <Button
                variant="contained"
                color="primary"
                onClick={handlePublish}
              >
                Publicar
              </Button>
            )}
            
            {evaluation.status === 'publicada' && (
              <Button
                variant="outlined"
                color="error"
                onClick={handleArchive}
              >
                Arquivar
              </Button>
            )}
            
            {evaluation.status === 'arquivada' && (
              <Button
                variant="outlined"
                color="primary"
                onClick={handleRestore}
              >
                Restaurar
              </Button>
            )}
          </Box>
        </Box>

        <Divider sx={{ my: 3 }} />

        <Box sx={{ mb: 4 }}>
          <Typography variant="h6" gutterBottom>
            Questões ({evaluation.questionIds.length})
          </Typography>
          
          <List>
            {evaluation.questionIds.map((questionId, index) => (
              <ListItem key={questionId} divider>
                <ListItemText
                  primary={`Questão ${index + 1}`}
                  secondary={`ID: ${questionId}`}
                />
              </ListItem>
            ))}
          </List>
        </Box>

        <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
          <Button
            variant="outlined"
            onClick={() => navigate('/evaluations')}
          >
            Voltar
          </Button>
          
          {evaluation.status === 'publicada' && (
            <Button
              variant="contained"
              onClick={() => navigate(`/evaluations/${id}/respond`)}
            >
              Responder Avaliação
            </Button>
          )}
        </Box>
      </Paper>
    </Container>
  );
}; 