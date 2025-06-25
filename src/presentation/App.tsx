import React, { useState } from 'react';
import { CssBaseline, Box } from '@mui/material';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { ThemeProvider } from '../core/contexts/ThemeContext';
import { UsersPage } from './pages/UsersPage';
import { Sidebar } from './components/Sidebar';
import { TopBar } from './components/TopBar';
import { HomePage } from './pages/HomePage';
import { EvaluationsPage } from './pages/EvaluationsPage';
import { QuestionsPage } from './pages/QuestionsPage';
import { ProfilePage } from './pages/ProfilePage';
import { CreateEvaluationPage } from './pages/CreateEvaluationPage';
import { AvailableEvaluationsPage } from './pages/AvailableEvaluationsPage';
import { EvaluationResponsePage } from './pages/EvaluationResponsePage';
import { DashboardPage } from './pages/DashboardPage';
import { EvaluationFormPage } from './pages/EvaluationFormPage';

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

function App() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [isDarkMode, setIsDarkMode] = useState(false);

  const handleMenuClick = () => setIsSidebarOpen(!isSidebarOpen);
  const handleThemeChange = (isDark: boolean) => setIsDarkMode(isDark);

  // Detecta admin pelo token
  const token = localStorage.getItem('token');
  const payload = token ? parseJwt(token) : null;
  const isAdmin = payload?.perfil?.toLowerCase() === 'admin';

  return (
    <ThemeProvider>
      <CssBaseline />
      <Router>
        <Box sx={{ display: 'flex' }}>
          <TopBar 
            onMenuClick={handleMenuClick}
          />
          <Sidebar 
            open={isSidebarOpen}
            onClose={() => setIsSidebarOpen(false)}
            isAdmin={isAdmin}
          />
          <Box
            component="main"
            sx={{
              flexGrow: 1,
              p: 3,
              width: { sm: `calc(100% - 240px)` },
              minHeight: '100vh',
              mt: 8, // Adiciona margem superior para compensar a AppBar fixa
            }}
          >
            <Routes>
              <Route path="/" element={<Navigate to="/dashboard" />} />
              <Route path="/dashboard" element={<DashboardPage />} />
              <Route path="/profile" element={<ProfilePage />} />
              <Route path="/users" element={<UsersPage />} />
              <Route path="/questions" element={<QuestionsPage />} />
              <Route path="/evaluations" element={<EvaluationsPage />} />
              <Route path="/evaluations/new" element={<EvaluationFormPage />} />
              <Route path="/evaluations/create" element={<CreateEvaluationPage />} />
              <Route path="/evaluations/available" element={<AvailableEvaluationsPage />} />
              <Route path="/evaluate/:templateId" element={<EvaluationResponsePage />} />
            </Routes>
          </Box>
        </Box>
      </Router>
    </ThemeProvider>
  );
}

export default App; 