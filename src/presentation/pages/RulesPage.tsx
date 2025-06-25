import React, { useState, useCallback, useEffect, useMemo } from 'react';
import {
  Box,
  Button,
  Typography,
  Dialog,
  DialogTitle,
  DialogContent,
  CircularProgress,
  Alert,
} from '@mui/material';
import { Add as AddIcon } from '@mui/icons-material';
import { RuleForm } from '../components/RuleForm';
import { RuleList } from '../components/RuleList';
import { IRule } from '../../core/domain/interfaces/IRule';
import { RuleRepository } from '../../infrastructure/repositories/RuleRepository';

export const RulesPage: React.FC = () => {
  const [rules, setRules] = useState<IRule[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [openDialog, setOpenDialog] = useState(false);
  const [selectedRule, setSelectedRule] = useState<IRule | null>(null);

  const ruleRepository = useMemo(() => new RuleRepository(), []);

  const loadRules = useCallback(async () => {
    try {
      setLoading(true);
      const data = await ruleRepository.getAll();
      setRules(data);
      setError(null);
    } catch (err) {
      setError('Erro ao carregar regras');
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, [ruleRepository]);

  useEffect(() => {
    loadRules();
  }, [loadRules]);

  const handleCreate = () => {
    setSelectedRule(null);
    setOpenDialog(true);
  };

  const handleEdit = (rule: IRule) => {
    setSelectedRule(rule);
    setOpenDialog(true);
  };

  const handleDelete = async (id: string) => {
    try {
      await ruleRepository.delete(id);
      await loadRules();
      setError(null);
    } catch (err) {
      setError('Erro ao excluir regra');
      console.error(err);
    }
  };

  const handleToggleStatus = async (id: string) => {
    try {
      await ruleRepository.toggleStatus(id);
      await loadRules();
      setError(null);
    } catch (err) {
      setError('Erro ao alterar status da regra');
      console.error(err);
    }
  };

  const handleSubmit = async (data: Omit<IRule, 'id' | 'dataCriacao' | 'dataAtualizacao'>) => {
    try {
      if (selectedRule) {
        await ruleRepository.update(selectedRule.id, data);
      } else {
        await ruleRepository.create(data);
      }
      setOpenDialog(false);
      await loadRules();
      setError(null);
    } catch (err) {
      setError('Erro ao salvar regra');
      console.error(err);
    }
  };

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box sx={{ p: 3, minHeight: '100vh', bgcolor: 'background.default' }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h4" component="h1">
          Regras de Acesso
        </Typography>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={handleCreate}
        >
          Nova Regra
        </Button>
      </Box>

      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}

      <RuleList
        rules={rules}
        onEdit={handleEdit}
        onDelete={handleDelete}
        onToggleStatus={handleToggleStatus}
      />

      <Dialog
        open={openDialog}
        onClose={() => setOpenDialog(false)}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle>
          {selectedRule ? 'Editar Regra' : 'Nova Regra'}
        </DialogTitle>
        <DialogContent>
          <RuleForm
            initialData={selectedRule || undefined}
            onSubmit={handleSubmit}
            onCancel={() => setOpenDialog(false)}
          />
        </DialogContent>
      </Dialog>
    </Box>
  );
}; 