export interface IRule {
  id: string;
  nome: string;
  descricao: string;
  endpoints: {
    [key: string]: {
      GET: boolean;
      POST: boolean;
      PUT: boolean;
      DELETE: boolean;
    };
  };
  ativo: boolean;
  dataCriacao: string;
  dataAtualizacao: string;
}

export interface IRuleRepository {
  create(rule: Omit<IRule, 'id' | 'dataCriacao' | 'dataAtualizacao'>): Promise<IRule>;
  getAll(): Promise<IRule[]>;
  getById(id: string): Promise<IRule>;
  update(id: string, rule: Partial<IRule>): Promise<IRule>;
  delete(id: string): Promise<void>;
  toggleStatus(id: string): Promise<IRule>;
} 