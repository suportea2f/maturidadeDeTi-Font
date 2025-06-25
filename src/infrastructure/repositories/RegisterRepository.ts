import api from '../api/axios';

interface IRegisterData {
  email: string;
  senha: string;
  telefone: string;
}

export class RegisterRepository {
  async register(data: IRegisterData): Promise<void> {
    try {
      await api.post('/auth/register', data);
    } catch (error) {
      console.error('Erro ao registrar usuário:', error);
      throw new Error('Erro ao criar conta. Por favor, tente novamente.');
    }
  }
} 