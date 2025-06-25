import { IRule, IRuleRepository } from '../../core/domain/interfaces/IRule';
import { ruleService } from '../api/api';

export class RuleRepository implements IRuleRepository {
  async create(rule: Omit<IRule, 'id' | 'dataCriacao' | 'dataAtualizacao'>): Promise<IRule> {
    const result = await ruleService.create(rule);
    return result as IRule;
  }

  async getAll(): Promise<IRule[]> {
    const result = await ruleService.getAll();
    return result as IRule[];
  }

  async getById(id: string): Promise<IRule> {
    const result = await ruleService.getById(id);
    return result as IRule;
  }

  async update(id: string, rule: Partial<IRule>): Promise<IRule> {
    const result = await ruleService.update(id, rule);
    return result as IRule;
  }

  async delete(id: string): Promise<void> {
    await ruleService.delete(id);
  }

  async toggleStatus(id: string): Promise<IRule> {
    const result = await ruleService.toggleStatus(id);
    return result as IRule;
  }
} 