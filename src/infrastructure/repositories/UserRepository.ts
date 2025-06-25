import { IUser } from '../../core/domain/interfaces/IUser';
import { IUserRepository } from '../../core/domain/repositories/IUserRepository';
import { userService } from '../api/api';

export interface UserProfile {
  nome: string;
  email: string;
  empresa: string;
  porteEmpresa: string;
}

export class UserRepository implements IUserRepository {
  async create(user: IUser): Promise<IUser> {
    try {
      const data = await userService.create(user);
      return data as IUser;
    } catch (error: any) {
      throw new Error('Erro ao criar usuário');
    }
  }

  async findById(id: string): Promise<IUser | null> {
    try {
      const data = await userService.getById(id);
      return data as IUser;
    } catch (error: any) {
      if (error.response?.status === 404) {
        return null;
      }
      throw new Error('Erro ao buscar usuário');
    }
  }

  async findAll(): Promise<IUser[]> {
    try {
      const data = await userService.getAll();
      return data as IUser[];
    } catch (error: any) {
      throw new Error('Erro ao buscar usuários');
    }
  }

  async update(user: IUser): Promise<IUser> {
    try {
      if (!user._id) {
        throw new Error('ID do usuário é obrigatório para atualização');
      }
      const data = await userService.update(user._id, user);
      return data as IUser;
    } catch (error: any) {
      throw new Error('Erro ao atualizar usuário');
    }
  }

  async delete(id: string): Promise<void> {
    try {
      await userService.delete(id);
    } catch (error: any) {
      throw new Error('Erro ao deletar usuário');
    }
  }

  async updateProfile(profile: UserProfile): Promise<UserProfile> {
    try {
      const userId = this.getUserIdFromLocalStorage();
      if (!userId) {
        throw new Error('ID do usuário não encontrado');
      }
      
      const data = await userService.update(userId, profile);
      return data as UserProfile;
    } catch (error: any) {
      if (error.response?.data?.message) {
        throw new Error(error.response.data.message);
      }
      throw new Error('Erro ao atualizar perfil');
    }
  }
  
  private getUserIdFromLocalStorage(): string | null {
    const userStr = localStorage.getItem('user');
    if (!userStr) return null;
    
    try {
      const user = JSON.parse(userStr);
      return user.id || user.authUserId || null;
    } catch {
      return null;
    }
  }
} 