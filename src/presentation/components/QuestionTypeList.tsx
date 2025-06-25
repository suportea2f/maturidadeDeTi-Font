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
import { IQuestionType } from '../../core/domain/interfaces/IQuestionType';

interface QuestionTypeListProps {
  questionTypes: IQuestionType[];
  onEdit: (questionType: IQuestionType) => void;
  onDelete: (id: string) => void;
}

export const QuestionTypeList: React.FC<QuestionTypeListProps> = ({
  questionTypes,
  onEdit,
  onDelete,
}) => {
  const theme = useTheme();

  if (questionTypes.length === 0) {
    return (
      <Box sx={{ 
        p: 3, 
        textAlign: 'center',
        width: '100%'
      }}>
        <Typography variant="body1" color="text.secondary">
          Nenhum tipo de questão cadastrado
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
                width: '35%',
              }}
            >
              Nome
            </TableCell>
            <TableCell 
              sx={{ 
                color: theme.palette.text.primary,
                width: '45%',
              }}
            >
              Descrição
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
          {questionTypes.map((questionType) => (
            <TableRow 
              key={questionType._id}
              sx={{ 
                '&:hover': {
                  bgcolor: theme.palette.action.hover,
                },
              }}
            >
              <TableCell 
                sx={{ 
                  color: theme.palette.text.primary,
                  width: '35%',
                }}
              >
                {questionType.nome}
              </TableCell>
              <TableCell 
                sx={{ 
                  color: theme.palette.text.primary,
                  width: '45%',
                }}
              >
                {questionType.descricao}
              </TableCell>
              <TableCell 
                align="right"
                sx={{ 
                  width: '20%',
                }}
              >
                <IconButton
                  color="primary"
                  onClick={() => onEdit(questionType)}
                  aria-label="editar tipo de questão"
                  size="small"
                >
                  <EditIcon />
                </IconButton>
                <IconButton
                  color="error"
                  onClick={() => onDelete(questionType._id)}
                  aria-label="deletar tipo de questão"
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