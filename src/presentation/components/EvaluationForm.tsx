import React, { useState } from 'react';
import {
  Box,
  TextField,
  Button,
  Typography,
} from '@mui/material';
import { IEvaluation } from '../../core/domain/interfaces/IEvaluation';

interface EvaluationFormProps {
  evaluation?: IEvaluation;
  onSubmit: (data: Omit<IEvaluation, '_id' | 'createdAt' | 'updatedAt'>) => void;
  onCancel: () => void;
}

export const EvaluationForm: React.FC<EvaluationFormProps> = ({
  evaluation,
  onSubmit,
  onCancel,
}) => {
  const [formData, setFormData] = useState<Omit<IEvaluation, '_id' | 'createdAt' | 'updatedAt'>>({
    titulo: evaluation?.titulo || '',
    descricao: evaluation?.descricao || '',
    status: evaluation?.status || 'Rascunho',
    userId: evaluation?.userId || '',
    questionIds: evaluation?.questionIds || [],
    pontuacao: evaluation?.pontuacao || 0,
    nivelMaturidade: evaluation?.nivelMaturidade || '',
    tempoLimiteMinutos: evaluation?.tempoLimiteMinutos || 30,
    quantidadeParticipantes: evaluation?.quantidadeParticipantes || 0,
  });

  const handleTextFieldChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleNumberFieldChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: Number(value),
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <Box component="form" onSubmit={handleSubmit} sx={{ maxWidth: 600, mx: 'auto', p: 3 }}>
      <Typography variant="h5" gutterBottom>
        {evaluation ? 'Editar Avaliação' : 'Nova Avaliação'}
      </Typography>

      <TextField
        fullWidth
        label="Título da Avaliação"
        name="titulo"
        value={formData.titulo}
        onChange={handleTextFieldChange}
        required
        sx={{ mb: 2 }}
      />

      <TextField
        fullWidth
        label="Descrição"
        name="descricao"
        value={formData.descricao}
        onChange={handleTextFieldChange}
        multiline
        rows={4}
        required
        sx={{ mb: 2 }}
      />

      <TextField
        fullWidth
        label="Pontuação"
        name="pontuacao"
        type="number"
        value={formData.pontuacao}
        onChange={handleNumberFieldChange}
        sx={{ mb: 2 }}
      />

      <TextField
        fullWidth
        label="Nível de Maturidade"
        name="nivelMaturidade"
        value={formData.nivelMaturidade}
        onChange={handleTextFieldChange}
        sx={{ mb: 2 }}
      />

      <TextField
        fullWidth
        label="Tempo limite (minutos)"
        name="tempoLimiteMinutos"
        type="number"
        value={formData.tempoLimiteMinutos}
        onChange={handleNumberFieldChange}
        required
        sx={{ mb: 2 }}
        inputProps={{ min: 1 }}
      />

      <TextField
        fullWidth
        label="Quantidade de Participantes"
        name="quantidadeParticipantes"
        type="number"
        value={formData.quantidadeParticipantes}
        onChange={handleNumberFieldChange}
        required
        sx={{ mb: 2 }}
        inputProps={{ min: 0 }}
      />

      <Box sx={{ display: 'flex', gap: 2, justifyContent: 'flex-end' }}>
        <Button variant="outlined" onClick={onCancel}>
          Cancelar
        </Button>
        <Button 
          variant="contained" 
          type="submit"
          disabled={!formData.titulo || !formData.descricao}
        >
          {evaluation ? 'Atualizar' : 'Criar'}
        </Button>
      </Box>
    </Box>
  );
}; 