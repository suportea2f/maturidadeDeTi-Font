export interface IUser {
  _id?: string;
  authUserId?: string;
  roleId?: string;
  nome: string;
  email: string;
  empresa?: string;
  porteEmpresa?: string;
  nivelMaturidade?: string;
  token?: string;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface IUserRepository {
  create(user: IUser): Promise<IUser>;
  findById(id: string): Promise<IUser | null>;
  findAll(): Promise<IUser[]>;
  update(user: IUser): Promise<IUser>;
  delete(id: string): Promise<void>;
} 