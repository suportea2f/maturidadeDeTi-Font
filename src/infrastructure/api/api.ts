import axios from 'axios';

// Use a variável de ambiente REACT_APP_API_URL se disponível, caso contrário, use a URL hardcoded
//const baseURL = process.env.REACT_APP_API_URL || 'https://maturidade-ti-api.onrender.com/api';
const baseURL = process.env.REACT_APP_API_URL || 'http://localhost:3001/api';

export const api = axios.create({
  baseURL: process.env.REACT_APP_API_URL || 'http://localhost:3001/api',
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 30000, // Adiciona timeout de 30 segundos
});

// Interceptor para adicionar token de autenticação em todas as requisições
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token && config.headers) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Interceptor para tratamento de erros nas respostas
api.interceptors.response.use(
  (response) => response,
  (error) => {
    // Tratamento específico para erros de autenticação (401)
    if (error.response && error.response.status === 401) {
      // Limpa os dados de autenticação do localStorage
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      // Redireciona para a página de login se não estiver na página de login
      if (window.location.pathname !== '/login') {
        window.location.href = '/login';
      }
    }
    return Promise.reject(error);
  }
);

// Serviços de autenticação
export const authService = {
  login: async (credentials: { email: string; senha: string }) => {
    const response = await api.post('/auth/login', credentials);
    return response.data;
  },
  
  register: async (userData: any) => {
    const response = await api.post('/auth/register', userData);
    return response.data;
  },
  
  getUserInfo: async () => {
    try {
      const token = localStorage.getItem('token');
      console.log('Token:', token); // Debug
      
      const response = await api.get('/users/me');
      console.log('Resposta:', response.data); // Debug
      return response.data;
    } catch (error: any) {
      console.error('Erro ao buscar informações do usuário:', error);
      if (error.response) {
        console.error('Status:', error.response.status);
        console.error('Data:', error.response.data);
      }
      throw error;
    }
  }
};

// Serviços de usuários
export const userService = {
  getAll: async () => {
    const response = await api.get('/users');
    return response.data;
  },
  
  getById: async (id: string) => {
    const response = await api.get(`/users/${id}`);
    return response.data;
  },
  
  create: async (userData: any) => {
    const response = await api.post('/users', userData);
    return response.data;
  },
  
  update: async (id: string, userData: any) => {
    const response = await api.put(`/users/${id}`, userData);
    return response.data;
  },
  
  delete: async (id: string) => {
    const response = await api.delete(`/users/${id}`);
    return response.data;
  }
};

// Serviços de avaliações
export const evaluationService = {
  getAll: async () => {
    const response = await api.get('/evaluations');
    return response.data;
  },
  
  getById: async (id: string) => {
    const response = await api.get(`/evaluations/${id}`);
    return response.data;
  },
  
  create: async (evaluationData: any) => {
    const response = await api.post('/evaluations', evaluationData);
    return response.data;
  },
  
  update: async (id: string, evaluationData: any) => {
    const response = await api.put(`/evaluations/${id}`, evaluationData);
    return response.data;
  },
  
  delete: async (id: string) => {
    const response = await api.delete(`/evaluations/${id}`);
    return response.data;
  },
  
  publish: async (id: string) => {
    const response = await api.post(`/evaluations/${id}/publish`);
    return response.data;
  },
  
  addResponses: async (id: string, responseData: any) => {
    const response = await api.post(`/evaluations/${id}/responses`, responseData);
    return response.data;
  },
  
  finalize: async (id: string) => {
    const response = await api.post(`/evaluations/${id}/finalize`);
    return response.data;
  }
};

// Serviços de questões
export const questionService = {
  getEvaluationQuestions: async () => {
    const response = await api.get('/evaluations/questions');
    return response.data;
  },
  
  getAll: async () => {
    const response = await api.get('/questions');
    return response.data;
  },
  
  create: async (questionData: any) => {
    const response = await api.post('/questions', questionData);
    return response.data;
  }
};

// Serviços de regras
export const ruleService = {
  getAll: async () => {
    const response = await api.get('/rules');
    return response.data;
  },
  
  getById: async (id: string) => {
    const response = await api.get(`/rules/${id}`);
    return response.data;
  },
  
  create: async (ruleData: any) => {
    const response = await api.post('/rules', ruleData);
    return response.data;
  },
  
  update: async (id: string, ruleData: any) => {
    const response = await api.put(`/rules/${id}`, ruleData);
    return response.data;
  },
  
  delete: async (id: string) => {
    const response = await api.delete(`/rules/${id}`);
    return response.data;
  },
  
  toggleStatus: async (id: string) => {
    const response = await api.patch(`/rules/${id}/toggle`);
    return response.data;
  }
}; 