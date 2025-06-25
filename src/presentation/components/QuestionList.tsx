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
  Chip,
} from '@mui/material';
import { Edit as EditIcon, Delete as DeleteIcon } from '@mui/icons-material';
import { IQuestion } from '../../core/domain/interfaces/IQuestion';

interface QuestionListProps {
  questions: IQuestion[];
  onEdit: (question: IQuestion) => void;
  onDelete: (id: string) => void;
  questionTypes: { _id: string; nome: string; }[];
}

export const QuestionList: React.FC<QuestionListProps> = ({
  questions,
  onEdit,
  onDelete,
  questionTypes,
}) => {
  const theme = useTheme();

  if (questions.length === 0) {
    return (
      <Box sx={{ 
        p: 3, 
        textAlign: 'center',
        width: '100%'
      }}>
        <Typography variant="body1" color="text.secondary">
          Nenhuma questão cadastrada
        </Typography>
      </Box>
    );
  }

  const getQuestionTypeName = (typeId: string) => {
    const type = questionTypes.find(t => t._id === typeId);
    return type?.nome || 'Tipo não encontrado';
  };

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
                width: '30%',
              }}
            >
              Pergunta
            </TableCell>
            <TableCell 
              sx={{ 
                color: theme.palette.text.primary,
                width: '20%',
              }}
            >
              Tipo
            </TableCell>
            <TableCell 
              sx={{ 
                color: theme.palette.text.primary,
                width: '15%',
              }}
            >
              Peso
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
          {questions.map((question) => (
            <TableRow 
              key={question._id}
              sx={{ 
                '&:hover': {
                  bgcolor: theme.palette.action.hover,
                },
              }}
            >
              <TableCell 
                sx={{ 
                  color: theme.palette.text.primary,
                  width: '30%',
                }}
              >
                {question.pergunta}
              </TableCell>
              <TableCell 
                sx={{ 
                  color: theme.palette.text.primary,
                  width: '20%',
                }}
              >
                <Chip 
                  label={getQuestionTypeName(question.tipo)}
                  size="small"
                  color="primary"
                  variant="outlined"
                />
              </TableCell>
              <TableCell 
                sx={{ 
                  color: theme.palette.text.primary,
                  width: '15%',
                }}
              >
                {question.pesoTotal}
              </TableCell>
              <TableCell 
                align="right"
                sx={{ 
                  width: '20%',
                }}
              >
                <IconButton
                  color="primary"
                  onClick={() => onEdit(question)}
                  aria-label="editar questão"
                  size="small"
                >
                  <EditIcon />
                </IconButton>
                <IconButton
                  color="error"
                  onClick={() => question._id && onDelete(question._id)}
                  aria-label="deletar questão"
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