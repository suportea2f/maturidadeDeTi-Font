import { IEvaluationTemplate, IEvaluationTemplateRepository } from '../domain/interfaces/IEvaluationTemplate';

export class EvaluationTemplateUseCase {
  constructor(private evaluationTemplateRepository: IEvaluationTemplateRepository) {}

  async getAllTemplates(): Promise<IEvaluationTemplate[]> {
    return this.evaluationTemplateRepository.getAll();
  }

  async getTemplateById(id: string): Promise<IEvaluationTemplate | null> {
    return this.evaluationTemplateRepository.getById(id);
  }

  async getPublishedTemplates(): Promise<IEvaluationTemplate[]> {
    return this.evaluationTemplateRepository.getPublished();
  }

  async createTemplate(template: IEvaluationTemplate): Promise<IEvaluationTemplate> {
    // Definir valores padrão
    const newTemplate: IEvaluationTemplate = {
      ...template,
      status: template.status || 'rascunho',
      questionIds: template.questionIds || [],
    };
    
    return this.evaluationTemplateRepository.create(newTemplate);
  }

  async updateTemplate(id: string, template: Partial<IEvaluationTemplate>): Promise<IEvaluationTemplate> {
    return this.evaluationTemplateRepository.update(id, template);
  }

  async deleteTemplate(id: string): Promise<void> {
    return this.evaluationTemplateRepository.delete(id);
  }

  async publishTemplate(id: string): Promise<IEvaluationTemplate> {
    // Primeiro, verifica se o template existe e tem questões
    const template = await this.evaluationTemplateRepository.getById(id);
    
    if (!template) {
      throw new Error('Template de avaliação não encontrado');
    }
    
    if (template.questionIds.length === 0) {
      throw new Error('Não é possível publicar um template sem questões');
    }
    
    // Publica o template
    return this.evaluationTemplateRepository.publish(id);
  }

  async addQuestionToTemplate(templateId: string, questionId: string): Promise<IEvaluationTemplate> {
    // Verifica se o template está em modo rascunho
    const template = await this.evaluationTemplateRepository.getById(templateId);
    
    if (!template) {
      throw new Error('Template de avaliação não encontrado');
    }
    
    if (template.status !== 'rascunho') {
      throw new Error('Não é possível modificar um template que não está em rascunho');
    }
    
    return this.evaluationTemplateRepository.addQuestion(templateId, questionId);
  }

  async removeQuestionFromTemplate(templateId: string, questionId: string): Promise<IEvaluationTemplate> {
    // Verifica se o template está em modo rascunho
    const template = await this.evaluationTemplateRepository.getById(templateId);
    
    if (!template) {
      throw new Error('Template de avaliação não encontrado');
    }
    
    if (template.status !== 'rascunho') {
      throw new Error('Não é possível modificar um template que não está em rascunho');
    }
    
    return this.evaluationTemplateRepository.removeQuestion(templateId, questionId);
  }
} 