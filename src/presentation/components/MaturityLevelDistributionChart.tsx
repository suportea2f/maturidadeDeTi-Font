import React from 'react';
import ReactApexChart from 'react-apexcharts';
import { ApexOptions } from 'apexcharts';
import { Paper, Typography, useTheme, Box } from '@mui/material';

interface MaturityDistributionChartProps {
  data: { [level: string]: number };
}

export const MaturityLevelDistributionChart: React.FC<MaturityDistributionChartProps> = ({ data }) => {
  const theme = useTheme();

  const processDataForChart = () => {
    const labels = Object.keys(data);
    const series = Object.values(data);
    
    // Mapear cores de forma consistente, se necessário
    const colors = labels.map(label => {
      switch (label.toLowerCase()) {
        case 'gerenciado':
          return theme.palette.warning.main;
        case 'definido':
          return theme.palette.info.main;
        case 'otimizado':
          return theme.palette.success.main;
        default:
          return theme.palette.grey[500];
      }
    });

    return { series, labels, colors };
  };

  const { series, labels, colors } = processDataForChart();

  const options: ApexOptions = {
    chart: {
      type: 'donut',
      foreColor: theme.palette.text.secondary,
    },
    labels: labels,
    colors: colors,
    responsive: [{
      breakpoint: 480,
      options: {
        chart: {
          width: 200,
        },
        legend: {
          position: 'bottom',
        },
      },
    }],
    legend: {
      position: 'right',
      offsetY: 0,
      height: 230,
    },
    dataLabels: {
      enabled: true,
      formatter: (val: number) => `${val.toFixed(1)}%`,
    },
    tooltip: {
      theme: 'dark',
      y: {
        formatter: (val) => `${val} avaliações`,
      },
    },
    plotOptions: {
      pie: {
        donut: {
          labels: {
            show: true,
            total: {
              show: true,
              label: 'Total',
              formatter: (w) => {
                return w.globals.seriesTotals.reduce((a: number, b: number) => a + b, 0).toString();
              },
            },
          },
        },
      },
    },
  };

  return (
    <Paper
      sx={{
        p: 3,
        height: 400,
        bgcolor: theme.palette.background.paper,
        borderRadius: 2,
        boxShadow: theme.shadows[3],
        display: 'flex',
        flexDirection: 'column',
      }}
    >
      <Typography variant="h6" gutterBottom>
        Distribuição por Nível
      </Typography>
      <Box sx={{ flexGrow: 1, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <ReactApexChart options={options} series={series} type="donut" width={400} />
      </Box>
    </Paper>
  );
}; 