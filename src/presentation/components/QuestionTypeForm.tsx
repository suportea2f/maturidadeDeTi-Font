import React from 'react';
import {
  Box,
  TextField,
  Button,
  Typography,
  Paper,
  useTheme,
} from '@mui/material';
import { IQuestionType } from '../../core/domain/interfaces/IQuestionType';

interface QuestionTypeFormProps {
  questionType?: IQuestionType;
  onSubmit: (data: Omit<IQuestionType, '_id'>) => void;
  onCancel: () => void;
}

export const QuestionTypeForm: React.FC<QuestionTypeFormProps> = ({
  questionType,
  onSubmit,
  onCancel,
}) => {
  const theme = useTheme();
  const [nome, setNome] = React.useState(questionType?.nome || '');
  const [descricao, setDescricao] = React.useState(questionType?.descricao || '');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit({
      nome,
      descricao,
      ativo: true,
      createdAt: questionType?.createdAt || new Date(),
      updatedAt: new Date(),
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
        {questionType ? 'Editar Tipo de Questão' : 'Novo Tipo de Questão'}
      </Typography>
      
      <Box component="form" onSubmit={handleSubmit} noValidate>
        <TextField
          margin="normal"
          required
          fullWidth
          id="nome"
          label="Nome"
          name="nome"
          autoComplete="off"
          value={nome}
          onChange={(e) => setNome(e.target.value)}
          sx={{ mb: 2 }}
        />
        
        <TextField
          margin="normal"
          required
          fullWidth
          id="descricao"
          label="Descrição"
          name="descricao"
          autoComplete="off"
          multiline
          rows={4}
          value={descricao}
          onChange={(e) => setDescricao(e.target.value)}
          sx={{ mb: 3 }}
        />

        <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 2 }}>
          <Button
            variant="outlined"
            onClick={onCancel}
            sx={{ 
              color: 'text.secondary',
              borderColor: 'text.secondary',
              '&:hover': {
                borderColor: 'text.primary',
              },
            }}
          >
            Cancelar
          </Button>
          <Button
            type="submit"
            variant="contained"
            sx={{ 
              bgcolor: 'primary.main',
              '&:hover': {
                bgcolor: 'primary.dark',
              },
            }}
          >
            {questionType ? 'Salvar' : 'Criar'}
          </Button>
        </Box>
      </Box>
    </Paper>
  );
}; 