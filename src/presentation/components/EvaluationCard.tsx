import React from 'react';
import {
  Card,
  CardContent,
  CardActions,
  Typography,
  Button,
  Chip,
  Box,
  Stack,
  Divider,
  Tooltip,
} from '@mui/material';
import VisibilityIcon from '@mui/icons-material/Visibility';
import EditIcon from '@mui/icons-material/Edit';
import PlayArrowIcon from '@mui/icons-material/PlayArrow';
import QuizIcon from '@mui/icons-material/Quiz';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import GroupIcon from '@mui/icons-material/Group';
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';

interface EvaluationCardProps {
  id: string;
  title: string;
  description: string;
  status: 'rascunho' | 'publicada' | 'arquivada' | 'finalizada' | 'em_andamento';
  questionsCount: number;
  creatorId: string;
  currentUserId: string;
  pesoAtingido?: number;
  pontuacaoTotal?: number;
  percentual?: number;
  userName?: string;
  companyName?: string;
  pesoTotalPossivel?: number;
  descricaoNivel?: string;
  tempoLimiteMinutos?: number;
  nivelMaturidade?: string;
  onVisualizar?: (result: any) => void;
  usuariosFinalizadores?: { idParticipante: string }[];
  quantidadeParticipantes?: number;
}

// Simulação de dificuldade e participantes para visual
const getDifficulty = (questionsCount: number) => {
  if (questionsCount <= 10) return 'Básico';
  if (questionsCount <= 20) return 'Intermediário';
  return 'Avançado';
};
const getDifficultyColor = (difficulty: string) => {
  switch (difficulty) {
    case 'Básico': return { bg: '#E6F4EA', color: '#388E3C', border: '#A5D6A7' };
    case 'Intermediário': return { bg: '#FFF9E1', color: '#F9A825', border: '#FFE082' };
    case 'Avançado': return { bg: '#FDEAEA', color: '#D32F2F', border: '#FFCDD2' };
    default: return { bg: '#F5F5F5', color: '#616161', border: '#E0E0E0' };
  }
};
const getStatusColor = (status: string) => {
  switch (status.toLowerCase()) {
    case 'rascunho': return 'warning';
    case 'publicada': return 'success';
    case 'arquivada': return 'error';
    case 'finalizada': return 'info';
    case 'em_andamento': return 'primary';
    default: return 'default';
  }
};

