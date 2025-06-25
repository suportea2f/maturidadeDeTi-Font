import React, { useState, useEffect } from 'react';
import {
  Container,
  Typography,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Box,
  Alert,
  CircularProgress,
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { EvaluationUseCase } from '../../core/useCases/EvaluationUseCase';
import { IEvaluation } from '../../core/domain/interfaces/IEvaluation';
import { EvaluationRepository } from '../../infrastructure/repositories/EvaluationRepository';

export function EvaluationsPage() {
  const navigate = useNavigate();
  const [evaluations, setEvaluations] = useState<IEvaluation[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [openDialog, setOpenDialog] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [evaluationToDelete, setEvaluationToDelete] = useState<IEvaluation | null>(null);
  const [evaluationData, setEvaluationData] = useState<Partial<IEvaluation>>({
    titulo: '',
    descricao: '',
    status: 'Rascunho',
    pontuacao: 0,
    nivelMaturidade: '',
    userId: '',
    questionIds: [],
  });
  const [isAdmin, setIsAdmin] = useState(false);

  const loadEvaluations = async () => {
    try {
      setLoading(true);
      setError(null);
      const evaluationUseCase = new EvaluationUseCase(new EvaluationRepository());
      const evaluations = await evaluationUseCase.getAllEvaluations();
      setEvaluations(evaluations);
    } catch (err) {
      setError('Erro ao carregar avaliações. Por favor, tente novamente.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadEvaluations();
    // Descobrir se usuário é admin
    const userStr = localStorage.getItem('user');
    if (userStr) {
      try {
        const user = JSON.parse(userStr);
        const roleIdStr = String(user.roleId || '').toLowerCase();
        if (roleIdStr.includes('admin')) {
          setIsAdmin(true);
        }
        if (user.role && typeof user.role === 'string' && user.role.toLowerCase().includes('admin')) {
          setIsAdmin(true);
        }
        if (user.nome && typeof user.nome === 'string' && user.nome.toLowerCase().includes('admin')) {
          setIsAdmin(true);
        }
        if (user.email && typeof user.email === 'string' && user.email.toLowerCase().includes('admin')) {
          setIsAdmin(true);
        }
      } catch (err) {
        console.error('Erro ao analisar usuário:', err);
      }
    }
  }, []);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const userId = localStorage.getItem('userId') || '';
      const evaluationUseCase = new EvaluationUseCase(new EvaluationRepository());
      const newEvaluation: Omit<IEvaluation, '_id' | 'createdAt' | 'updatedAt'> = {
        titulo: evaluationData.titulo || '',
        descricao: evaluationData.descricao || '',
        status: evaluationData.status || 'Rascunho',
        pontuacao: evaluationData.pontuacao || 0,
        nivelMaturidade: evaluationData.nivelMaturidade || '',
        userId: userId,
        questionIds: evaluationData.questionIds || [],
      };
      await evaluationUseCase.createEvaluation(newEvaluation);
      setOpenDialog(false);
      loadEvaluations();
    } catch (err) {
      setError('Erro ao salvar avaliação');
      console.error(err);
    }
  };

  const handleDelete = (evaluation: IEvaluation) => {
    setEvaluationToDelete(evaluation);
    setDeleteDialogOpen(true);
  };

  const handleDeleteConfirm = async () => {
    const evalId = evaluationToDelete?.id || evaluationToDelete?._id;
    if (!evalId) return;

    try {
      setLoading(true);
      setError(null);
      const evaluationUseCase = new EvaluationUseCase(new EvaluationRepository());
      await evaluationUseCase.deleteEvaluation(evalId);
      setDeleteDialogOpen(false);
      await loadEvaluations();
    } catch (err) {
      setError('Erro ao excluir avaliação. Por favor, tente novamente.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handlePublish = async (evaluation: IEvaluation) => {
    try {
      setLoading(true);
      setError(null);
      console.log('Publicar avaliação ID:', evaluation.id || evaluation._id);
      const evaluationUseCase = new EvaluationUseCase(new EvaluationRepository());
      await evaluationUseCase.updateEvaluation((evaluation.id || evaluation._id)!, { publicada: true });
      await loadEvaluations();
    } catch (err) {
      setError('Erro ao publicar avaliação. Por favor, tente novamente.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleFinalize = async (evaluation: IEvaluation) => {
    try {
      setLoading(true);
      setError(null);
      const evaluationUseCase = new EvaluationUseCase(new EvaluationRepository());
      await evaluationUseCase.finalizeEvaluation(
        (evaluation.id || evaluation._id)!,
        evaluation.pontuacao || 0,
        evaluation.nivelMaturidade || ''
      );
      await loadEvaluations();
    } catch (err) {
      setError('Erro ao finalizar avaliação. Por favor, tente novamente.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container>
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          Avaliações
        </Typography>
        <Button
          variant="contained"
          color="primary"
          onClick={() => navigate('/evaluations/new')}
        >
          Nova Avaliação
        </Button>
      </Box>

      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}

      {loading ? (
        <Box display="flex" justifyContent="center" alignItems="center" minHeight="200px">
          <CircularProgress />
        </Box>
      ) : evaluations.length === 0 ? (
        <Typography variant="body1" color="text.secondary" align="center">
          Nenhuma avaliação encontrada.
        </Typography>
      ) : (
        <Box>
          {evaluations.map((evaluation, index) => (
            <Box
              key={evaluation.id || evaluation._id || `evaluation-${index}`}
              sx={{
                border: '1px solid',
                borderColor: 'divider',
                borderRadius: 1,
                p: 2,
                mb: 2,
              }}
            >
              <Typography variant="h6" gutterBottom>
                {evaluation.titulo}
              </Typography>
              <Typography variant="body2" color="text.secondary" gutterBottom>
                {evaluation.descricao}
              </Typography>
              <Typography variant="body2">
                Status: {evaluation.status}
              </Typography>
              <Box sx={{ mt: 2 }}>
                <Button
                  variant="outlined"
                  color="primary"
                  onClick={() => navigate(`/evaluations/${evaluation.id || evaluation._id}/edit`)}
                  sx={{ mr: 1 }}
                >
                  Editar
                </Button>
                {isAdmin && (
                  <>
                    <Button
                      variant="outlined"
                      color="success"
                      onClick={() => handlePublish(evaluation)}
                      sx={{ mr: 1 }}
                    >
                      Publicar
                    </Button>
                    <Button
                      variant="outlined"
                      color="secondary"
                      onClick={() => handleFinalize(evaluation)}
                      sx={{ mr: 1 }}
                    >
                      Finalizar
                    </Button>
                  </>
                )}
                <Button
                  variant="outlined"
                  color="error"
                  onClick={() => handleDelete(evaluation)}
                >
                  Excluir
                </Button>
              </Box>
            </Box>
          ))}
        </Box>
      )}

      <Dialog
        open={openDialog}
        onClose={() => setOpenDialog(false)}
        aria-labelledby="edit-dialog-title"
      >
        <DialogTitle id="edit-dialog-title">
          Editar Avaliação
        </DialogTitle>
        <DialogContent>
          <Box component="form" onSubmit={(e) => handleSave(e)} sx={{ mt: 2 }}>
            <TextField
              fullWidth
              label="Título"
              value={evaluationData.titulo}
              onChange={(e) => setEvaluationData({
                ...evaluationData,
                titulo: e.target.value
              })}
              sx={{ mb: 2 }}
            />
            <TextField
              fullWidth
              label="Descrição"
              multiline
              rows={4}
              value={evaluationData.descricao}
              onChange={(e) => setEvaluationData({
                ...evaluationData,
                descricao: e.target.value
              })}
              sx={{ mb: 2 }}
            />
            <TextField
              fullWidth
              label="Pontuação"
              type="number"
              value={evaluationData.pontuacao}
              onChange={(e) => setEvaluationData({
                ...evaluationData,
                pontuacao: Number(e.target.value)
              })}
              sx={{ mb: 2 }}
            />
            <TextField
              fullWidth
              label="Nível de Maturidade"
              value={evaluationData.nivelMaturidade}
              onChange={(e) => setEvaluationData({
                ...evaluationData,
                nivelMaturidade: e.target.value
              })}
            />
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenDialog(false)} color="inherit">
            Cancelar
          </Button>
          <Button onClick={(e) => handleSave(e)} color="primary" variant="contained">
            Salvar
          </Button>
        </DialogActions>
      </Dialog>

      <Dialog
        open={deleteDialogOpen}
        onClose={() => setDeleteDialogOpen(false)}
        aria-labelledby="delete-dialog-title"
      >
        <DialogTitle id="delete-dialog-title">
          Confirmar Exclusão
        </DialogTitle>
        <DialogContent>
          <Typography>
            Tem certeza que deseja excluir a avaliação "{evaluationToDelete?.titulo}"?
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDeleteDialogOpen(false)} color="inherit">
            Cancelar
          </Button>
          <Button onClick={handleDeleteConfirm} color="error" variant="contained">
            Excluir
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
} 