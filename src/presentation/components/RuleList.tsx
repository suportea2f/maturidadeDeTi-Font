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
  Switch,
  Typography,
  Box,
  Chip,
} from '@mui/material';
import { Edit as EditIcon, Delete as DeleteIcon } from '@mui/icons-material';
import { IRule } from '../../core/domain/interfaces/IRule';

interface RuleListProps {
  rules: IRule[];
  onEdit: (rule: IRule) => void;
  onDelete: (id: string) => void;
  onToggleStatus: (id: string) => void;
}

export const RuleList: React.FC<RuleListProps> = ({
  rules,
  onEdit,
  onDelete,
  onToggleStatus,
}) => {
  const getMethodChips = (methods: { [key: string]: boolean }) => {
    return Object.entries(methods)
      .filter(([_, enabled]) => enabled)
      .map(([method]) => (
        <Chip
          key={method}
          label={method}
          size="small"
          sx={{ mr: 0.5 }}
        />
      ));
  };

  return (
    <TableContainer component={Paper}>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>Nome</TableCell>
            <TableCell>Descrição</TableCell>
            <TableCell>Endpoints</TableCell>
            <TableCell>Status</TableCell>
            <TableCell align="right">Ações</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {rules.map((rule) => (
            <TableRow key={rule.id}>
              <TableCell>{rule.nome}</TableCell>
              <TableCell>{rule.descricao}</TableCell>
              <TableCell>
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                  {Object.entries(rule.endpoints).map(([path, methods]) => (
                    <Box key={path}>
                      <Typography variant="caption" color="text.secondary">
                        {path}
                      </Typography>
                      <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                        {getMethodChips(methods)}
                      </Box>
                    </Box>
                  ))}
                </Box>
              </TableCell>
              <TableCell>
                <Switch
                  checked={rule.ativo}
                  onChange={() => onToggleStatus(rule.id)}
                  color="primary"
                />
              </TableCell>
              <TableCell align="right">
                <IconButton
                  onClick={() => onEdit(rule)}
                  color="primary"
                  size="small"
                >
                  <EditIcon />
                </IconButton>
                <IconButton
                  onClick={() => onDelete(rule.id)}
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
  );
}; 