import React, { useState, useEffect } from 'react';
import {
  Container,
  Box,
  Typography,
  TextField,
  Button,
  Paper,
  Alert,
  CircularProgress,
  Divider,
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { LoginRepository } from '../../infrastructure/repositories/LoginRepository';
import { ILogin } from '../../core/domain/interfaces/ILogin';

export const LoginPage: React.FC = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState<ILogin>({
    email: '',
    senha: '',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isNetworkError, setIsNetworkError] = useState(false);

  // Verifica se já está logado
  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      navigate('/');
    }
  }, [navigate]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    // Limpa o erro quando o usuário começa a digitar
    setError(null);
    setIsNetworkError(false);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setIsNetworkError(false);

    // Validação básica
    if (!formData.email || !formData.senha) {
      setError('Por favor, preencha todos os campos');
      setLoading(false);
      return;
    }

    try {
      const loginRepository = new LoginRepository();
      
      // Primeiro, realiza o login para obter o token
      const loginResponse = await loginRepository.login(formData);
      
      // Salva o token
      localStorage.setItem('token', loginResponse.token);
      
      try {
        // Após obter o token, busca os dados completos do usuário
        const userInfo = await loginRepository.getUserInfo();
        
        // Salva os dados completos do usuário no localStorage
        localStorage.setItem('user', JSON.stringify(userInfo));
        
        // Redireciona para a página inicial
        navigate('/');
      } catch (userError) {
        console.error('Erro ao buscar dados do usuário:', userError);
        // Mesmo que falhe em obter dados adicionais, ainda podemos prosseguir
        // com os dados básicos que já obtivemos no login
        localStorage.setItem('user', JSON.stringify(loginResponse.user));
        navigate('/');
      }
    } catch (err) {
      console.error('Erro no login:', err);
      
      // Verifica se é um erro de rede
      const errorMessage = err instanceof Error ? err.message : 'Erro ao fazer login';
      setError(errorMessage);
      
      // Verifica se é erro de conexão para mostrar ajuda adicional
      if (errorMessage.includes('conexão') || errorMessage.includes('conectar')) {
        setIsNetworkError(true);
      }
      
      setLoading(false);
    }
  };

  const handleRegister = () => {
    navigate('/auth/register');
  };

  const handleTryAgain = () => {
    window.location.reload();
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
            Maturidade de TI
          </Typography>

          {error && (
            <Alert 
              severity="error" 
              sx={{ width: '100%', mb: 2 }}
              action={
                isNetworkError && (
                  <Button color="inherit" size="small" onClick={handleTryAgain}>
                    Tentar Novamente
                  </Button>
                )
              }
            >
              {error}
              {isNetworkError && (
                <Box mt={1} fontSize="0.85rem">
                  <Typography variant="body2">
                    Dicas para resolver:
                    <ul>
                      <li>Verifique sua conexão com a internet</li>
                      <li>Desative extensões do navegador que possam estar interferindo</li>
                      <li>Tente novamente em alguns instantes, o servidor pode estar temporariamente indisponível</li>
                    </ul>
                  </Typography>
                </Box>
              )}
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
              autoFocus
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
              autoComplete="current-password"
              value={formData.senha}
              onChange={handleChange}
              disabled={loading}
              sx={{ mb: 3 }}
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
              {loading ? <CircularProgress size={24} /> : 'ENTRAR'}
            </Button>

            <Divider sx={{ my: 3 }}>ou</Divider>

            <Button
              fullWidth
              variant="outlined"
              size="large"
              onClick={handleRegister}
              disabled={loading}
              sx={{
                py: 1.5,
                fontSize: '1.1rem',
              }}
            >
              CRIAR CONTA
            </Button>
          </Box>
        </Paper>
      </Container>
    </Box>
  );
}; 