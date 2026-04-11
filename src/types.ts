export type Page = 'dashboard' | 'upload' | 'mapping' | 'migration' | 'admin';

export interface ProcessorTemplate {
  name: string;
  mappings: Record<string, string>;
  configs: any[];
  timestamp: number;
}