export const EvaluationCard: React.FC<EvaluationCardProps> = ({
  id,
  title,
  description,
  status,
  questionsCount,
  creatorId,
  currentUserId,
  pesoAtingido,
  pontuacaoTotal,
  percentual,
  userName,
  companyName,
  tempoLimiteMinutos,
  pesoTotalPossivel,
  descricaoNivel,
  nivelMaturidade,
  onVisualizar,
  usuariosFinalizadores,
  quantidadeParticipantes,
}) => {
  const isCreator = creatorId === currentUserId;
  const difficulty = getDifficulty(questionsCount);
  const diffColor = getDifficultyColor(difficulty);
  const duration = tempoLimiteMinutos ? `${tempoLimiteMinutos} min` : (questionsCount <= 10 ? '10 min' : questionsCount <= 20 ? '15-20 min' : '20-25 min');
  const createdAt = new Date().toLocaleDateString('pt-BR');

  const hasUserFinished = usuariosFinalizadores?.some(
    user => user.idParticipante === currentUserId
  );

  // Função para recomendações
  const getRecommendations = (score: number | undefined): string[] => {
    if (typeof score !== 'number') return [];
    if (score >= 0 && score < 20) {
      return [
        'Implementar processos básicos de TI',
        'Documentar procedimentos operacionais',
        'Estabelecer métricas iniciais',
      ];
    }
    if (score >= 20 && score < 40) {
      return [
        'Padronizar processos de TI',
        'Implementar ferramentas de gestão',
        'Treinar equipe em boas práticas',
      ];
    }
    if (score >= 40 && score < 60) {
      return [
        'Automatizar processos de TI',
        'Implementar gestão de qualidade',
        'Desenvolver métricas avançadas',
      ];
    }
    if (score >= 60 && score < 80) {
      return [
        'Otimizar processos existentes',
        'Implementar análise preditiva',
        'Desenvolver inovações em TI',
      ];
    }
    return [
      'Manter excelência operacional',
      'Explorar novas tecnologias',
      'Compartilhar melhores práticas',
    ];
  };

  // Preparar dados para o modal customizado
  const result = {
    pontuacao: pontuacaoTotal ?? 0,
    percentual: percentual ?? 0,
    pesoAtingido: pesoAtingido ?? 0,
    usuario: userName || 'Usuário',
    empresa: companyName || 'Empresa',
    nivelMaturidade: descricaoNivel || '',
    recomendacoes: getRecommendations(pontuacaoTotal),
    dataFinalizacao: new Date().toISOString(), // Ajuste conforme necessário
  };

  return (
    <Card
      sx={{
        width: 320,
        minWidth: 320,
        maxWidth: 320,
        height: 320,
        borderRadius: 1,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        bgcolor: status.toLowerCase() === 'finalizada' ? '#1e2e1e' : 'background.paper',
        color: 'text.primary',
        boxShadow: 4,
        transition: 'box-shadow 0.2s, border-color 0.2s, transform 0.2s',
        border: '1.5px solid',
        borderColor: 'grey.100',
        p: 2,
        '&:hover': {
          boxShadow: 10,
          borderColor: 'primary.light',
          transform: 'translateY(-6px) scale(1.04)',
        },
        overflow: 'hidden',
      }}
    >
      <CardContent sx={{ flexGrow: 1, pb: 1, p: 0, width: '100%' }}>
        <Box display="flex" alignItems="flex-start" justifyContent="space-between" mb={2} width="100%">
          <Box>
            <Typography variant="h6" fontWeight={700} color="text.primary" gutterBottom sx={{ mb: 0, fontSize: '1.05rem' }}>
              {title}
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 1, minHeight: 32, fontSize: '0.95rem' }}>
              {description}
            </Typography>
          </Box>
          <Chip
            label={(status.charAt(0).toUpperCase() + status.slice(1)).replace(/_/g, ' ')}
            color={getStatusColor(status)}
            size="small"
            sx={{ fontWeight: 700, fontSize: 13, px: 1.5, py: 0.5, borderRadius: 2 }}
          />
        </Box>
        <Box mb={2} width="100%">
          <Chip
            label={difficulty}
            size="small"
            sx={{
              bgcolor: diffColor.bg,
              color: diffColor.color,
              border: `1.5px solid ${diffColor.border}`,
              fontWeight: 600,
              fontSize: 12,
              mr: 1,
              borderRadius: 2,
              px: 1.5,
              py: 0.5,
            }}
          />
        </Box>
        <Stack direction="row" spacing={2} mb={2} width="100%">
          <Tooltip title="Quantidade de questões">
            <Box display="flex" alignItems="center" color="primary.main" gap={1}>
              <QuizIcon sx={{ fontSize: 18 }} />
              <Typography variant="caption" sx={{ fontSize: '0.95rem' }}>{questionsCount} questões</Typography>
            </Box>
          </Tooltip>
          <Tooltip title="Tempo limite para finalizar">
            <Box display="flex" alignItems="center" color="success.main" gap={1}>
              <AccessTimeIcon sx={{ fontSize: 18 }} />
              <Typography variant="caption" sx={{ fontSize: '0.95rem' }}>Duração: {duration}</Typography>
            </Box>
          </Tooltip>
        </Stack>
        <Stack direction="row" spacing={2} mb={2} width="100%">
          <Tooltip title="Participantes">
            <Box display="flex" alignItems="center" color="secondary.main" gap={1}>
              <GroupIcon sx={{ fontSize: 18 }} />
              <Typography variant="caption" sx={{ fontSize: '0.95rem' }}>
                {`${usuariosFinalizadores?.length ?? 0} / ${quantidadeParticipantes && quantidadeParticipantes > 0 ? quantidadeParticipantes : '∞'}`}
              </Typography>
            </Box>
          </Tooltip>
          <Tooltip title="Data de publicação (simulada)">
            <Box display="flex" alignItems="center" color="warning.main" gap={1}>
              <CalendarTodayIcon sx={{ fontSize: 18 }} />
              <Typography variant="caption" sx={{ fontSize: '0.95rem' }}>{createdAt}</Typography>
            </Box>
          </Tooltip>
        </Stack>
        <Divider sx={{ my: 1 }} />
      </CardContent>
      <CardActions sx={{ justifyContent: 'center', gap: 2, px: 2, pb: 2 }}>
        <Button
          size="large"
          startIcon={<VisibilityIcon />}
          variant="outlined"
          sx={{
            fontWeight: 700,
            borderRadius: 2,
            px: 2,
            py: 1,
            fontSize: '0.95rem',
            whiteSpace: 'nowrap',
            minWidth: 100
          }}
          onClick={(e) => {
            e.stopPropagation();
            if (onVisualizar) onVisualizar(result);
          }}
        >
          Visualizar
        </Button>
        {isCreator && status.toLowerCase() === 'rascunho' && (
          <Button
            size="large"
            startIcon={<EditIcon />}
            variant="outlined"
            color="secondary"
            sx={{
              fontWeight: 700,
              borderRadius: 2,
              px: 2,
              py: 1,
              fontSize: '0.95rem',
              whiteSpace: 'nowrap',
              minWidth: 100
            }}
            onClick={() => window.location.href = `/evaluations/${id}/edit`}
          >
            Editar
          </Button>
        )}
        {(status.toLowerCase() === 'publicada' || status.toLowerCase() === 'arquivada' || status.toLowerCase() === 'em_andamento') && !hasUserFinished && (
          <Button
            size="large"
            startIcon={<PlayArrowIcon />}
            variant="contained"
            color="primary"
            sx={{
              fontWeight: 700,
              borderRadius: 2,
              px: 2,
              py: 1,
              fontSize: '0.95rem',
              whiteSpace: 'nowrap',
              minWidth: 100
            }}
            onClick={() => window.location.href = `/evaluations/${id}/respond`}
          >
            Responder
          </Button>
        )}
      </CardActions>
      {/* Barra de progresso visual no hover */}
      <Box sx={{ height: 5, bgcolor: 'linear-gradient(90deg, #3b82f6 0%, #6366f1 100%)', transform: 'scaleX(0)', transition: 'transform 0.3s', origin: 'left', '.MuiCard-root:hover &': { transform: 'scaleX(1)' } }} />
    </Card>
  );
}; 