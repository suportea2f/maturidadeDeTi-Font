import React, { useState, useEffect } from 'react';
import {
  AppBar,
  Toolbar,
  IconButton,
  Typography,
  Box,
  Avatar,
  Switch,
  FormControlLabel,
  useTheme,
  Menu,
  MenuItem,
  ListItemIcon,
  ListItemText,
} from '@mui/material';
import {
  Menu as MenuIcon,
  Brightness4 as DarkIcon,
  Brightness7 as LightIcon,
  Settings as SettingsIcon,
  Logout as LogoutIcon,
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { useTheme as useCustomTheme } from '../../core/contexts/ThemeContext';

interface TopBarProps {
  onMenuClick: () => void;
}

interface UserData {
  nome: string;
  email: string;
  empresa?: string;
  porteEmpresa?: string;
}

export const TopBar: React.FC<TopBarProps> = ({ onMenuClick }) => {
  const navigate = useNavigate();
  const theme = useTheme();
  const { toggleTheme, isDarkMode } = useCustomTheme();
  const [userData, setUserData] = useState<UserData | null>(null);
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);

  useEffect(() => {
    const userStr = localStorage.getItem('user');
    if (userStr) {
      try {
        const user = JSON.parse(userStr);
        setUserData(user);
      } catch (err) {
        console.error('Erro ao carregar dados do usuário:', err);
      }
    }
  }, []);

  const handleMenuClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleLogout = () => {
    localStorage.removeItem('user');
    localStorage.removeItem('token');
    handleMenuClose();
    navigate('/login', { replace: true });
  };

  return (
    <AppBar 
      position="fixed" 
      sx={{ 
        zIndex: theme.zIndex.drawer + 1,
        background: isDarkMode 
          ? 'linear-gradient(135deg, #0B0F19 0%, #1C2333 100%)'
          : 'linear-gradient(135deg, #1a237e 0%, #283593 100%)',
        color: '#ffffff',
        borderBottom: isDarkMode 
          ? '1px solid #1C2333'
          : `1px solid ${theme.palette.divider}`,
      }}
    >
      <Toolbar>
        <IconButton
          color="inherit"
          aria-label="open drawer"
          edge="start"
          onClick={onMenuClick}
          sx={{ mr: 2 }}
        >
          <MenuIcon />
        </IconButton>
        <Typography variant="h6" noWrap component="div" sx={{ flexGrow: 1 }}>
          Maturidade de TI
        </Typography>
        <Box>
          <IconButton color="inherit" onClick={toggleTheme}>
            {isDarkMode ? <LightIcon /> : <DarkIcon />}
          </IconButton>
        </Box>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          <FormControlLabel
            control={
              <Switch
                checked={isDarkMode}
                onChange={toggleTheme}
                color="default"
              />
            }
            label={isDarkMode ? 'Modo Escuro' : 'Modo Claro'}
            sx={{ color: '#ffffff' }}
          />
          <Box 
            sx={{ 
              display: 'flex', 
              alignItems: 'center', 
              gap: 1,
              cursor: 'pointer',
              '&:hover': {
                opacity: 0.8,
              },
            }}
            onClick={handleMenuClick}
          >
            <Avatar
              sx={{
                width: 40,
                height: 40,
                bgcolor: isDarkMode ? '#4285f4' : theme.palette.primary.main,
                color: '#ffffff',
              }}
            >
              {userData?.nome?.charAt(0) || 'U'}
            </Avatar>
            <Box sx={{ display: { xs: 'none', sm: 'block' } }}>
              <Typography variant="body2" noWrap sx={{ color: '#ffffff' }}>
                {userData?.nome || 'Usuário'}
              </Typography>
              <Typography variant="caption" noWrap sx={{ color: 'rgba(255, 255, 255, 0.7)' }}>
                {userData?.empresa || ''}
              </Typography>
            </Box>
          </Box>
          <Menu
            anchorEl={anchorEl}
            open={Boolean(anchorEl)}
            onClose={handleMenuClose}
            onClick={handleMenuClose}
            PaperProps={{
              elevation: 0,
              sx: {
                overflow: 'visible',
                filter: 'drop-shadow(0px 2px 8px rgba(0,0,0,0.32))',
                mt: 1.5,
                bgcolor: isDarkMode ? '#0B0F19' : theme.palette.common.white,
                color: isDarkMode ? '#ffffff' : theme.palette.text.primary,
                '& .MuiAvatar-root': {
                  width: 32,
                  height: 32,
                  ml: -0.5,
                  mr: 1,
                },
              },
            }}
            transformOrigin={{ horizontal: 'right', vertical: 'top' }}
            anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
          >
            <MenuItem onClick={() => navigate('/profile')}>
              <ListItemIcon>
                <SettingsIcon fontSize="small" sx={{ color: isDarkMode ? '#4285f4' : theme.palette.primary.main }} />
              </ListItemIcon>
              <ListItemText>Configurações</ListItemText>
            </MenuItem>
            <MenuItem onClick={handleLogout}>
              <ListItemIcon>
                <LogoutIcon fontSize="small" sx={{ color: isDarkMode ? '#4285f4' : theme.palette.primary.main }} />
              </ListItemIcon>
              <ListItemText>Sair</ListItemText>
            </MenuItem>
          </Menu>
        </Box>
      </Toolbar>
    </AppBar>
  );
}; 