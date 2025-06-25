import React from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  IconButton,
  Typography,
  Box,
  useTheme,
} from '@mui/material';
import { Edit as EditIcon, Delete as DeleteIcon } from '@mui/icons-material';
import { IUser } from '../../core/domain/interfaces/IUser';

interface UserListProps {
  users: IUser[];
  onEdit: (user: IUser) => void;
  onDelete: (userId: string) => void;
}

export const UserList: React.FC<UserListProps> = ({ users, onEdit, onDelete }) => {
  const theme = useTheme();

  if (users.length === 0) {
    return (
      <Box sx={{ 
        p: 3, 
        textAlign: 'center',
        width: '100%'
      }}>
        <Typography variant="body1" color="text.secondary">
          Nenhum usuário cadastrado
        </Typography>
      </Box>
    );
  }

  return (
    <TableContainer 
      component={Paper}
      sx={{
        width: '100%',
        maxWidth: '1200px',
        bgcolor: theme.palette.background.paper,
        '& .MuiTableCell-root': {
          borderBottom: `1px solid ${theme.palette.divider}`,
          padding: '16px 8px',
        },
        overflowX: 'auto',
        '& .MuiTable-root': {
          borderCollapse: 'separate',
          borderSpacing: '0',
        },
        mx: 'auto',
        boxShadow: theme.shadows[1],
      }}
    >
      <Table sx={{ 
        minWidth: 812,
        width: '98%',
        mx: 'auto'
      }}>
        <TableHead>
          <TableRow>
            <TableCell 
              sx={{ 
                color: theme.palette.text.primary,
                width: '20%',
              }}
            >
              Nome
            </TableCell>
            <TableCell 
              sx={{ 
                color: theme.palette.text.primary,
                width: '25%',
              }}
            >
              Email
            </TableCell>
            <TableCell 
              sx={{ 
                color: theme.palette.text.primary,
                width: '20%',
              }}
            >
              Empresa
            </TableCell>
            <TableCell 
              sx={{ 
                color: theme.palette.text.primary,
                width: '15%',
              }}
            >
              Porte da Empresa
            </TableCell>
            <TableCell 
              sx={{ 
                color: theme.palette.text.primary,
                width: '20%',
              }}
              align="right"
            >
              Ações
            </TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {users.map((user) => (
            <TableRow 
              key={user._id}
              sx={{ 
                '&:hover': {
                  bgcolor: theme.palette.action.hover,
                },
              }}
            >
              <TableCell 
                sx={{ 
                  color: theme.palette.text.primary,
                  width: '20%',
                }}
              >
                {user.nome}
              </TableCell>
              <TableCell 
                sx={{ 
                  color: theme.palette.text.primary,
                  width: '25%',
                }}
              >
                {user.email}
              </TableCell>
              <TableCell 
                sx={{ 
                  color: theme.palette.text.primary,
                  width: '20%',
                }}
              >
                {user.empresa}
              </TableCell>
              <TableCell 
                sx={{ 
                  color: theme.palette.text.primary,
                  width: '15%',
                }}
              >
                {user.porteEmpresa}
              </TableCell>
              <TableCell 
                align="right"
                sx={{ 
                  width: '20%',
                }}
              >
                <IconButton
                  color="primary"
                  onClick={() => onEdit(user)}
                  aria-label="editar usuário"
                  size="small"
                >
                  <EditIcon />
                </IconButton>
                <IconButton
                  color="error"
                  onClick={() => onDelete(user._id!)}
                  aria-label="deletar usuário"
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
  );
}; 