import React, { useState, useEffect, useMemo, useCallback } from 'react';
import {
  Box,
  Button,
  Typography,
  TextField,
  CircularProgress,
  Alert,
  Dialog,
  DialogContent,
} from '@mui/material';
import { Add as AddIcon } from '@mui/icons-material';
import { QuestionList } from '../components/QuestionList';
import { QuestionForm } from '../components/QuestionForm';
import { IQuestion } from '../../core/domain/interfaces/IQuestion';
import { IQuestionType } from '../../core/domain/interfaces/IQuestionType';
import { QuestionRepository } from '../../infrastructure/repositories/QuestionRepository';
import QuestionTypeRepository from '../../infrastructure/repositories/QuestionTypeRepository';

export const QuestionsPage: React.FC = () => {
  const [questions, setQuestions] = useState<IQuestion[]>([]);
  const [questionTypes, setQuestionTypes] = useState<IQuestionType[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [openDialog, setOpenDialog] = useState(false);
  const [selectedQuestion, setSelectedQuestion] = useState<IQuestion | undefined>(undefined);

  const questionRepository = useMemo(() => new QuestionRepository(), []);
  const questionTypeRepository = useMemo(() => new QuestionTypeRepository(), []);

  const loadData = useCallback(async () => {
    try {
      setLoading(true);
      // Primeiro obter os tipos de questão
      const typesData = await questionTypeRepository.getAll();
      setQuestionTypes(typesData || []); // Garantir que nunca seja null

      // Depois obter as questões
      const questionsData = await questionRepository.getAll();
      setQuestions(questionsData || []); // Garantir que nunca seja null
      
      setError(null);
    } catch (err) {
      console.error('Erro ao carregar dados:', err);
      setError('Erro ao carregar dados. Por favor, tente novamente.');
      // Garantir valores padrão em caso de erro
      setQuestionTypes([]);
      setQuestions([]);
    } finally {
      setLoading(false);
    }
  }, [questionRepository, questionTypeRepository]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  const handleCreate = () => {
    setSelectedQuestion(undefined);
    setOpenDialog(true);
  };

  const handleEdit = (question: IQuestion) => {
    setSelectedQuestion(question);
    setOpenDialog(true);
  };

  const handleDelete = async (id: string) => {
    try {
      await questionRepository.delete(id);
      await loadData();
      setError(null);
    } catch (err) {
      console.error('Erro ao excluir questão:', err);
      setError('Erro ao excluir questão. Por favor, tente novamente.');
    }
  };

  const handleSubmit = async (data: Omit<IQuestion, '_id' | 'authUserId' | 'createdAt' | 'updatedAt' | 'toJSON'>) => {
    try {
      console.log('Dados sendo enviados:', data); // Debug
      
      if (selectedQuestion) {
        await questionRepository.update(selectedQuestion._id!, data);
      } else {
        await questionRepository.create(data);
      }
      setOpenDialog(false);
      await loadData();
      setError(null);
    } catch (err: any) {
      console.error('Erro ao salvar questão:', err);
      console.error('Detalhes do erro:', err.response?.data); // Debug
      setError(`Erro ao salvar questão: ${err.response?.data?.error || err.message || 'Erro desconhecido'}`);
    }
  };

  const filteredQuestions = questions.filter(
    (question) =>
      question.pergunta?.toLowerCase().includes(searchTerm.toLowerCase()) ?? false
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
          Questões
        </Typography>
        <Typography variant="h6" color="text.secondary">
          Gerencie as questões disponíveis para avaliações
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
          placeholder="Buscar questões..."
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
          Nova Questão
        </Button>
      </Box>

      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}

      <QuestionList
        questions={filteredQuestions}
        onEdit={handleEdit}
        onDelete={handleDelete}
        questionTypes={questionTypes}
      />

      <Dialog
        open={openDialog}
        onClose={() => setOpenDialog(false)}
        maxWidth="md"
        fullWidth
      >
        <DialogContent>
          <QuestionForm
            question={selectedQuestion}
            onSubmit={handleSubmit}
            onCancel={() => setOpenDialog(false)}
            questionTypes={questionTypes}
          />
        </DialogContent>
      </Dialog>
    </Box>
  );
}; 