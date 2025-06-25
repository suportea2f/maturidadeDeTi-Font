import React, { useState, useEffect } from 'react';
import {
  Box,
  TextField,
  Button,
  Typography,
  Paper,
  useTheme,
  MenuItem,
  Grid,
  IconButton,
  List,
  ListItem,
  ListItemText,
  Divider,
} from '@mui/material';
import { Add as AddIcon, Delete as DeleteIcon } from '@mui/icons-material';
import { IQuestion, IOption } from '../../core/domain/interfaces/IQuestion';
import { IQuestionType } from '../../core/domain/interfaces/IQuestionType';

interface QuestionFormProps {
  question?: IQuestion;
  onSubmit: (data: Omit<IQuestion, '_id' | 'authUserId' | 'createdAt' | 'updatedAt' | 'toJSON'>) => void;
  onCancel: () => void;
  questionTypes: IQuestionType[];
}

export const QuestionForm: React.FC<QuestionFormProps> = ({
  question,
  onSubmit,
  onCancel,
  questionTypes = [],
}) => {
  const theme = useTheme();
  const [formData, setFormData] = useState<Omit<IQuestion, '_id' | 'authUserId' | 'createdAt' | 'updatedAt' | 'toJSON'>>({
    tipo: '',
    pergunta: '',
    qtd_respostas: 0,
    respostas: [],
    pesoTotal: 0,
  });
  const [newAnswerText, setNewAnswerText] = useState('');
  const [newAnswerWeight, setNewAnswerWeight] = useState<number>(1);

  useEffect(() => {
    if (question) {
      setFormData({
        tipo: question.tipo,
        pergunta: question.pergunta,
        qtd_respostas: question.qtd_respostas,
        respostas: question.respostas,
        pesoTotal: question.pesoTotal,
      });
    }
  }, [question]);

  const calculateTotalWeight = (answers: IOption[]): number => {
    return answers.reduce((sum, answer) => sum + answer.peso, 0);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Garantir que todos os campos obrigatórios estão preenchidos e no formato correto
    const dataToSubmit = {
      tipo: formData.tipo,
      pergunta: formData.pergunta,
      qtd_respostas: formData.respostas.length,
      respostas: formData.respostas,
      pesoTotal: calculateTotalWeight(formData.respostas),
    };
    
    // Validar campos obrigatórios
    if (!dataToSubmit.pergunta || !dataToSubmit.tipo || dataToSubmit.respostas.length === 0) {
      return;
    }
    
    onSubmit(dataToSubmit);
  };

  const handleAddAnswer = () => {
    if (newAnswerText.trim()) {
      const newAnswer: IOption = {
        texto: newAnswerText,
        peso: newAnswerWeight,
      };
      
      const updatedAnswers = [...formData.respostas, newAnswer];
      
      setFormData({
        ...formData,
        respostas: updatedAnswers,
        qtd_respostas: updatedAnswers.length,
        pesoTotal: calculateTotalWeight(updatedAnswers),
      });
      
      setNewAnswerText('');
      setNewAnswerWeight(1);
    }
  };

  const handleRemoveAnswer = (index: number) => {
    const updatedAnswers = [...formData.respostas];
    updatedAnswers.splice(index, 1);
    
    setFormData({
      ...formData,
      respostas: updatedAnswers,
      qtd_respostas: updatedAnswers.length,
      pesoTotal: calculateTotalWeight(updatedAnswers),
    });
  };

  return (
    <Paper 
      sx={{ 
        p: 3,
        boxShadow: theme.shadows[1],
        borderRadius: 2,
      }}
    >
      <Typography variant="h6" gutterBottom>
        {question ? 'Editar Questão' : 'Nova Questão'}
      </Typography>
      <Box component="form" onSubmit={handleSubmit}>
        <Grid container spacing={2}>
          <Grid item xs={12}>
            <TextField
              fullWidth
              label="Pergunta"
              name="pergunta"
              value={formData.pergunta}
              onChange={(e) => setFormData({ ...formData, pergunta: e.target.value })}
              required
              helperText="Campo obrigatório"
              multiline
              rows={3}
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              fullWidth
              select
              label="Tipo"
              name="tipo"
              value={formData.tipo}
              onChange={(e) => setFormData({ ...formData, tipo: e.target.value })}
              required
              helperText="Campo obrigatório"
            >
              {questionTypes && questionTypes.length > 0 ? (
                questionTypes.map((type) => (
                  <MenuItem key={type._id} value={type.nome}>
                    {type.nome}
                  </MenuItem>
                ))
              ) : (
                <MenuItem value="" disabled>
                  Nenhum tipo disponível
                </MenuItem>
              )}
            </TextField>
          </Grid>
          
          {/* Seção de respostas */}
          <Grid item xs={12}>
            <Typography variant="subtitle1" gutterBottom>
              Respostas da Questão
            </Typography>
            <Box sx={{ display: 'flex', mb: 2, gap: 1 }}>
              <TextField
                label="Texto da resposta"
                value={newAnswerText}
                onChange={(e) => setNewAnswerText(e.target.value)}
                sx={{ flexGrow: 1 }}
                multiline
                rows={2}
              />
              <TextField
                label="Peso"
                type="number"
                value={newAnswerWeight}
                onChange={(e) => setNewAnswerWeight(Number(e.target.value))}
                sx={{ width: '100px' }}
                InputProps={{ inputProps: { min: 1, max: 5 } }}
              />
              <Button
                variant="contained"
                color="primary"
                onClick={handleAddAnswer}
                disabled={!newAnswerText.trim()}
              >
                <AddIcon />
              </Button>
            </Box>
            
            <List sx={{ width: '100%', bgcolor: 'background.paper', mb: 2 }}>
              {formData.respostas.length > 0 ? (
                formData.respostas.map((answer, index) => (
                  <React.Fragment key={index}>
                    <ListItem 
                      secondaryAction={
                        <IconButton edge="end" onClick={() => handleRemoveAnswer(index)}>
                          <DeleteIcon />
                        </IconButton>
                      }
                    >
                      <ListItemText 
                        primary={answer.texto} 
                        secondary={`Peso: ${answer.peso}`}
                        primaryTypographyProps={{ style: { whiteSpace: 'pre-line' } }}
                      />
                    </ListItem>
                    {index < formData.respostas.length - 1 && <Divider />}
                  </React.Fragment>
                ))
              ) : (
                <ListItem>
                  <ListItemText 
                    primary="Nenhuma resposta cadastrada" 
                    primaryTypographyProps={{ color: 'text.secondary' }}
                  />
                </ListItem>
              )}
            </List>
            
            <Typography variant="subtitle2" color="text.secondary">
              Total de respostas: {formData.qtd_respostas} | Peso total: {formData.pesoTotal}
            </Typography>
          </Grid>
          
          <Grid item xs={12}>
            <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 2 }}>
              <Button onClick={onCancel} variant="outlined">
                Cancelar
              </Button>
              <Button 
                type="submit" 
                variant="contained" 
                color="primary"
                disabled={!formData.pergunta || !formData.tipo || formData.respostas.length === 0}
              >
                {question ? 'Atualizar' : 'Criar'}
              </Button>
            </Box>
          </Grid>
        </Grid>
      </Box>
    </Paper>
  );
}; 