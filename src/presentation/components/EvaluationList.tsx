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
import { IEvaluation } from '../../core/domain/interfaces/IEvaluation';

interface EvaluationListProps {
  evaluations: IEvaluation[];
  onEdit: (evaluation: IEvaluation) => void;
  onDelete: (id: string) => void;
}

export const EvaluationList: React.FC<EvaluationListProps> = ({
  evaluations,
  onEdit,
  onDelete,
}) => {
  const theme = useTheme();

  // Logar dados recebidos para debug
  console.log('EvaluationList - dados recebidos:', evaluations);

  if (evaluations.length === 0) {
    // Lista vazia para exibição
    return (
      <Box sx={{ p: 3, textAlign: 'center' }}>
        <Typography variant="body1" color="text.secondary">
          Nenhuma avaliação cadastrada
        </Typography>
      </Box>
    );
  }

  return (
    <TableContainer component={Paper}>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>Título</TableCell>
            <TableCell>Descrição</TableCell>
            <TableCell>Status</TableCell>
            <TableCell>Data de Criação</TableCell>
            <TableCell>Ações</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {evaluations.map((evaluation, index) => (
            <TableRow key={evaluation.id || evaluation._id || `evaluation-row-${index}`}>
              <TableCell>{evaluation.titulo}</TableCell>
              <TableCell>{evaluation.descricao}</TableCell>
              <TableCell>{evaluation.status}</TableCell>
              <TableCell>
                {evaluation.createdAt ? new Date(evaluation.createdAt).toLocaleDateString() : '-'}
              </TableCell>
              <TableCell>
                <IconButton
                  color="primary"
                  onClick={() => onEdit(evaluation)}
                  aria-label="editar avaliação"
                >
                  <EditIcon />
                </IconButton>
                <IconButton
                  color="error"
                  onClick={() => {
                    const eid = evaluation.id || evaluation._id;
                    if (eid) onDelete(eid);
                  }}
                  aria-label="deletar avaliação"
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