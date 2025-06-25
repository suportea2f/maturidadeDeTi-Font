import React from 'react';
import {
  Card,
  CardContent,
  Typography,
  CardActions,
  Button,
  Box,
  useTheme,
} from '@mui/material';
import { IUser } from '../../core/domain/interfaces/IUser';

interface UserCardProps {
  user: IUser;
  onEdit: (user: IUser) => void;
  onDelete: (id: string) => void;
}

export const UserCard: React.FC<UserCardProps> = ({ user, onEdit, onDelete }) => {
  const theme = useTheme();

  return (
    <Card 
      sx={{ 
        maxWidth: 345, 
        m: 2,
        bgcolor: theme.palette.background.paper,
        color: theme.palette.text.primary,
      }}
    >
      <CardContent>
        <Typography gutterBottom variant="h5" component="div">
          {user.nome}
        </Typography>
        <Typography variant="body2" color="text.secondary">
          Email: {user.email}
        </Typography>
        <Typography variant="body2" color="text.secondary">
          Empresa: {user.empresa}
        </Typography>
        <Typography variant="body2" color="text.secondary">
          Porte: {user.porteEmpresa}
        </Typography>
      </CardContent>
      <CardActions>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', width: '100%' }}>
          <Button 
            size="small" 
            color="primary"
            onClick={() => onEdit(user)}
          >
            Editar
          </Button>
          <Button 
            size="small" 
            color="error" 
            onClick={() => user._id && onDelete(user._id)}
          >
            Excluir
          </Button>
        </Box>
      </CardActions>
    </Card>
  );
}; 