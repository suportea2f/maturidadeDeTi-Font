import React, { useState } from 'react';
import { Box, useTheme } from '@mui/material';
import { Sidebar } from '../components/Sidebar';
import { TopBar } from '../components/TopBar';
import { Outlet } from 'react-router-dom';

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

export const AuthenticatedLayout: React.FC = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const theme = useTheme();

  const handleMenuClick = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  // Detecta admin pelo token
  const token = localStorage.getItem('token');
  const payload = token ? parseJwt(token) : null;
  const isAdmin = payload?.perfil?.toLowerCase() === 'admin';

  return (
    <Box sx={{ 
      display: 'flex', 
      background: 'transparent',
      minHeight: '100vh'
    }}>
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
          color: theme.palette.text.primary,
          mt: 8,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          background: 'transparent',
        }}
      >
        <Outlet />
      </Box>
    </Box>
  );
}; 