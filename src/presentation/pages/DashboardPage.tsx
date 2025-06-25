import React, { useEffect, useState } from 'react';
import {
  Box,
  Typography,
  Grid,
  Paper,
  useTheme,
  CircularProgress,
  Alert,
} from '@mui/material';
import { api } from '../../infrastructure/api/api';
import { IDashboardData } from '../../core/domain/interfaces/IDashboardData';
import { MaturityLevelDistributionChart } from '../components/MaturityLevelDistributionChart';

// Função utilitária para decodificar o JWT
function parseJwt(token: string | null) {
  if (!token) return null;
  try {
    const base64Url = token.split('.')[1];
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    const jsonPayload = decodeURIComponent(
      atob(base64)
        .split('')
        .map(function (c) {
          return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
        })
        .join('')
    );
    return JSON.parse(jsonPayload);
  } catch (e) {
    return null;
  }
}

export const DashboardPage: React.FC = () => {
  const theme = useTheme();
  const [dashboardData, setDashboardData] = useState<IDashboardData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isAdmin, setIsAdmin] = useState<boolean | null>(null);

  // Detecta se é admin
  useEffect(() => {
    const userStr = localStorage.getItem('user');
    let userRole = '';
    if (userStr) {
      try {
        const user = JSON.parse(userStr);
        userRole = user.role || user.roleId || '';
      } catch (err) {}
    }
    if (!userRole) {
      // tenta pegar do token
      const token = localStorage.getItem('token');
      const payload = parseJwt(token);
      console.log("👊 ~ useEffect ~ payload->", payload);
      userRole = payload?.perfil || '';
    }
    setIsAdmin(userRole.toString().toLowerCase().includes('admin'));
  }, []);

  // Busca os dados do dashboard quando souber se é admin
  useEffect(() => {
    if (isAdmin === null) return; // ainda não sabemos se é admin
    const fetchData = async () => {
      try {
        setLoading(true);
        const endpoint = isAdmin ? '/dashboard/' : '/dashboard/me';
        const response = await api.get<any>(endpoint);
        if (response.data && response.data.success) {
          const metrics = isAdmin
            ? response.data.data.generalMetrics
            : response.data.data;
          setDashboardData(metrics);
        } else {
          throw new Error("A resposta da API não foi bem-sucedida ou não continha dados.");
        }
      } catch (err) {
        setError("Não foi possível carregar as métricas do dashboard.");
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [isAdmin]);

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '80vh' }}>
        <CircularProgress />
      </Box>
    );
  }

  if (error || !dashboardData) {
    return <Alert severity="error">{error || 'Dados não encontrados.'}</Alert>;
  }
  
  const { generalKPIs, participationKPIs, maturityKPIs } = dashboardData;

  return (
    <Box sx={{ 
      width: '100%',
      maxWidth: '1600px',
      mx: 'auto',
      p: { xs: 2, md: 4 },
    }}>
      <Box sx={{ mb: 6, textAlign: 'center' }}>
        <Typography variant="h3" component="h1" color="text.primary" gutterBottom>
          Dashboard
        </Typography>
        <Typography variant="h6" color="text.secondary">
          Visão geral da maturidade de TI
        </Typography>
      </Box>

      <Grid container spacing={4}>
        {/* Indicadores */}
        <Grid item xs={12}>
          <Grid container spacing={3}>
            {/* Indicador 1 */}
            <Grid item xs={12} sm={6} md={3}>
              <Paper
                sx={{
                  p: 3,
                  textAlign: 'center',
                  height: '100%',
                  bgcolor: theme.palette.background.paper,
                  borderRadius: 2,
                  boxShadow: theme.shadows[3],
                }}
              >
                <Typography variant="h4" color="primary" gutterBottom>
                  {typeof maturityKPIs?.averageScore === 'number' && !isNaN(maturityKPIs.averageScore)
                    ? `${maturityKPIs.averageScore.toFixed(1)}%`
                    : '--'}
                </Typography>
                <Typography variant="subtitle1" color="text.secondary">
                  Média de Maturidade
                </Typography>
              </Paper>
            </Grid>

            {/* Indicador 2 */}
            <Grid item xs={12} sm={6} md={3}>
              <Paper
                sx={{
                  p: 3,
                  textAlign: 'center',
                  height: '100%',
                  bgcolor: theme.palette.background.paper,
                  borderRadius: 2,
                  boxShadow: theme.shadows[3],
                }}
              >
                <Typography variant="h4" color="primary" gutterBottom>
                  {typeof generalKPIs?.totalEvaluations === 'number' && !isNaN(generalKPIs.totalEvaluations)
                    ? generalKPIs.totalEvaluations
                    : '--'}
                </Typography>
                <Typography variant="subtitle1" color="text.secondary">
                  Total de Avaliações
                </Typography>
              </Paper>
            </Grid>

            {/* Indicador 3 */}
            <Grid item xs={12} sm={6} md={3}>
              <Paper
                sx={{
                  p: 3,
                  textAlign: 'center',
                  height: '100%',
                  bgcolor: theme.palette.background.paper,
                  borderRadius: 2,
                  boxShadow: theme.shadows[3],
                }}
              >
                <Typography variant="h4" color="primary" gutterBottom>
                  {typeof participationKPIs?.totalParticipantsFinished === 'number' && !isNaN(participationKPIs.totalParticipantsFinished)
                    ? participationKPIs.totalParticipantsFinished
                    : '--'}
                </Typography>
                <Typography variant="subtitle1" color="text.secondary">
                  Participantes Concluintes
                </Typography>
              </Paper>
            </Grid>

            {/* Indicador 4 */}
            <Grid item xs={12} sm={6} md={3}>
              <Paper
                sx={{
                  p: 3,
                  textAlign: 'center',
                  height: '100%',
                  bgcolor: theme.palette.background.paper,
                  borderRadius: 2,
                  boxShadow: theme.shadows[3],
                }}
              >
                <Typography variant="h4" color="primary" gutterBottom>
                  {typeof generalKPIs?.evaluationsInProgress === 'number' && !isNaN(generalKPIs.evaluationsInProgress)
                    ? generalKPIs.evaluationsInProgress
                    : '--'}
                </Typography>
                <Typography variant="subtitle1" color="text.secondary">
                  Avaliações em Andamento
                </Typography>
              </Paper>
            </Grid>
          </Grid>
        </Grid>

        {/* Gráficos */}
        <Grid item xs={12}>
          <Grid container spacing={3}>
            {/* Gráfico 1 - Espaço reservado */}
            <Grid item xs={12} md={6}>
              <Paper
                sx={{
                  p: 3,
                  height: 400,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  bgcolor: theme.palette.background.paper,
                  borderRadius: 2,
                  boxShadow: theme.shadows[3],
                }}
              >
                <Typography variant="h6" color="text.secondary">
                  Gráfico de Evolução (Pendente)
                </Typography>
              </Paper>
            </Grid>

            {/* Gráfico 2 */}
            <Grid item xs={12} md={6}>
              <MaturityLevelDistributionChart data={typeof maturityKPIs?.maturityLevelDistribution === 'object' && maturityKPIs?.maturityLevelDistribution !== null ? maturityKPIs.maturityLevelDistribution : {}} />
            </Grid>
          </Grid>
        </Grid>
      </Grid>
    </Box>
  );
}; 