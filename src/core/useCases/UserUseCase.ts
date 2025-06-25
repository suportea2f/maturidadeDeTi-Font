import { IUser } from '../domain/interfaces/IUser';
import { IUserRepository } from '../domain/repositories/IUserRepository';

export class UserUseCase {
  constructor(private readonly userRepository: IUserRepository) {}

  async createUser(user: IUser): Promise<IUser> {
    return this.userRepository.create(user);
  }

  async getUserById(id: string): Promise<IUser | null> {
    return this.userRepository.findById(id);
  }

  async getAllUsers(): Promise<IUser[]> {
    return this.userRepository.findAll();
  }

  async updateUser(user: IUser): Promise<IUser> {
    return this.userRepository.update(user);
  }

  async deleteUser(id: string): Promise<void> {
    return this.userRepository.delete(id);
  }
} 