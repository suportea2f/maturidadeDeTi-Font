import React, { useState } from 'react';
import {
  Container,
  Box,
  Typography,
  TextField,
  Button,
  Paper,
  Alert,
  CircularProgress,
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { RegisterRepository } from '../../infrastructure/repositories/RegisterRepository';

interface IRegisterForm {
  email: string;
  senha: string;
  confirmarSenha: string;
  telefone: string;
}

export const RegisterPage: React.FC = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState<IRegisterForm>({
    email: '',
    senha: '',
    confirmarSenha: '',
    telefone: '',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    // Validações
    if (formData.senha !== formData.confirmarSenha) {
      setError('As senhas não coincidem');
      return;
    }

    if (formData.senha.length < 6) {
      setError('A senha deve ter pelo menos 6 caracteres');
      return;
    }

    setLoading(true);

    try {
      const registerRepository = new RegisterRepository();
      await registerRepository.register({
        email: formData.email,
        senha: formData.senha,
        telefone: formData.telefone,
      });

      // Redireciona para o login após registro bem-sucedido
      navigate('/login');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao criar conta');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box
      sx={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        bgcolor: 'background.default',
      }}
    >
      <Container maxWidth="sm">
        <Paper
          elevation={3}
          sx={{
            p: 4,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            width: '100%',
            bgcolor: 'background.paper',
          }}
        >
          <Typography 
            component="h1" 
            variant="h4" 
            gutterBottom 
            sx={{ 
              mb: 4,
              color: 'primary.main',
              fontWeight: 500
            }}
          >
            Criar Conta
          </Typography>

          {error && (
            <Alert severity="error" sx={{ width: '100%', mb: 2 }}>
              {error}
            </Alert>
          )}

          <Box 
            component="form" 
            onSubmit={handleSubmit} 
            sx={{ 
              width: '100%',
              mt: 1 
            }}
          >
            <TextField
              margin="normal"
              required
              fullWidth
              id="email"
              label="Email"
              name="email"
              autoComplete="email"
              type="email"
              value={formData.email}
              onChange={handleChange}
              disabled={loading}
              sx={{ mb: 2 }}
            />
            <TextField
              margin="normal"
              required
              fullWidth
              name="senha"
              label="Senha"
              type="password"
              id="senha"
              value={formData.senha}
              onChange={handleChange}
              disabled={loading}
              sx={{ mb: 2 }}
              helperText="A senha deve ter pelo menos 6 caracteres"
            />
            <TextField
              margin="normal"
              required
              fullWidth
              name="confirmarSenha"
              label="Confirmar Senha"
              type="password"
              id="confirmarSenha"
              value={formData.confirmarSenha}
              onChange={handleChange}
              disabled={loading}
              sx={{ mb: 2 }}
            />
            <TextField
              margin="normal"
              required
              fullWidth
              name="telefone"
              label="Telefone"
              id="telefone"
              value={formData.telefone}
              onChange={handleChange}
              disabled={loading}
              sx={{ mb: 3 }}
              placeholder="(11) 99999-9999"
              inputProps={{
                maxLength: 15,
              }}
            />

            <Button
              type="submit"
              fullWidth
              variant="contained"
              size="large"
              disabled={loading}
              sx={{
                mt: 2,
                py: 1.5,
                fontSize: '1.1rem',
              }}
            >
              {loading ? <CircularProgress size={24} /> : 'CRIAR CONTA'}
            </Button>

            <Button
              fullWidth
              onClick={() => navigate('/login')}
              sx={{
                mt: 2,
                textDecoration: 'underline',
              }}
            >
              Já tem uma conta? Faça login
            </Button>
          </Box>
        </Paper>
      </Container>
    </Box>
  );
}; 