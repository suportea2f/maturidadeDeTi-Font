import React, { useState, useEffect, useMemo } from 'react';
import {
  Typography,
  Box,
  Paper,
  Button,
  Card,
  CardContent,
  CardActions,
  Grid,
  TextField,
  CircularProgress,
  Alert,
  Pagination,
  useTheme,
  Chip,
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import AssignmentIcon from '@mui/icons-material/Assignment';
import { EvaluationTemplateRepository } from '../../infrastructure/repositories/EvaluationTemplateRepository';
import { EvaluationTemplateUseCase } from '../../core/useCases/EvaluationTemplateUseCase';
import { IEvaluationTemplate } from '../../core/domain/interfaces/IEvaluationTemplate';

export const AvailableEvaluationsPage: React.FC = () => {
  const theme = useTheme();
  const navigate = useNavigate();
  
  const [templates, setTemplates] = useState<IEvaluationTemplate[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [page, setPage] = useState(1);
  const itemsPerPage = 6;

  // Repositórios e casos de uso
  const templateRepository = useMemo(() => new EvaluationTemplateRepository(), []);
  const templateUseCase = useMemo(() => new EvaluationTemplateUseCase(templateRepository), [templateRepository]);

  // Buscar templates publicados
  useEffect(() => {
    const fetchTemplates = async () => {
      try {
        setLoading(true);
        const publishedTemplates = await templateUseCase.getPublishedTemplates();
        setTemplates(publishedTemplates);
        setError(null);
      } catch (err) {
        console.error('Erro ao buscar avaliações disponíveis:', err);
        setError('Erro ao carregar avaliações disponíveis. Por favor, tente novamente.');
      } finally {
        setLoading(false);
      }
    };

    fetchTemplates();
  }, [templateUseCase]);

  // Filtrar e paginar os templates
  const filteredTemplates = useMemo(() => {
    return templates.filter(template => 
      template.nome.toLowerCase().includes(searchTerm.toLowerCase()) ||
      template.descricao.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [templates, searchTerm]);

  const paginatedTemplates = useMemo(() => {
    const startIndex = (page - 1) * itemsPerPage;
    return filteredTemplates.slice(startIndex, startIndex + itemsPerPage);
  }, [filteredTemplates, page, itemsPerPage]);

  // Manipuladores
  const handlePageChange = (event: React.ChangeEvent<unknown>, value: number) => {
    setPage(value);
    window.scrollTo(0, 0);
  };

  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(event.target.value);
    setPage(1); // Reset para a primeira página ao pesquisar
  };

  const handleStartEvaluation = (templateId: string) => {
    navigate(`/evaluate/${templateId}`);
  };

  // Renderização de estados
  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '60vh' }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box sx={{ 
      width: '100%',
      maxWidth: '1200px',
      mx: 'auto',
      p: { xs: 2, md: 4 },
    }}>
      <Box sx={{ mb: 6, textAlign: 'center' }}>
        <Typography variant="h3" component="h1" color="text.primary" gutterBottom>
          Avaliações Disponíveis
        </Typography>
        <Typography variant="h6" color="text.secondary">
          Escolha uma avaliação para começar
        </Typography>
      </Box>

      {error && (
        <Alert severity="error" sx={{ mb: 3 }}>
          {error}
        </Alert>
      )}

      <Box sx={{ mb: 4 }}>
        <TextField
          fullWidth
          placeholder="Pesquisar avaliações..."
          value={searchTerm}
          onChange={handleSearchChange}
          sx={{ bgcolor: theme.palette.background.paper }}
        />
      </Box>

      {filteredTemplates.length === 0 ? (
        <Paper sx={{ p: 4, textAlign: 'center' }}>
          <Typography variant="h6" color="text.secondary" gutterBottom>
            Nenhuma avaliação disponível
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Não há avaliações publicadas no momento ou sua pesquisa não retornou resultados.
          </Typography>
        </Paper>
      ) : (
        <>
          <Grid container spacing={3}>
            {paginatedTemplates.map((template) => (
              <Grid item xs={12} sm={6} md={4} key={template.id}>
                <Card 
                  sx={{ 
                    height: '100%', 
                    display: 'flex', 
                    flexDirection: 'column',
                    transition: 'transform 0.2s, box-shadow 0.2s',
                    '&:hover': {
                      transform: 'translateY(-4px)',
                      boxShadow: theme.shadows[10],
                    },
                  }}
                >
                  <CardContent sx={{ flexGrow: 1 }}>
                    <Box sx={{ 
                      display: 'flex', 
                      alignItems: 'center', 
                      mb: 2,
                      color: theme.palette.primary.main
                    }}>
                      <AssignmentIcon sx={{ mr: 1 }} />
                      <Typography variant="h6" component="h2" noWrap>
                        {template.nome}
                      </Typography>
                    </Box>
                    <Typography 
                      variant="body2" 
                      color="text.secondary"
                      sx={{ 
                        mb: 2,
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                        display: '-webkit-box',
                        WebkitLineClamp: 3,
                        WebkitBoxOrient: 'vertical',
                      }}
                    >
                      {template.descricao}
                    </Typography>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <Chip 
                        label={`${template.questionIds.length} questões`} 
                        size="small"
                        color="primary"
                        variant="outlined"
                      />
                    </Box>
                  </CardContent>
                  <CardActions>
                    <Button 
                      fullWidth 
                      variant="contained" 
                      onClick={() => handleStartEvaluation(template.id || '')}
                    >
                      Iniciar Avaliação
                    </Button>
                  </CardActions>
                </Card>
              </Grid>
            ))}
          </Grid>

          {filteredTemplates.length > itemsPerPage && (
            <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
              <Pagination 
                count={Math.ceil(filteredTemplates.length / itemsPerPage)} 
                page={page} 
                onChange={handlePageChange}
                color="primary"
                showFirstButton
                showLastButton
              />
            </Box>
          )}
        </>
      )}
    </Box>
  );
}; 