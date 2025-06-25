import React, { useState } from 'react';
import {
  Box,
  TextField,
  Button,
  Typography,
  Paper,
  useTheme,
  FormControl,
  FormGroup,
  FormControlLabel,
  Checkbox,
  IconButton,
} from '@mui/material';
import { Add as AddIcon, Delete as DeleteIcon } from '@mui/icons-material';
import { IRule } from '../../core/domain/interfaces/IRule';

interface RuleFormProps {
  initialData?: IRule;
  onSubmit: (data: Omit<IRule, 'id' | 'dataCriacao' | 'dataAtualizacao'>) => void;
  onCancel: () => void;
}

export const RuleForm: React.FC<RuleFormProps> = ({ initialData, onSubmit, onCancel }) => {
  const theme = useTheme();
  const [nome, setNome] = useState(initialData?.nome || '');
  const [descricao, setDescricao] = useState(initialData?.descricao || '');
  const [endpoints, setEndpoints] = useState<IRule['endpoints']>(
    initialData?.endpoints || { '/api': { GET: false, POST: false, PUT: false, DELETE: false } }
  );

  const handleAddEndpoint = () => {
    setEndpoints(prev => ({
      ...prev,
      ['/api']: { GET: false, POST: false, PUT: false, DELETE: false }
    }));
  };

  const handleRemoveEndpoint = (path: string) => {
    const newEndpoints = { ...endpoints };
    delete newEndpoints[path];
    setEndpoints(newEndpoints);
  };

  const handleMethodChange = (path: string, method: string, checked: boolean) => {
    setEndpoints(prev => ({
      ...prev,
      [path]: {
        ...prev[path],
        [method]: checked
      }
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit({
      nome,
      descricao,
      endpoints,
      ativo: true
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
        {initialData ? 'Editar Regra' : 'Nova Regra'}
      </Typography>
      
      <Box component="form" onSubmit={handleSubmit} noValidate>
        <TextField
          margin="normal"
          required
          fullWidth
          label="Nome"
          value={nome}
          onChange={(e) => setNome(e.target.value)}
          sx={{ mb: 2 }}
        />
        
        <TextField
          margin="normal"
          required
          fullWidth
          label="Descrição"
          multiline
          rows={4}
          value={descricao}
          onChange={(e) => setDescricao(e.target.value)}
          sx={{ mb: 3 }}
        />

        <Typography variant="subtitle1" gutterBottom>
          Endpoints
        </Typography>

        {Object.entries(endpoints).map(([path, methods]) => (
          <Box key={path} sx={{ mb: 2, p: 2, border: `1px solid ${theme.palette.divider}`, borderRadius: 1 }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
              <TextField
                label="Rota"
                value={path}
                onChange={(e) => {
                  const newEndpoints = { ...endpoints };
                  delete newEndpoints[path];
                  newEndpoints[e.target.value] = methods;
                  setEndpoints(newEndpoints);
                }}
                sx={{ flex: 1, mr: 2 }}
              />
              <IconButton onClick={() => handleRemoveEndpoint(path)} color="error">
                <DeleteIcon />
              </IconButton>
            </Box>

            <FormControl component="fieldset">
              <FormGroup row>
                {Object.entries(methods).map(([method, checked]) => (
                  <FormControlLabel
                    key={method}
                    control={
                      <Checkbox
                        checked={checked}
                        onChange={(e) => handleMethodChange(path, method, e.target.checked)}
                      />
                    }
                    label={method}
                  />
                ))}
              </FormGroup>
            </FormControl>
          </Box>
        ))}

        <Button
          startIcon={<AddIcon />}
          onClick={handleAddEndpoint}
          variant="outlined"
          sx={{ mb: 3 }}
        >
          Adicionar Endpoint
        </Button>

        <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 2 }}>
          <Button
            variant="outlined"
            onClick={onCancel}
          >
            Cancelar
          </Button>
          <Button
            type="submit"
            variant="contained"
          >
            {initialData ? 'Salvar' : 'Criar'}
          </Button>
        </Box>
      </Box>
    </Paper>
  );
}; 