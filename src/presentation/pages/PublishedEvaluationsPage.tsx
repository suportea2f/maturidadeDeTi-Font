import React, { useEffect, useMemo, useState } from 'react';
import {
  Box,
  CircularProgress,
  Typography,
  Alert,
  Container,
  Paper,
  InputAdornment,
  TextField,
  MenuItem,
  Chip,
  Button,
  Stack
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import FilterListIcon from '@mui/icons-material/FilterList';
import { EvaluationUseCase } from '../../core/useCases/EvaluationUseCase';
import { EvaluationRepository } from '../../infrastructure/repositories/EvaluationRepository';
import { IEvaluation } from '../../core/domain/interfaces/IEvaluation';
import { EvaluationCard } from '../components/EvaluationCard';
import FinalizedEvaluationUseCase from '../../core/useCases/FinalizedEvaluationUseCase';
import EvaluationResultModal from '../components/EvaluationResultModal';

interface FinalizedInfo {
  pesoAtingido: number;
  pontuacaoTotal: number;
  percentual: number;
  userName?: string;
  companyName?: string;
}

const CATEGORIES = [
  { value: 'all', label: 'Todas as categorias' },
  { value: 'digital', label: 'Digital' },
  { value: 'segurança', label: 'Segurança' },
  { value: 'estratégia', label: 'Estratégia' },
];

export const PublishedEvaluationsPage: React.FC = () => {
  const [evaluations, setEvaluations] = useState<IEvaluation[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [results, setResults] = useState<Record<string, FinalizedInfo>>({});
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedFilter, setSelectedFilter] = useState('all');
  const [showAll, setShowAll] = useState(false);
  const [openModal, setOpenModal] = useState(false);
  const [modalResult, setModalResult] = useState<any>(null);

  const evaluationRepository = useMemo(() => new EvaluationRepository(), []);
  const evaluationUseCase = useMemo(() => new EvaluationUseCase(evaluationRepository), [evaluationRepository]);
  const finalizedUseCase = useMemo(() => new FinalizedEvaluationUseCase(), []);

  const currentUserStr = localStorage.getItem('user');
  const currentUserId = currentUserStr ? (JSON.parse(currentUserStr).id || JSON.parse(currentUserStr)._id || '') : '';

  useEffect(() => {
    const load = async () => {
      try {
        setLoading(true);
        const all = await evaluationUseCase.getAllEvaluations();
        const published = all.filter(
          (e) => e.publicada === true || (e.status && e.status.toLowerCase() === 'publicada'),
        );
        setEvaluations(published);

        if (currentUserId) {
          try {
            const finalized = await finalizedUseCase.getFinalizedEvaluationsByUserId(currentUserId);
            const map: Record<string, FinalizedInfo> = {};
            finalized.forEach((fin: any) => {
              map[fin.evaluationId] = {
                pesoAtingido: fin.pesoAtingido,
                pontuacaoTotal: fin.pontuacaoTotal,
                percentual: fin.percentual,
                userName: fin.userName,
                companyName: fin.companyName,
              };
            });
            setResults(map);
          } catch (err) {
            console.error('Erro ao carregar pontuações finalizadas:', err);
          }
        }
      } catch (err) {
        console.error(err);
        setError('Erro ao carregar avaliações publicadas');
      } finally {
        setLoading(false);
      }
    };
    load();
    // eslint-disable-next-line
  }, [evaluationUseCase, finalizedUseCase]);

  // Filtros e busca
  const filteredEvaluations = evaluations.filter((evaluation) => {
    const matchesSearch = evaluation.titulo.toLowerCase().includes(searchTerm.toLowerCase()) ||
      evaluation.descricao.toLowerCase().includes(searchTerm.toLowerCase());
    // Filtro de categoria apenas visual, pois 'categoria' não existe
    const matchesFilter = selectedFilter === 'all';
    return matchesSearch && matchesFilter;
  });

  const displayedEvaluations = showAll ? filteredEvaluations : filteredEvaluations.slice(0, 6);

  const handleClearFilters = () => {
    setSearchTerm('');
    setSelectedFilter('all');
  };

  const handleOpenModal = (resultData: any) => {
    setModalResult(resultData);
    setOpenModal(true);
  };

  const EmptyState = () => (
    <Box 
      display="flex" 
      flexDirection="column" 
      alignItems="center" 
      justifyContent="center" 
      py={10} 
      px={2}
      sx={{ minHeight: '400px' }}
    >
      <Paper elevation={0} sx={{ bgcolor: 'blue.50', p: 4, borderRadius: '50%', mb: 3 }}>
        <Box color="primary.main" fontSize={48}>
          <SearchIcon fontSize="inherit" />
        </Box>
      </Paper>
      <Typography variant="h6" fontWeight={600} color="text.primary" mb={1}>
        Nenhuma avaliação encontrada
      </Typography>
      <Typography color="text.secondary" align="center" mb={3} maxWidth="400px">
        Não há avaliações publicadas que correspondam aos seus critérios de busca. Tente ajustar os filtros ou aguarde novas publicações.
      </Typography>
      <Button variant="contained" onClick={handleClearFilters} sx={{ px: 4, py: 1.5 }}>
        Limpar Filtros
      </Button>
    </Box>
  );

  return (
    <Box minHeight="100vh" sx={{ bgcolor: '#0E121E' }}>
      <Container maxWidth="lg" sx={{ py: 4 }}>
        {/* Header */}
        <Box mb={4}>
          <Box display="flex" alignItems="center" gap={2} flexWrap="wrap">
            <Typography variant="h4" fontWeight={800} color="primary.main">
              Avaliações Publicadas
            </Typography>
            <Chip 
              label={`${filteredEvaluations.length} disponíveis`} 
              color="primary" 
              sx={{ fontWeight: 700, fontSize: 16 }} 
            />
          </Box>
          <Typography variant="subtitle1" color="text.secondary" mt={1}>
            Descubra e participe de avaliações de maturidade de TI
          </Typography>
        </Box>

        {/* Search and Filter */}
        <Paper 
          elevation={2} 
          sx={{ 
            p: 3, 
            mb: 4, 
            width: '100%', 
            borderRadius: 2,
            bgcolor: 'background.paper'
          }}
        >
          <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2} width="100%">
            <TextField
              fullWidth
              placeholder="Buscar avaliações..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              variant="outlined"
              sx={{
                '& .MuiOutlinedInput-root': {
                  borderRadius: 2
                }
              }}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <SearchIcon color="action" />
                  </InputAdornment>
                ),
              }}
            />
            <TextField
              select
              value={selectedFilter}
              onChange={(e) => setSelectedFilter(e.target.value)}
              sx={{ 
                minWidth: 220,
                '& .MuiOutlinedInput-root': {
                  borderRadius: 2
                }
              }}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <FilterListIcon color="action" />
                  </InputAdornment>
                ),
              }}
            >
              {CATEGORIES.map((cat) => (
                <MenuItem key={cat.value} value={cat.value}>
                  {cat.label}
                </MenuItem>
              ))}
            </TextField>
          </Stack>
        </Paper>

        {/* Error Alert */}
        {error && (
          <Alert severity="error" sx={{ mb: 3, borderRadius: 2 }}>
            {error}
          </Alert>
        )}

        {/* Loading State */}
        {loading ? (
          <Box 
            display="flex" 
            justifyContent="center" 
            alignItems="center" 
            py={8}
            sx={{ minHeight: '400px' }}
          >
            <CircularProgress size={48} />
          </Box>
        ) : filteredEvaluations.length === 0 ? (
          <EmptyState />
        ) : (
          <>
            {/* Cards Grid */}
            <Box
              sx={{
                width: '100%',
                display: 'grid',
                gridTemplateColumns: {
                  xs: '1fr',
                  sm: '1fr 1fr',
                  md: '1fr 1fr 1fr',
                  lg: '1fr 1fr 1fr 1fr'
                },
                gap: 3
              }}
            >
              {displayedEvaluations.map((ev) => (
                <Box key={ev.id || ev._id} sx={{ minHeight: '420px', display: 'flex', flexDirection: 'column' }}>
                  <EvaluationCard
                    id={ev.id || ev._id!}
                    title={ev.titulo}
                    description={ev.descricao}
                    status={(ev.status as any) || 'publicada'}
                    questionsCount={
                      ev.questionIds
                        ? ev.questionIds.length
                        : (ev as any).questions
                        ? (ev as any).questions.length
                        : 0
                    }
                    creatorId={ev.userId}
                    currentUserId={currentUserId}
                    pesoAtingido={results[ev.id || ev._id!]?.pesoAtingido}
                    pontuacaoTotal={results[ev.id || ev._id!]?.pontuacaoTotal}
                    percentual={results[ev.id || ev._id!]?.percentual}
                    userName={results[ev.id || ev._id!]?.userName}
                    companyName={results[ev.id || ev._id!]?.companyName}
                    tempoLimiteMinutos={ev.tempoLimiteMinutos}
                    onVisualizar={handleOpenModal}
                    usuariosFinalizadores={ev.usuariosFinalizadores}
                    quantidadeParticipantes={ev.quantidadeParticipantes}
                  />
                </Box>
              ))}
            </Box>

            {/* Load More Button */}
            {filteredEvaluations.length > 6 && !showAll && (
              <Box textAlign="center" mt={6}>
                <Button
                  variant="outlined"
                  size="large"
                  onClick={() => setShowAll(true)}
                  sx={{ 
                    px: 6, 
                    py: 2, 
                    fontWeight: 600,
                    borderRadius: 2,
                    textTransform: 'none'
                  }}
                >
                  Carregar mais avaliações
                </Button>
              </Box>
            )}
          </>
        )}
      </Container>
      <EvaluationResultModal
        isOpen={openModal}
        onClose={() => setOpenModal(false)}
        result={modalResult}
      />
    </Box>
  );
};