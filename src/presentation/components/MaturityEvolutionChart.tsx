import React from 'react';
import ReactApexChart from 'react-apexcharts';
import { ApexOptions } from 'apexcharts';
import { Paper, Typography, useTheme } from '@mui/material';
import { IFinalizedEvaluation } from '../../core/domain/interfaces/IFinalizedEvaluation';

interface MaturityEvolutionChartProps {
  data: IFinalizedEvaluation[];
}

export const MaturityEvolutionChart: React.FC<MaturityEvolutionChartProps> = ({ data }) => {
  const theme = useTheme();

  const processData = () => {
    const months = Array(6).fill(0).map((_, i) => {
      const d = new Date();
      d.setMonth(d.getMonth() - i);
      return d.toLocaleString('default', { month: 'short' });
    }).reverse();

    const counts = Array(6).fill(0);
    const sixMonthsAgo = new Date();
    sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);

    data.forEach(item => {
      const itemDate = new Date(item.createdAt);
      if (itemDate >= sixMonthsAgo) {
        const monthDiff = (new Date().getFullYear() - itemDate.getFullYear()) * 12 + (new Date().getMonth() - itemDate.getMonth());
        if (monthDiff >= 0 && monthDiff < 6) {
          counts[5 - monthDiff]++;
        }
      }
    });

    return { months, counts };
  };

  const { months, counts } = processData();

  const options: ApexOptions = {
    chart: {
      type: 'area',
      height: 350,
      zoom: {
        enabled: false,
      },
      toolbar: {
        show: false,
      },
      foreColor: theme.palette.text.secondary,
    },
    dataLabels: {
      enabled: false,
    },
    stroke: {
      curve: 'smooth',
      width: 3,
    },
    xaxis: {
      categories: months,
      labels: {
        style: {
          colors: theme.palette.text.secondary,
        },
      },
    },
    yaxis: {
      labels: {
        style: {
          colors: theme.palette.text.secondary,
        },
      },
    },
    tooltip: {
      theme: 'dark',
      x: {
        format: 'dd/MM/yy HH:mm',
      },
    },
    grid: {
      borderColor: theme.palette.divider,
    },
    fill: {
      type: 'gradient',
      gradient: {
        shadeIntensity: 1,
        opacityFrom: 0.7,
        opacityTo: 0.9,
        stops: [0, 90, 100],
      },
    },
    colors: [theme.palette.primary.main],
  };

  const series = [{
    name: 'Avaliações Finalizadas',
    data: counts,
  }];

  return (
    <Paper
      sx={{
        p: 3,
        height: 400,
        bgcolor: theme.palette.background.paper,
        borderRadius: 2,
        boxShadow: theme.shadows[3],
      }}
    >
      <Typography variant="h6" gutterBottom>
        Evolução da Maturidade
      </Typography>
      <ReactApexChart options={options} series={series} type="area" height={320} />
    </Paper>
  );
}; 