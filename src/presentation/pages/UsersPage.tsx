import React, { useEffect, useState, useMemo } from 'react';
import {
  Typography,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Box,
  MenuItem,
  TableContainer,
  Table,
  TableHead,
  TableBody,
  TableRow,
  TableCell,
  IconButton,
  Paper,
  FormControl,
  InputLabel,
  Select,
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import { IUser } from '../../core/domain/interfaces/IUser';
import { UserUseCase } from '../../core/useCases/UserUseCase';
import { UserRepository } from '../../infrastructure/repositories/UserRepository';

export const UsersPage: React.FC = () => {
  const [users, setUsers] = useState<IUser[]>([]);
  const [openDialog, setOpenDialog] = useState(false);
  const [selectedUser, setSelectedUser] = useState<IUser | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [formData, setFormData] = useState<IUser>({
    authUserId: '',
    nome: '',
    email: '',
    empresa: '',
    porteEmpresa: '',
  });

  const userRepository = useMemo(() => new UserRepository(), []);
  const userUseCase = useMemo(() => new UserUseCase(userRepository), [userRepository]);

  const fetchUsers = useMemo(() => async () => {
    try {
      const fetchedUsers = await userUseCase.getAllUsers();
      setUsers(fetchedUsers);
    } catch (error) {
      console.error(error);
    }
  }, [userUseCase]);

  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

  const handleOpenDialog = (user?: IUser) => {
    if (user) {
      setSelectedUser(user);
      setFormData(user);
    } else {
      setSelectedUser(null);
      setFormData({
        authUserId: '',
        nome: '',
        email: '',
        empresa: '',
        porteEmpresa: '',
      });
    }
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setSelectedUser(null);
    setFormData({
      authUserId: '',
      nome: '',
      email: '',
      empresa: '',
      porteEmpresa: '',
    });
  };

  const handleSave = async () => {
    try {
      if (selectedUser) {
        await userUseCase.updateUser({ ...formData, _id: selectedUser._id });
      } else {
        await userUseCase.createUser(formData);
      }
      await fetchUsers();
      handleCloseDialog();
    } catch (error) {
      console.error(error);
    }
  };

  const handleDelete = async (id: string) => {
    if (!id) return;
    try {
      await userUseCase.deleteUser(id);
      await fetchUsers();
    } catch (error) {
      console.error(error);
    }
  };

  const filteredUsers = useMemo(() => {
    return users.filter(user =>
      user.nome.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (user.empresa?.toLowerCase() || '').includes(searchTerm.toLowerCase())
    );
  }, [users, searchTerm]);

  return (
    <Box sx={{ 
      width: '100%',
      maxWidth: '1600px',
      mx: 'auto',
      p: { xs: 2, md: 4 },
    }}>
      <Box sx={{ mb: 6, textAlign: 'center' }}>
        <Typography variant="h3" component="h1" color="text.primary" gutterBottom>
          Usuários
        </Typography>
        <Typography variant="h6" color="text.secondary">
          Gerencie os usuários do sistema
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
          placeholder="Buscar usuários..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          sx={{
            flex: 1,
            maxWidth: { sm: '400px' },
            bgcolor: 'background.paper',
            '& .MuiOutlinedInput-root': {
              '& fieldset': {
                borderColor: 'divider',
              },
              '&:hover fieldset': {
                borderColor: 'divider',
              },
              '&.Mui-focused fieldset': {
                borderColor: 'primary.main',
              },
            },
          }}
        />
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={() => handleOpenDialog()}
          size="large"
        >
          Novo Usuário
        </Button>
      </Box>

      <TableContainer 
        component={Paper}
        sx={{
          width: '100%',
          bgcolor: 'background.paper',
          borderRadius: 2,
          overflow: 'hidden',
          boxShadow: 3,
        }}
      >
        <Table sx={{ width: '100%' }}>
          <TableHead>
            <TableRow>
              <TableCell sx={{ 
                color: 'text.primary',
                width: '25%',
                fontSize: '1rem',
                fontWeight: 600,
              }}>
                Nome
              </TableCell>
              <TableCell sx={{ 
                color: 'text.primary',
                width: '25%',
                fontSize: '1rem',
                fontWeight: 600,
              }}>
                Email
              </TableCell>
              <TableCell sx={{ 
                color: 'text.primary',
                width: '20%',
                fontSize: '1rem',
                fontWeight: 600,
              }}>
                Empresa
              </TableCell>
              <TableCell sx={{ 
                color: 'text.primary',
                width: '15%',
                fontSize: '1rem',
                fontWeight: 600,
              }}>
                Porte da Empresa
              </TableCell>
              <TableCell sx={{ 
                color: 'text.primary',
                width: '15%',
                fontSize: '1rem',
                fontWeight: 600,
              }} align="right">
                Ações
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredUsers.map((user) => (
              <TableRow 
                key={user._id}
                sx={{ 
                  '&:hover': {
                    bgcolor: 'action.hover',
                  },
                  transition: 'background-color 0.2s',
                }}
              >
                <TableCell sx={{ color: 'text.primary' }}>
                  {user.nome}
                </TableCell>
                <TableCell sx={{ color: 'text.primary' }}>
                  {user.email}
                </TableCell>
                <TableCell sx={{ color: 'text.primary' }}>
                  {user.empresa}
                </TableCell>
                <TableCell sx={{ color: 'text.primary' }}>
                  {user.porteEmpresa}
                </TableCell>
                <TableCell align="right">
                  <IconButton
                    onClick={() => handleOpenDialog(user)}
                    color="primary"
                    size="small"
                    sx={{ mr: 1 }}
                  >
                    <EditIcon />
                  </IconButton>
                  <IconButton
                    onClick={() => user._id && handleDelete(user._id)}
                    color="error"
                    size="small"
                  >
                    <DeleteIcon />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      <Dialog open={openDialog} onClose={handleCloseDialog}>
        <DialogTitle>
          {selectedUser ? 'Editar Usuário' : 'Novo Usuário'}
        </DialogTitle>
        <DialogContent>
          <Box sx={{ 
            display: 'flex', 
            flexDirection: 'column', 
            gap: 2,
            pt: 2,
            minWidth: { xs: '300px', sm: '400px' }
          }}>
            <TextField
              label="Nome"
              value={formData.nome}
              onChange={(e) => setFormData({ ...formData, nome: e.target.value })}
              fullWidth
            />
            <TextField
              label="Email"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              fullWidth
            />
            <TextField
              label="Empresa"
              value={formData.empresa}
              onChange={(e) => setFormData({ ...formData, empresa: e.target.value })}
              fullWidth
            />
            <FormControl fullWidth>
              <InputLabel>Porte da Empresa</InputLabel>
              <Select
                value={formData.porteEmpresa}
                label="Porte da Empresa"
                onChange={(e) => setFormData({ ...formData, porteEmpresa: e.target.value })}
              >
                <MenuItem value="Pequeno">Pequeno</MenuItem>
                <MenuItem value="Médio">Médio</MenuItem>
                <MenuItem value="Grande">Grande</MenuItem>
              </Select>
            </FormControl>
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog}>Cancelar</Button>
          <Button onClick={handleSave} variant="contained">
            Salvar
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}; 