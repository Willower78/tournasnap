export interface ModelTarget {
  id: string;
  name: string;
  provider: string;
  modelString: string;
  color: string;
  badge: string;
  role: string;
}

export interface ModelResult {
  modelId: string;
  code: string;
  status: 'idle' | 'generating' | 'done' | 'error';
  latencyMs?: number;
  errorMsg?: string;
}

export const ALL_MODELS: ModelTarget[] = [
  {
    id: 'gemini-flash',
    name: 'Gemini 3.1 / 2.5 Flash',
    provider: 'Google',
    modelString: 'google/gemini-2.5-flash',
    color: 'border-blue-500/40 text-blue-400 bg-blue-500/10',
    badge: '1M Context',
    role: 'Master Synthesizer'
  },
  {
    id: 'qwen-coder',
    name: 'Qwen 2.5 Coder 32B',
    provider: 'Alibaba',
    modelString: 'qwen/qwen-2.5-coder-32b-instruct',
    color: 'border-purple-500/40 text-purple-400 bg-purple-500/10',
    badge: 'Top Full-Stack',
    role: 'TypeScript & Arkitektur'
  },
  {
    id: 'deepseek-chat',
    name: 'DeepSeek V3 / Coder',
    provider: 'DeepSeek',
    modelString: 'deepseek/deepseek-chat',
    color: 'border-cyan-500/40 text-cyan-400 bg-cyan-500/10',
    badge: 'High Speed Logic',
    role: 'Logik & Edge Cases'
  },
  {
    id: 'llama-3-3',
    name: 'Llama 3.3 70B',
    provider: 'Meta',
    modelString: 'meta-llama/llama-3.3-70b-instruct',
    color: 'border-emerald-500/40 text-emerald-400 bg-emerald-500/10',
    badge: 'Ultra Fast',
    role: 'UI & Interaktioner'
  },
  {
    id: 'mistral-small',
    name: 'Mistral Small 24B',
    provider: 'Mistral AI',
    modelString: 'mistralai/mistral-small-24b-instruct-2501',
    color: 'border-amber-500/40 text-amber-400 bg-amber-500/10',
    badge: 'Strict Logic',
    role: 'Validering & Stabilitet'
  }
];

export const CODE_PRESETS = [
  "Bygg en modern timer- och resultattavla för matchsekretariat med mörk sportdesign i Tailwind CSS.",
  "Skapa en interaktiv krypto- och aktieportfölj med live PnL, donut-diagram och köp/sälj-modal.",
  "Bygg en Kanban board för sprint-planering med Drag and Drop, etiketter och prioriteringar.",
  "Skapa en responsiv musik- och podcastspelare med spellista, vågform och volymkontroll."
];
