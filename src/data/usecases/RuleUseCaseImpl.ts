import { Rule } from '../../domain/models/Rule';
import { RuleUseCase } from '../../domain/usecases/RuleUseCase';
import { api } from '../api';

export class RuleUseCaseImpl extends RuleUseCase {
  async createRule(rule: Rule): Promise<Rule> {
    const response = await api.post<Rule>('/api/rules', rule);
    return response.data;
  }

  async updateRule(rule: Rule): Promise<Rule> {
    const response = await api.put<Rule>(`/api/rules/${rule.id}`, rule);
    return response.data;
  }

  async deleteRule(id: string): Promise<void> {
    await api.delete(`/api/rules/${id}`);
  }

  async getRule(id: string): Promise<Rule> {
    const response = await api.get<Rule>(`/api/rules/${id}`);
    return response.data;
  }

  async getAllRules(): Promise<Rule[]> {
    const response = await api.get<Rule[]>('/api/rules');
    return response.data;
  }
} 