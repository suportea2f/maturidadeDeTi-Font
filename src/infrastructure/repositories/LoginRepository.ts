import { authService } from '../api/api';
import { LoginCredentials } from '../../domain/models/LoginCredentials';
import { IUser } from '../../core/domain/interfaces/IUser';

interface AuthResponse {
  token: string;
  user: IUser;
}

export class LoginRepository {
  async login(credentials: LoginCredentials): Promise<AuthResponse> {
    try {
      const response = await authService.login(credentials) as AuthResponse;
      if (response.token) {
        localStorage.setItem('token', response.token);
        localStorage.setItem('user', JSON.stringify(response.user));
      }
      return response;
    } catch (error: any) {
      const errorMessage = error.message || 'Falha ao realizar login';
      throw new Error(errorMessage);
    }
  }

  async register(userData: Omit<IUser, '_id' | 'token'>): Promise<IUser> {
    try {
      const response = await authService.register(userData) as IUser;
      return response;
    } catch (error: any) {
      const errorMessage = error.message || 'Falha ao realizar cadastro';
      throw new Error(errorMessage);
    }
  }

  async getUserInfo(): Promise<IUser> {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        throw new Error('Token não encontrado');
      }

      console.log('Token:', token); // Debug
      const response = await authService.getUserInfo() as IUser;
      console.log('Resposta:', response); // Debug
      
      // Mapear a resposta da API para o formato esperado
      const user: IUser = {
        _id: response._id,
        authUserId: response.authUserId,
        roleId: response.roleId,
        nome: response.nome,
        email: response.email,
        empresa: response.empresa,
        porteEmpresa: response.porteEmpresa,
        nivelMaturidade: response.nivelMaturidade,
        token: token,
        createdAt: response.createdAt ? new Date(response.createdAt) : undefined,
        updatedAt: response.updatedAt ? new Date(response.updatedAt) : undefined
      };
      
      return user;
    } catch (error: any) {
      console.error('Erro detalhado:', error);
      if (error.response) {
        console.error('Status:', error.response.status);
        console.error('Data:', error.response.data);
      }
      const errorMessage = error.message || 'Erro ao obter informações do usuário';
      throw new Error(errorMessage);
    }
  }

  logout(): void {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  }
} 