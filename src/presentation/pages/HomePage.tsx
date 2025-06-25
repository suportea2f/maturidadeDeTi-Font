import React from 'react';
import {
  Container,
  Typography,
  Box,
  Paper,
  Button,
  useTheme,
} from '@mui/material';
import {
  Assessment as AssessmentIcon,
  People as PeopleIcon,
  QuestionAnswer as QuestionAnswerIcon,
  TrendingUp as TrendingUpIcon,
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';

export const HomePage: React.FC = () => {
  const theme = useTheme();
  const navigate = useNavigate();

  const cards = [
    {
      title: 'Avaliações',
      description: 'Gerencie e acompanhe as avaliações de maturidade',
      icon: <AssessmentIcon sx={{ fontSize: 40 }} />,
      path: '/evaluations',
      color: theme.palette.primary.main,
    },
    {
      title: 'Usuários',
      description: 'Gerencie os usuários do sistema',
      icon: <PeopleIcon sx={{ fontSize: 40 }} />,
      path: '/users',
      color: theme.palette.success.main,
    },
    {
      title: 'Perguntas',
      description: 'Configure as perguntas da avaliação',
      icon: <QuestionAnswerIcon sx={{ fontSize: 40 }} />,
      path: '/questions',
      color: theme.palette.warning.main,
    },
    {
      title: 'Dashboard',
      description: 'Visualize os indicadores e métricas',
      icon: <TrendingUpIcon sx={{ fontSize: 40 }} />,
      path: '/dashboard',
      color: theme.palette.info.main,
    },
  ];

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4, width: '100%' }}>
      <Box sx={{ mb: 4, textAlign: 'center' }}>
        <Typography variant="h4" component="h1" color="text.primary" gutterBottom>
          Bem-vindo ao Sistema de Maturidade de TI
        </Typography>
        <Typography variant="body1" color="text.secondary">
          Gerencie e acompanhe a maturidade de TI da sua organização
        </Typography>
      </Box>

      <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 3, justifyContent: 'center' }}>
        {cards.map((card) => (
          <Box key={card.title} sx={{ flex: { xs: '1 1 100%', sm: '1 1 calc(50% - 12px)', md: '1 1 calc(25% - 18px)' }, maxWidth: { xs: '100%', sm: 'calc(50% - 12px)', md: 'calc(25% - 18px)' } }}>
            <Paper
              sx={{
                p: 3,
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                textAlign: 'center',
                height: '100%',
                bgcolor: theme.palette.background.paper,
                transition: 'transform 0.2s, box-shadow 0.2s',
                '&:hover': {
                  transform: 'translateY(-4px)',
                  boxShadow: theme.shadows[4],
                  cursor: 'pointer',
                },
              }}
              onClick={() => navigate(card.path)}
            >
              <Box
                sx={{
                  width: 80,
                  height: 80,
                  borderRadius: '50%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  mb: 2,
                  bgcolor: `${card.color}15`,
                  color: card.color,
                }}
              >
                {card.icon}
              </Box>
              <Typography variant="h6" component="h2" color="text.primary" gutterBottom>
                {card.title}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                {card.description}
              </Typography>
            </Paper>
          </Box>
        ))}
      </Box>

      <Box sx={{ mt: 4, textAlign: 'center' }}>
        <Button
          variant="contained"
          size="large"
          startIcon={<AssessmentIcon />}
          onClick={() => navigate('/evaluations/new')}
        >
          Iniciar Nova Avaliação
        </Button>
      </Box>
    </Container>
  );
}; 