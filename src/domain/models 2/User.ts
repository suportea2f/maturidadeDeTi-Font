export interface User {
  id?: string;
  authUserId?: string;
  nome: string;
  email: string;
  empresa?: string;
  porteEmpresa?: string;
  token?: string;
  role?: string;
  createdAt?: Date;
  updatedAt?: Date;
} 