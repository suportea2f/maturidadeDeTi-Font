export interface Endpoint {
  url: string;
  methods: {
    get: boolean;
    post: boolean;
    put: boolean;
    delete: boolean;
  };
}

export interface Rule {
  id?: string;
  nome: string;
  descricao: string;
  endpoints: Endpoint[];
}

export type HttpMethod = 'GET' | 'POST' | 'PUT' | 'DELETE'; 