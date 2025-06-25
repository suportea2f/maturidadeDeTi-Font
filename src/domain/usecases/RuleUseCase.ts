import { Rule } from '../models/Rule';

export abstract class RuleUseCase {
  abstract createRule(rule: Rule): Promise<Rule>;
  abstract updateRule(rule: Rule): Promise<Rule>;
  abstract deleteRule(id: string): Promise<void>;
  abstract getRule(id: string): Promise<Rule>;
  abstract getAllRules(): Promise<Rule[]>;
}