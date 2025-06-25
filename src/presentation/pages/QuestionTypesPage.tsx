import React, { useState, useEffect, useCallback, useMemo } from 'react';
import {
  Box,
  Button,
  Typography,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  CircularProgress,
  Alert,
} from '@mui/material';
import { Add as AddIcon } from '@mui/icons-material';
import { QuestionTypeUseCase } from '../../core/useCases/QuestionTypeUseCase';
import { IQuestionType } from '../../core/domain/interfaces/IQuestionType';
import { QuestionTypeList } from '../components/QuestionTypeList';

const QuestionTypesPage: React.FC = () => {
  const [questionTypes, setQuestionTypes] = useState<IQuestionType[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [openDialog, setOpenDialog] = useState(false);
  const [selectedQuestionType, setSelectedQuestionType] = useState<IQuestionType | null>(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [questionTypeToDelete, setQuestionTypeToDelete] = useState<IQuestionType | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [formData, setFormData] = useState({ nome: '', descricao: '' });

  const questionTypeUseCase = useMemo(() => new QuestionTypeUseCase(), []);

  const loadQuestionTypes = useCallback(async () => {
    try {
      setLoading(true);
      const data = await questionTypeUseCase.getAllQuestionTypes();
      setQuestionTypes(data);
      setError(null);
    } catch (err) {
      setError('Erro ao carregar tipos de questões');
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, [questionTypeUseCase]);

  useEffect(() => {
    loadQuestionTypes();
  }, [loadQuestionTypes]);

  const handleCreate = () => {
    setSelectedQuestionType(null);
    setFormData({ nome: '', descricao: '' });
    setOpenDialog(true);
  };

  const handleEdit = (questionType: IQuestionType) => {
    setSelectedQuestionType(questionType);
    setFormData({ nome: questionType.nome, descricao: questionType.descricao });
    setOpenDialog(true);
  };

  const handleDelete = (questionType: IQuestionType) => {
    setQuestionTypeToDelete(questionType);
    setDeleteDialogOpen(true);
  };

  const handleSubmit = async () => {
    try {
      if (selectedQuestionType) {
        await questionTypeUseCase.updateQuestionType(selectedQuestionType._id, {
          nome: formData.nome,
          descricao: formData.descricao,
          ativo: true
        });
      } else {
        await questionTypeUseCase.createQuestionType({
          nome: formData.nome,
          descricao: formData.descricao,
          ativo: true
        });
      }
      setOpenDialog(false);
      loadQuestionTypes();
      setError(null);
    } catch (err) {
      setError('Erro ao salvar tipo de questão');
      console.error(err);
    }
  };

  const handleDeleteConfirm = async () => {
    if (questionTypeToDelete?._id) {
      try {
        await questionTypeUseCase.deleteQuestionType(questionTypeToDelete._id);
        setDeleteDialogOpen(false);
        loadQuestionTypes();
        setError(null);
      } catch (err) {
        setError('Erro ao excluir tipo de questão');
        console.error(err);
      }
    }
  };

  const filteredQuestionTypes = questionTypes.filter(
    (type) =>
      (type.nome?.toLowerCase() || '').includes(searchTerm.toLowerCase()) ||
      (type.descricao?.toLowerCase() || '').includes(searchTerm.toLowerCase())
  );

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="100vh">
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box sx={{ 
      width: '100%',
      maxWidth: '1600px',
      mx: 'auto',
      p: { xs: 2, md: 4 },
    }}>
      <Box sx={{ mb: 6, textAlign: 'center' }}>
        <Typography variant="h3" component="h1" color="text.primary" gutterBottom>
          Tipos de Questões
        </Typography>
        <Typography variant="h6" color="text.secondary">
          Gerencie os tipos de questões disponíveis para avaliações
        </Typography>
      </Box>

      <Box sx={{ 
        display: 'flex',
        flexDirection: { xs: 'column', sm: 'row' },
        justifyContent: 'space-between',
        alignItems: { xs: 'stretch', sm: 'center' },
        gap: 2,
        mb: 4,
      }}>
        <TextField
          placeholder="Buscar tipos de questões..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          sx={{
            flex: 1,
            maxWidth: { sm: '400px' },
            '& .MuiOutlinedInput-root': {
              bgcolor: 'background.paper',
            },
          }}
        />
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={handleCreate}
          size="large"
        >
          Novo Tipo de Questão
        </Button>
      </Box>

      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}

      <QuestionTypeList
        questionTypes={filteredQuestionTypes}
        onEdit={handleEdit}
        onDelete={(id) => {
          const questionType = questionTypes.find(q => q._id === id);
          if (questionType) {
            handleDelete(questionType);
          }
        }}
      />

      <Dialog open={openDialog} onClose={() => setOpenDialog(false)}>
        <DialogTitle>
          {selectedQuestionType ? 'Editar Tipo de Questão' : 'Novo Tipo de Questão'}
        </DialogTitle>
        <DialogContent>
          <Box display="flex" flexDirection="column" gap={2} mt={2}>
            <TextField
              label="Nome"
              fullWidth
              value={formData.nome}
              onChange={(e) => setFormData({ ...formData, nome: e.target.value })}
            />
            <TextField
              label="Descrição"
              fullWidth
              multiline
              rows={4}
              value={formData.descricao}
              onChange={(e) => setFormData({ ...formData, descricao: e.target.value })}
            />
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenDialog(false)}>Cancelar</Button>
          <Button onClick={handleSubmit} variant="contained" color="primary">
            Salvar
          </Button>
        </DialogActions>
      </Dialog>

      <Dialog open={deleteDialogOpen} onClose={() => setDeleteDialogOpen(false)}>
        <DialogTitle>Confirmar Exclusão</DialogTitle>
        <DialogContent>
          <Typography>
            Tem certeza que deseja excluir o tipo de questão "{questionTypeToDelete?.nome}"?
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDeleteDialogOpen(false)}>Cancelar</Button>
          <Button onClick={handleDeleteConfirm} variant="contained" color="error">
            Excluir
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default QuestionTypesPage; 