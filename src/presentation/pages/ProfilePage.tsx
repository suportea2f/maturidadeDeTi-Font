import React, { useState, useEffect, useMemo } from 'react';
import {
  Container,
  Box,
  Typography,
  Paper,
  Avatar,
  Button,
  TextField,
  Divider,
  Alert,
  CircularProgress,
  MenuItem,
  useTheme,
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import EditIcon from '@mui/icons-material/Edit';
import SaveIcon from '@mui/icons-material/Save';
import { UserRepository } from '../../infrastructure/repositories/UserRepository';
import { LoginRepository } from '../../infrastructure/repositories/LoginRepository';
import { IUser } from '../../core/domain/interfaces/IUser';

const portesEmpresa = [
  { value: 'Pequena', label: 'Pequena' },
  { value: 'Média', label: 'Média' },
  { value: 'Grande', label: 'Grande' }
];

export const ProfilePage: React.FC = () => {
  const navigate = useNavigate();
  const theme = useTheme();
  const [profile, setProfile] = useState<IUser | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [editedProfile, setEditedProfile] = useState<IUser | null>(null);
  
  // Usar useMemo para evitar recriação dos repositórios a cada renderização
  const userRepository = useMemo(() => new UserRepository(), []);
  const loginRepository = useMemo(() => new LoginRepository(), []);

  useEffect(() => {
    const loadProfile = async () => {
      setLoading(true);
      
      try {
        // Verificar se o token está presente
        const token = localStorage.getItem('token');
        if (!token) {
          navigate('/login');
          return;
        }
        
        // Buscar dados do usuário autenticado diretamente via /auth/me
        const userProfile = await loginRepository.getUserInfo();
        
        if (!userProfile) {
          setError('Usuário não encontrado');
          setLoading(false);
          return;
        }
        
        // Atualizar o localStorage com os dados mais recentes
        localStorage.setItem('user', JSON.stringify(userProfile));
        
        setProfile(userProfile);
        setEditedProfile(userProfile);
        setError(null);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Erro ao carregar dados do perfil');
        console.error('Erro ao carregar perfil:', err);
      } finally {
        setLoading(false);
      }
    };

    loadProfile();
  }, [navigate, loginRepository]);

  const handleEdit = () => {
    setIsEditing(true);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setEditedProfile(prev => prev ? { ...prev, [name]: value } : null);
  };

  const handleSave = async () => {
    if (!editedProfile || !profile?._id) return;

    setLoading(true);
    try {
      const updatedProfile = {
        ...editedProfile,
        _id: profile._id,
        email: profile.email, // Email não pode ser alterado
        authUserId: profile.authUserId
      };

      // Enviar atualização para a API
      const response = await userRepository.update(updatedProfile);
      
      // Atualizar o localStorage com os dados mais recentes
      localStorage.setItem('user', JSON.stringify(response));
      
      // Atualizar o estado
      setProfile(response);
      setIsEditing(false);
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao salvar alterações');
      console.error('Erro ao salvar perfil:', err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
        <CircularProgress />
      </Box>
    );
  }

  if (!profile) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh', flexDirection: 'column', gap: 2 }}>
        <Alert severity="error">
          {error || 'Não foi possível carregar o perfil'}
        </Alert>
        <Button 
          variant="contained" 
          onClick={() => navigate('/login')}
        >
          Voltar para o Login
        </Button>
      </Box>
    );
  }

  return (
    <Container maxWidth="md" sx={{ py: 4 }}>
      <Paper 
        elevation={3} 
        sx={{ 
          p: 4,
          bgcolor: theme.palette.background.paper,
          color: theme.palette.text.primary,
        }}
      >
        {error && (
          <Alert severity="error" sx={{ mb: 3 }}>
            {error}
          </Alert>
        )}

        <Box sx={{ display: 'flex', alignItems: 'center', mb: 4 }}>
          <Avatar
            sx={{
              width: 100,
              height: 100,
              bgcolor: theme.palette.primary.main,
              color: theme.palette.primary.contrastText,
              mr: 3
            }}
          >
            {profile.nome?.charAt(0) || 'U'}
          </Avatar>
          <Box>
            <Typography variant="h4" gutterBottom>
              Meu Perfil
            </Typography>
            <Typography variant="body1" color="text.secondary">
              Gerencie suas informações pessoais
            </Typography>
          </Box>
        </Box>

        <Divider sx={{ mb: 4 }} />

        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 3 }}>
          <Box sx={{ flex: '1 1 calc(50% - 1.5rem)', minWidth: '250px' }}>
            <TextField
              fullWidth
              label="Nome"
              name="nome"
              value={isEditing ? editedProfile?.nome || '' : profile.nome || ''}
              onChange={handleChange}
              disabled={!isEditing || loading}
              sx={{
                '& .MuiInputBase-root': {
                  color: theme.palette.text.primary,
                },
                '& .MuiInputLabel-root': {
                  color: theme.palette.text.secondary,
                },
              }}
            />
          </Box>
          <Box sx={{ flex: '1 1 calc(50% - 1.5rem)', minWidth: '250px' }}>
            <TextField
              fullWidth
              label="Email"
              name="email"
              value={profile.email || ''}
              disabled={true}
              helperText="O email não pode ser alterado"
              sx={{
                '& .MuiInputBase-root': {
                  color: theme.palette.text.primary,
                },
                '& .MuiInputLabel-root': {
                  color: theme.palette.text.secondary,
                },
              }}
            />
          </Box>
          <Box sx={{ flex: '1 1 calc(50% - 1.5rem)', minWidth: '250px' }}>
            <TextField
              fullWidth
              label="Empresa"
              name="empresa"
              value={isEditing ? editedProfile?.empresa || '' : profile.empresa || ''}
              onChange={handleChange}
              disabled={!isEditing || loading}
              sx={{
                '& .MuiInputBase-root': {
                  color: theme.palette.text.primary,
                },
                '& .MuiInputLabel-root': {
                  color: theme.palette.text.secondary,
                },
              }}
            />
          </Box>
          <Box sx={{ flex: '1 1 calc(50% - 1.5rem)', minWidth: '250px' }}>
            <TextField
              fullWidth
              select
              label="Porte da Empresa"
              name="porteEmpresa"
              value={isEditing ? editedProfile?.porteEmpresa || '' : profile.porteEmpresa || ''}
              onChange={handleChange}
              disabled={!isEditing || loading}
              sx={{
                '& .MuiInputBase-root': {
                  color: theme.palette.text.primary,
                },
                '& .MuiInputLabel-root': {
                  color: theme.palette.text.secondary,
                },
              }}
            >
              {portesEmpresa.map((option) => (
                <MenuItem key={option.value} value={option.value}>
                  {option.label}
                </MenuItem>
              ))}
            </TextField>
          </Box>
        </Box>

        <Box sx={{ mt: 4, display: 'flex', justifyContent: 'flex-end', gap: 2 }}>
          {!isEditing ? (
            <Button
              variant="contained"
              startIcon={<EditIcon />}
              onClick={handleEdit}
              disabled={loading}
            >
              Editar Perfil
            </Button>
          ) : (
            <>
              <Button
                variant="outlined"
                onClick={() => {
                  setIsEditing(false);
                  setEditedProfile(profile);
                  setError(null);
                }}
                disabled={loading}
              >
                Cancelar
              </Button>
              <Button
                variant="contained"
                startIcon={<SaveIcon />}
                onClick={handleSave}
                disabled={loading}
              >
                {loading ? <CircularProgress size={24} /> : 'Salvar Alterações'}
              </Button>
            </>
          )}
        </Box>
      </Paper>
    </Container>
  );
}; 