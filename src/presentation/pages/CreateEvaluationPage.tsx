import React, { useState, useEffect, useMemo } from 'react';
import {
  Box,
  Typography,
  TextField,
  Button,
  Paper,
  Stepper,
  Step,
  StepLabel,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Chip,
  OutlinedInput,
  Checkbox,
  ListItemText,
  CircularProgress,
  Alert,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  useTheme,
  FormHelperText,
  Divider,
  List,
  ListItem,
  ListItemSecondaryAction,
  IconButton,
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import DeleteIcon from '@mui/icons-material/Delete';
import AddIcon from '@mui/icons-material/Add';
import { IQuestion } from '../../core/domain/interfaces/IQuestion';
import { QuestionRepository } from '../../infrastructure/repositories/QuestionRepository';
import { EvaluationTemplateRepository } from '../../infrastructure/repositories/EvaluationTemplateRepository';
import { EvaluationTemplateUseCase } from '../../core/useCases/EvaluationTemplateUseCase';
import { IEvaluationTemplate } from '../../core/domain/interfaces/IEvaluationTemplate';

// Passos do formulário
const steps = ['Informações Básicas', 'Seleção de Questões', 'Revisão'];

export const CreateEvaluationPage: React.FC = () => {
  const theme = useTheme();
  const navigate = useNavigate();
  
  // Repositórios e casos de uso
  const questionRepository = useMemo(() => new QuestionRepository(), []);
  const templateRepository = useMemo(() => new EvaluationTemplateRepository(), []);
  const templateUseCase = useMemo(() => new EvaluationTemplateUseCase(templateRepository), [templateRepository]);
  
  // Estados
  const [activeStep, setActiveStep] = useState(0);
  const [questions, setQuestions] = useState<IQuestion[]>([]);
  const [selectedQuestions, setSelectedQuestions] = useState<IQuestion[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successDialogOpen, setSuccessDialogOpen] = useState(false);
  const [formData, setFormData] = useState<IEvaluationTemplate>({
    nome: '',
    descricao: '',
    questionIds: [],
    status: 'rascunho',
    userId: ''
  });
  const [formErrors, setFormErrors] = useState({
    nome: '',
    descricao: '',
    questionIds: ''
  });

  // Buscar questões disponíveis
  useEffect(() => {
    const fetchQuestions = async () => {
      try {
        setLoading(true);
        const result = await questionRepository.getQuestions();
        setQuestions(result);
      } catch (error) {
        console.error('Erro ao buscar questões:', error);
        setError('Não foi possível carregar as questões disponíveis.');
      } finally {
        setLoading(false);
      }
    };

    fetchQuestions();
  }, [questionRepository]);

  // Manipuladores
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | { name?: string; value: unknown }>) => {
    const { name, value } = e.target;
    if (name) {
      setFormData(prev => ({ ...prev, [name]: value }));
      
      // Limpar erro ao editar campo
      if (formErrors[name as keyof typeof formErrors]) {
        setFormErrors(prev => ({ ...prev, [name]: '' }));
      }
    }
  };

  const handleQuestionSelect = (questionIds: string[]) => {
    const selected = questions.filter(q => questionIds.includes(q._id || ''));
    setSelectedQuestions(selected);
    setFormData(prev => ({ ...prev, questionIds }));
    
    // Limpar erro
    if (formErrors.questionIds) {
      setFormErrors(prev => ({ ...prev, questionIds: '' }));
    }
  };

  const handleAddQuestion = (questionId: string) => {
    if (!formData.questionIds.includes(questionId)) {
      const updatedIds = [...formData.questionIds, questionId];
      const selected = questions.filter(q => updatedIds.includes(q._id || ''));
      setSelectedQuestions(selected);
      setFormData(prev => ({ ...prev, questionIds: updatedIds }));
    }
  };

  const handleRemoveQuestion = (questionId: string) => {
    const updatedIds = formData.questionIds.filter(id => id !== questionId);
    const selected = questions.filter(q => updatedIds.includes(q._id || ''));
    setSelectedQuestions(selected);
    setFormData(prev => ({ ...prev, questionIds: updatedIds }));
  };

  // Validação do formulário
  const validateStep = (step: number): boolean => {
    let isValid = true;
    const newErrors = { ...formErrors };

    if (step === 0) {
      if (!formData.nome.trim()) {
        newErrors.nome = 'O nome é obrigatório';
        isValid = false;
      }
      
      if (!formData.descricao.trim()) {
        newErrors.descricao = 'A descrição é obrigatória';
        isValid = false;
      }
    } else if (step === 1) {
      if (formData.questionIds.length === 0) {
        newErrors.questionIds = 'Selecione pelo menos uma questão';
        isValid = false;
      }
    }

    setFormErrors(newErrors);
    return isValid;
  };

  // Navegação entre passos
  const handleNext = () => {
    if (validateStep(activeStep)) {
      setActiveStep(prevStep => prevStep + 1);
    }
  };

  const handleBack = () => {
    setActiveStep(prevStep => prevStep - 1);
  };

  // Criar avaliação
  const handleCreateEvaluation = async () => {
    try {
      setLoading(true);
      setError(null);
      
      // Obter dados do usuário logado
      const userStr = localStorage.getItem('user');
      if (!userStr) {
        throw new Error('Usuário não encontrado. Faça login novamente.');
      }
      
      const user = JSON.parse(userStr);
      const userId = user.id || user.authUserId;
      
      // Criar avaliação com formato exato
      const evaluationData = {
        nome: formData.nome,
        descricao: formData.descricao,
        userId,
        questionIds: formData.questionIds,
        status: formData.status
      };
      
      // Enviar para o backend
      await templateUseCase.createTemplate(evaluationData);
      
      setSuccessDialogOpen(true);
    } catch (error) {
      console.error('Erro ao criar avaliação:', error);
      setError(error instanceof Error ? error.message : 'Erro ao criar avaliação');
    } finally {
      setLoading(false);
    }
  };

  const handlePublishEvaluation = async () => {
    try {
      setLoading(true);
      setError(null);
      
      // Neste exemplo, estamos apenas simulando a publicação
      // Na implementação real, você chamaria um endpoint específico
      
      setFormData(prev => ({ ...prev, status: 'publicada' }));
      setSuccessDialogOpen(true);
    } catch (error) {
      console.error('Erro ao publicar avaliação:', error);
      setError(error instanceof Error ? error.message : 'Erro ao publicar avaliação');
    } finally {
      setLoading(false);
    }
  };

  const handleSuccessDialogClose = () => {
    setSuccessDialogOpen(false);
    navigate('/evaluations');
  };

  // Renderização do conteúdo dos passos
  const renderStepContent = (step: number) => {
    switch (step) {
      case 0:
        return (
          <Box sx={{ mt: 2 }}>
            <TextField
              fullWidth
              label="Nome da Avaliação"
              name="nome"
              value={formData.nome}
              onChange={handleInputChange}
              margin="normal"
              error={!!formErrors.nome}
              helperText={formErrors.nome}
              required
            />
            <TextField
              fullWidth
              label="Descrição"
              name="descricao"
              value={formData.descricao}
              onChange={handleInputChange}
              margin="normal"
              multiline
              rows={4}
              error={!!formErrors.descricao}
              helperText={formErrors.descricao}
              required
            />
          </Box>
        );
        
      case 1:
        return (
          <Box sx={{ mt: 2 }}>
            <Typography variant="subtitle1" gutterBottom>
              Selecione as questões para esta avaliação
            </Typography>
            
            {formErrors.questionIds && (
              <Alert severity="error" sx={{ mb: 2 }}>
                {formErrors.questionIds}
              </Alert>
            )}
            
            <Box sx={{ display: 'flex', flexDirection: { xs: 'column', md: 'row' }, gap: 2 }}>
              <Paper sx={{ p: 2, flex: 1, maxHeight: '400px', overflow: 'auto' }}>
                <Typography variant="h6" gutterBottom>
                  Questões Disponíveis
                </Typography>
                {loading ? (
                  <Box sx={{ display: 'flex', justifyContent: 'center', p: 3 }}>
                    <CircularProgress />
                  </Box>
                ) : (
                  <List>
                    {questions
                      .filter(q => !formData.questionIds.includes(q._id || ''))
                      .map((question) => (
                        <ListItem key={question._id} divider>
                          <ListItemText
                            primary={question.pergunta}
                            secondary={`Tipo: ${question.tipo} | Peso Total: ${question.pesoTotal}`}
                          />
                          <ListItemSecondaryAction>
                            <IconButton 
                              edge="end" 
                              onClick={() => handleAddQuestion(question._id)}
                            >
                              <AddIcon />
                            </IconButton>
                          </ListItemSecondaryAction>
                        </ListItem>
                      ))}
                  </List>
                )}
              </Paper>
              
              <Paper sx={{ p: 2, flex: 1, maxHeight: '400px', overflow: 'auto' }}>
                <Typography variant="h6" gutterBottom>
                  Questões Selecionadas ({selectedQuestions.length})
                </Typography>
                {selectedQuestions.length === 0 ? (
                  <Typography variant="body2" color="text.secondary" sx={{ p: 2, textAlign: 'center' }}>
                    Nenhuma questão selecionada
                  </Typography>
                ) : (
                  <List>
                    {selectedQuestions.map((question) => (
                      <ListItem key={question._id} divider>
                        <ListItemText
                          primary={question.pergunta}
                          secondary={`Tipo: ${question.tipo} | Peso Total: ${question.pesoTotal}`}
                        />
                        <ListItemSecondaryAction>
                          <IconButton
                            edge="end"
                            color="error"
                            onClick={() => question._id && handleRemoveQuestion(question._id)}
                          >
                            <DeleteIcon />
                          </IconButton>
                        </ListItemSecondaryAction>
                      </ListItem>
                    ))}
                  </List>
                )}
              </Paper>
            </Box>
          </Box>
        );
        
      case 2:
        return (
          <Box sx={{ mt: 2 }}>
            <Typography variant="h6" gutterBottom>
              Resumo da Avaliação
            </Typography>
            
            <Paper sx={{ p: 3, mb: 3 }}>
              <Typography variant="subtitle1" gutterBottom>
                <strong>Nome:</strong> {formData.nome}
              </Typography>
              <Typography variant="subtitle1" gutterBottom>
                <strong>Descrição:</strong>
              </Typography>
              <Typography variant="body1" paragraph sx={{ pl: 2 }}>
                {formData.descricao}
              </Typography>
              
              <Divider sx={{ my: 2 }} />
              
              <Typography variant="subtitle1" gutterBottom>
                <strong>Questões Selecionadas ({selectedQuestions.length}):</strong>
              </Typography>
              
              <List>
                {selectedQuestions.map((question, index) => (
                  <ListItem key={question._id} divider>
                    <ListItemText
                      primary={`${index + 1}. ${question.pergunta}`}
                      secondary={`Tipo: ${question.tipo} | Respostas: ${question.respostas?.length || 0}`}
                    />
                  </ListItem>
                ))}
              </List>
              
              <Box sx={{ mt: 3 }}>
                <Typography variant="subtitle1">
                  <strong>Status:</strong> {formData.status === 'rascunho' ? 'Rascunho' : 'Publicada'}
                </Typography>
              </Box>
            </Paper>
          </Box>
        );
        
      default:
        return null;
    }
  };

  // Renderização principal
  return (
    <Box sx={{ 
      width: '100%',
      maxWidth: '1200px',
      mx: 'auto',
      p: { xs: 2, md: 4 },
    }}>
      <Typography variant="h4" component="h1" gutterBottom sx={{ mb: 4, textAlign: 'center' }}>
        Criar Nova Avaliação
      </Typography>
      
      {error && (
        <Alert severity="error" sx={{ mb: 3 }}>
          {error}
        </Alert>
      )}
      
      <Paper sx={{ p: { xs: 2, md: 4 } }}>
        <Stepper activeStep={activeStep} sx={{ mb: 4 }}>
          {steps.map((label) => (
            <Step key={label}>
              <StepLabel>{label}</StepLabel>
            </Step>
          ))}
        </Stepper>
        
        {renderStepContent(activeStep)}
        
        <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 4 }}>
          <Button
            disabled={activeStep === 0 || loading}
            onClick={handleBack}
          >
            Voltar
          </Button>
          
          <Box>
            {activeStep === steps.length - 1 ? (
              <>
                <Button 
                  variant="outlined" 
                  onClick={handleCreateEvaluation}
                  disabled={loading}
                  sx={{ mr: 2 }}
                >
                  Salvar como Rascunho
                </Button>
                <Button 
                  variant="contained" 
                  onClick={handlePublishEvaluation}
                  disabled={loading}
                >
                  Publicar Avaliação
                </Button>
              </>
            ) : (
              <Button
                variant="contained"
                onClick={handleNext}
                disabled={loading}
              >
                Próximo
              </Button>
            )}
          </Box>
        </Box>
      </Paper>
      
      {/* Diálogo de sucesso */}
      <Dialog
        open={successDialogOpen}
        onClose={handleSuccessDialogClose}
      >
        <DialogTitle>
          {formData.status === 'publicada' ? 'Avaliação Publicada' : 'Avaliação Salva'}
        </DialogTitle>
        <DialogContent>
          <DialogContentText>
            {formData.status === 'publicada' 
              ? 'Sua avaliação foi publicada com sucesso e agora está disponível para respostas.'
              : 'Sua avaliação foi salva como rascunho e pode ser editada posteriormente.'
            }
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleSuccessDialogClose} autoFocus variant="contained">
            OK
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}; 