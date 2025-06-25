import React, { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import {
  Drawer,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  ListItemButton,
  Box,
  useTheme,
  Avatar,
  Typography,
} from '@mui/material';
import {
  People as PeopleIcon,
  QuestionAnswer as QuestionAnswerIcon,
  Home as HomeIcon,
  Dashboard as DashboardIcon,
  Assignment as AssignmentIcon,
  Person as PersonIcon,
  Category as CategoryIcon,
  Security as SecurityIcon,
  PlayArrow as PlayArrowIcon,
} from '@mui/icons-material';

const drawerWidth = 240;

interface UserData {
  nome: string;
  email: string;
  empresa?: string;
  porteEmpresa?: string;
}

interface SidebarProps {
  open: boolean;
  onClose: () => void;
  isAdmin: boolean;
}

const menuItems = [
  { text: 'Dashboard', icon: <DashboardIcon />, path: '/dashboard' },
  { text: 'Início', icon: <HomeIcon />, path: '/' },
  { text: 'Usuários', icon: <PeopleIcon />, path: '/users', adminOnly: true },
  { text: 'Avaliações', icon: <AssignmentIcon />, path: '/evaluations', adminOnly: true },
  { text: 'Avaliações Publicadas', icon: <PlayArrowIcon />, path: '/evaluations/published' },
  { text: 'Tipo de Avaliação', icon: <CategoryIcon />, path: '/question-types', adminOnly: true },
  { text: 'Perguntas', icon: <QuestionAnswerIcon />, path: '/questions', adminOnly: true },
  { text: 'Regras de Acesso', icon: <SecurityIcon />, path: '/rules', adminOnly: true },
  { text: 'Perfil', icon: <PersonIcon />, path: '/profile' },
];

export const Sidebar: React.FC<SidebarProps> = ({ open, onClose, isAdmin }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const theme = useTheme();
  const [userData, setUserData] = useState<UserData | null>(null);

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

  const handleNavigation = (path: string) => {
    navigate(path);
    onClose();
  };

  return (
    <Drawer
      variant="permanent"
      open={open}
      onClose={onClose}
      sx={{
        width: drawerWidth,
        flexShrink: 0,
        '& .MuiDrawer-paper': {
          width: drawerWidth,
          boxSizing: 'border-box',
          background: theme.palette.mode === 'dark' 
            ? 'linear-gradient(135deg, #0B0F19 0%, #1C2333 100%)'
            : 'linear-gradient(135deg, #1a237e 0%, #283593 100%)',
          borderRight: theme.palette.mode === 'dark' 
            ? '1px solid #1C2333'
            : `1px solid ${theme.palette.divider}`,
          color: '#ffffff',
          '& .MuiListItemIcon-root': {
            color: theme.palette.mode === 'dark' ? '#4285f4' : '#ffffff',
          },
          '& .MuiTypography-root': {
            color: '#ffffff',
          },
          '& .MuiListItemButton-root:hover': {
            backgroundColor: theme.palette.mode === 'dark' 
              ? 'rgba(28, 35, 51, 0.5)'
              : 'rgba(255, 255, 255, 0.08)',
          },
          '& .Mui-selected': {
            backgroundColor: theme.palette.mode === 'dark' 
              ? 'rgba(28, 35, 51, 0.5) !important'
              : 'rgba(255, 255, 255, 0.16) !important',
            '& .MuiListItemIcon-root': {
              color: '#4285f4',
            },
          },
        },
      }}
    >
      <Box sx={{ 
        display: 'flex', 
        flexDirection: 'column',
        height: '100%',
      }}>
        {/* Perfil do Usuário */}
        <Box sx={{ 
          p: 2, 
          mt: 8,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          borderBottom: `1px solid ${theme.palette.divider}`,
        }}>
          <Avatar
            sx={{
              width: 64,
              height: 64,
              mb: 1,
              bgcolor: theme.palette.primary.main,
              color: theme.palette.primary.contrastText,
            }}
          >
            {userData?.nome?.charAt(0) || 'U'}
          </Avatar>
          <Typography variant="subtitle1" noWrap sx={{ fontWeight: 'bold' }}>
            {userData?.nome || 'Usuário'}
          </Typography>
          <Typography variant="body2" color="text.secondary" noWrap>
            {userData?.email || ''}
          </Typography>
          {userData?.empresa && (
            <Typography variant="body2" color="text.secondary" noWrap>
              {userData.empresa}
            </Typography>
          )}
          {userData?.porteEmpresa && (
            <Typography variant="body2" color="text.secondary" noWrap>
              {userData.porteEmpresa}
            </Typography>
          )}
        </Box>

        {/* Menu Principal */}
        <List sx={{ flex: 1, pt: 2 }}>
          {menuItems
            .filter(item => !item.adminOnly || isAdmin)
            .map((item) => (
              <ListItem key={item.text} disablePadding>
                <ListItemButton
                  selected={location.pathname === item.path}
                  onClick={() => handleNavigation(item.path)}
                  sx={{
                    py: 1.5,
                    '&.Mui-selected': {
                      backgroundColor: theme.palette.action.selected,
                      borderRight: `3px solid ${theme.palette.primary.main}`,
                      '&:hover': {
                        backgroundColor: theme.palette.action.hover,
                      },
                    },
                    '&:hover': {
                      backgroundColor: theme.palette.action.hover,
                    },
                  }}
                >
                  <ListItemIcon sx={{ 
                    color: location.pathname === item.path ? theme.palette.primary.main : theme.palette.text.primary
                  }}>
                    {item.icon}
                  </ListItemIcon>
                  <ListItemText 
                    primary={item.text}
                    sx={{
                      '& .MuiTypography-root': {
                        fontWeight: location.pathname === item.path ? 600 : 400,
                        color: theme.palette.text.primary,
                      },
                    }}
                  />
                </ListItemButton>
              </ListItem>
            ))}
        </List>
      </Box>
    </Drawer>
  );
}; 