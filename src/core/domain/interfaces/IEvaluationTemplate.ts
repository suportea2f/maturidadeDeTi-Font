export interface IEvaluationTemplate {
  id?: string;
  userId: string;
  nome: string;
  descricao: string;
  questionIds: string[];
  status: 'rascunho' | 'publicada' | 'arquivada';
  createdAt?: string;
  updatedAt?: string;
}

export interface IEvaluationTemplateRepository {
  getAll(): Promise<IEvaluationTemplate[]>;
  getById(id: string): Promise<IEvaluationTemplate | null>;
  getPublished(): Promise<IEvaluationTemplate[]>;
  create(template: IEvaluationTemplate): Promise<IEvaluationTemplate>;
  update(id: string, template: Partial<IEvaluationTemplate>): Promise<IEvaluationTemplate>;
  delete(id: string): Promise<void>;
  publish(id: string): Promise<IEvaluationTemplate>;
  addQuestion(templateId: string, questionId: string): Promise<IEvaluationTemplate>;
  removeQuestion(templateId: string, questionId: string): Promise<IEvaluationTemplate>;
} 