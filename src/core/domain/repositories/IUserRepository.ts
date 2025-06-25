import { IUser } from '../interfaces/IUser';

export interface IUserRepository {
  create(user: IUser): Promise<IUser>;
  findById(id: string): Promise<IUser | null>;
  findAll(): Promise<IUser[]>;
  update(user: IUser): Promise<IUser>;
  delete(id: string): Promise<void>;
} 