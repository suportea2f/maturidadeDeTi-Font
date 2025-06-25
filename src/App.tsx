import React from 'react';
import { BrowserRouter } from 'react-router-dom';
import { CssBaseline } from '@mui/material';
import { ThemeProvider } from './core/contexts/ThemeContext';
import { AppRoutes } from './presentation/routes/AppRoutes';

export const App: React.FC = () => {
  return (
    <ThemeProvider>
      <CssBaseline />
      <BrowserRouter>
        <AppRoutes />
      </BrowserRouter>
    </ThemeProvider>
  );
};
