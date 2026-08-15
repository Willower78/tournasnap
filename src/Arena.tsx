import React, { useState, useEffect } from 'react';
import { 
  Zap, Trophy, Code2, CheckCircle2, Key,
  RefreshCw, Cpu, Check, Layers, Copy, Shield
} from 'lucide-react';

interface ModelTarget {
  id: string;
  name: string;
  provider: string;
  modelString: string;
  color: string;
  badge: string;
}

const ARENA_MODELS: ModelTarget[] = [
  {
    id: 'claude',
    name: 'Claude 3.5 Sonnet',
    provider: 'Anthropic',
    modelString: 'anthropic/claude-3.5-sonnet',
    color: 'border-orange-500/40 text-orange-400 bg-orange-500/10',
    badge: 'State of the Art'
  },
  {
    id: 'deepseek',
    name: 'DeepSeek Coder V2.5',
    provider: 'DeepSeek',
    modelString: 'deepseek/deepseek-coder',
    color: 'border-blue-500/40 text-blue-400 bg-blue-500/10',
    badge: 'Code Architect'
  },
  {
    id: 'qwen',
    name: 'Qwen 2.5 Coder 32B',
    provider: 'Alibaba',
    modelString: 'qwen/qwen-2.5-coder-32b-instruct',
    color: 'border-purple-500/40 text-purple-400 bg-purple-500/10',
    badge: 'Full-Stack Logic'
  },
  {
    id: 'mistral',
    name: 'Codestral / Mistral Large',
    provider: 'Mistral AI',
    modelString: 'mistralai/codestral-2501',
    color: 'border-amber-500/40 text-amber-400 bg-amber-500/10',
    badge: 'Fast & Concise'
  },
  {
    id: 'kimi',
    name: 'Kimi (Moonshot)',
    provider: 'Moonshot AI',
    modelString: 'moonshotai/moonshot-v1-32k',
    color: 'border-cyan-500/40 text-cyan-400 bg-cyan-500/10',
    badge: 'Reasoning'
  },
  {
    id: 'llama',
    name: 'Llama 3.3 70B',
    provider: 'Meta',
    modelString: 'meta-llama/llama-3.3-70b-instruct',
    color: 'border-emerald-500/40 text-emerald-400 bg-emerald-500/10',
    badge: 'Open Weight'
  }
];

interface ModelResult {
  modelId: string;
  code: string;
  status: 'idle' | 'generating' | 'done' | 'error';
  latencyMs?: number;
  errorMsg?: string;
}

interface ArenaProps {
  onAdoptCode: (code: string) => void;
}

export default function Arena({ onAdoptCode }: ArenaProps) {
  const [apiKey, setApiKey] = useState('');
  const [showKeyInput, setShowKeyInput] = useState(false);
  const [prompt, setPrompt] = useState('');
  
  // Default selected: Claude, DeepSeek, Codestral
  const [selectedModelIds, setSelectedModelIds] = useState<string[]>([
    'claude', 'deepseek', 'mistral'
  ]);
  
  const [results, setResults] = useState<Record<string, ModelResult>>({
    claude: { modelId: 'claude', code: '', status: 'idle' },
    deepseek: { modelId: 'deepseek', code: '', status: 'idle' },
    qwen: { modelId: 'qwen', code: '', status: 'idle' },
    mistral: { modelId: 'mistral', code: '', status: 'idle' },
    kimi: { modelId: 'kimi', code: '', status: 'idle' },
    llama: { modelId: 'llama', code: '', status: 'idle' },
  });

  const [copiedId, setCopiedId] = useState<string | null>(null);

  // Load OpenRouter key from local storage on load
  useEffect(() => {
    const saved = localStorage.getItem('VIBECODER_OPENROUTER_KEY');
    if (saved) setApiKey(saved);
  }, []);

  const saveKey = (val: string) => {
    setApiKey(val);
    localStorage.setItem('VIBECODER_OPENROUTER_KEY', val);
  };

  const toggleModel = (id: string) => {
    setSelectedModelIds(prev => 
      prev.includes(id) ? prev.filter(m => m !== id) : [...prev, id]
    );
  };

  const copyCode = (id: string, code: string) => {
    navigator.clipboard.writeText(code);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const executeParallelArena = async () => {
    if (!prompt.trim()) return;
    if (!apiKey) {
      setShowKeyInput(true);
      return;
    }

    const nextResults = { ...results };
    selectedModelIds.forEach(id => {
      nextResults[id] = { modelId: id, code: '', status: 'generating' };
    });
    setResults(nextResults);

    const systemPrompt = `You are a world-class principal React/TypeScript engineer. Build a complete, elegant, fully self-contained functional component using Tailwind CSS based on the user request. 
Output clean, working code directly.`;

    const promises = selectedModelIds.map(async (modelId) => {
      const modelCfg = ARENA_MODELS.find(m => m.id === modelId);
      if (!modelCfg) return;

      const startTime = performance.now();

      try {
        const res = await fetch('https://openrouter.ai/api/v1/chat/completions', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${apiKey.trim()}`,
            'HTTP-Referer': window.location.origin,
            'X-Title': 'VibeCoder AI Arena'
          },
          body: JSON.stringify({
            model: modelCfg.modelString,
            messages: [
              { role: 'system', content: systemPrompt },
              { role: 'user', content: prompt }
            ]
          })
        });

        const data = await res.json();
        const endTime = performance.now();
        const latency = Math.round(endTime - startTime);

        if (data.choices && data.choices[0]?.message?.content) {
          let cleanCode = data.choices[0].message.content.trim();
          if (cleanCode.startsWith('```')) {
            cleanCode = cleanCode.replace(/^```[a-z]*\n/, '').replace(/\n```$/, '');
          }
          setResults(prev => ({
            ...prev,
            [modelId]: {
              modelId,
              code: cleanCode,
              status: 'done',
              latencyMs: latency
            }
          }));
        } else {
          throw new Error(data.error?.message || 'Generation failed');
        }
      } catch (err: any) {
        setResults(prev => ({
          ...prev,
          [modelId]: {
            modelId,
            code: '',
            status: 'error',
            errorMsg: err.message
          }
        }));
      }
    });

    await Promise.allSettled(promises);
  };

  return (
    <div className="space-y-6">
      
      {/* Top Controller */}
      <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-2xl space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-800 pb-4">
          <div className="flex items-center gap-2.5">
            <div className="p-2 bg-indigo-500/10 border border-indigo-500/30 rounded-xl text-indigo-400">
              <Trophy className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-sm font-black tracking-tight text-white flex items-center gap-2">
                <span>Multi-AI Parallel Battleground</span>
                <span className="text-[10px] uppercase font-mono px-2 py-0.5 border border-indigo-500/30 bg-indigo-500/10 text-indigo-300 rounded-full">
                  6 Top Models
                </span>
              </h2>
              <p className="text-[11px] text-slate-400">One prompt $\rightarrow$ parallel generation across Claude, DeepSeek, Mistral, Kimi, Qwen & Llama.</p>
            </div>
          </div>

          <button
            onClick={() => setShowKeyInput(!showKeyInput)}
            className={`text-xs px-3 py-1.5 rounded-xl font-bold flex items-center gap-1.5 transition border ${
              apiKey ? 'bg-slate-950 text-slate-300 border-slate-800' : 'bg-amber-500/10 border-amber-500/30 text-amber-400'
            }`}
          >
            <Key className="w-3.5 h-3.5" />
            <span>{apiKey ? 'OpenRouter Key Connected' : 'Set OpenRouter Key'}</span>
          </button>
        </div>

        {/* API Key Drawer */}
        {showKeyInput && (
          <div className="p-4 bg-slate-950 border border-slate-800 rounded-2xl flex items-center gap-3">
            <Key className="w-4 h-4 text-slate-500 flex-shrink-0" />
            <input
              type="password"
              value={apiKey}
              onChange={(e) => saveKey(e.target.value)}
              placeholder="sk-or-v1-..."
              className="flex-1 bg-transparent text-xs text-white placeholder-slate-600 focus:outline-none font-mono"
            />
            <span className="text-[10px] text-emerald-400 font-mono">Saved in localStorage</span>
          </div>
        )}

        {/* Model Toggles */}
        <div className="flex flex-wrap gap-2">
          {ARENA_MODELS.map(m => {
            const active = selectedModelIds.includes(m.id);
            return (
              <button
                key={m.id}
                onClick={() => toggleModel(m.id)}
                className={`text-xs px-3 py-1.5 rounded-xl font-bold flex items-center gap-1.5 transition border ${
                  active ? m.color : 'bg-slate-950 border-slate-800 text-slate-500 hover:text-slate-300'
                }`}
              >
                <Cpu className="w-3.5 h-3.5" />
                <span>{m.name}</span>
              </button>
            );
          })}
        </div>

        {/* Prompt Input */}
        <div className="flex gap-3">
          <textarea
            rows={2}
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            placeholder="Type your feature or component request..."
            className="flex-1 bg-slate-950 border border-slate-800 rounded-2xl p-3.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500 resize-none font-sans"
          />
          <button
            onClick={executeParallelArena}
            disabled={!prompt.trim()}
            className="bg-indigo-600 hover:bg-indigo-500 disabled:opacity-40 text-white font-black px-6 rounded-2xl text-xs flex items-center justify-center gap-2 transition shadow-xl shadow-indigo-600/20 active:scale-95 flex-shrink-0"
          >
            <Zap className="w-4 h-4 fill-white" />
            <span>Generate ({selectedModelIds.length})</span>
          </button>
        </div>
      </div>

      {/* Arena Grid: Side-by-Side Model Arena */}
      <div className={`grid grid-cols-1 ${selectedModelIds.length === 2 ? 'md:grid-cols-2' : selectedModelIds.length >= 3 ? 'md:grid-cols-3' : ''} gap-4`}>
        {selectedModelIds.map(modelId => {
          const modelCfg = ARENA_MODELS.find(m => m.id === modelId)!;
          const res = results[modelId] || { status: 'idle', code: '' };

          return (
            <div key={modelId} className="bg-slate-900 border border-slate-800 rounded-3xl overflow-hidden flex flex-col shadow-2xl">
              
              {/* Header */}
              <div className="p-4 border-b border-slate-800 flex items-center justify-between bg-slate-950/60">
                <div className="space-y-0.5">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-black text-white">{modelCfg.name}</span>
                    <span className={`text-[9px] uppercase font-mono px-1.5 py-0.5 rounded border ${modelCfg.color}`}>
                      {modelCfg.badge}
                    </span>
                  </div>
                  <span className="text-[10px] font-mono text-slate-500">{modelCfg.provider}</span>
                </div>

                {res.status === 'generating' && (
                  <span className="text-indigo-400 font-mono text-[11px] animate-pulse flex items-center gap-1">
                    <RefreshCw className="w-3 h-3 animate-spin" /> Coding...
                  </span>
                )}
                {res.status === 'done' && (
                  <span className="text-emerald-400 font-mono text-[10px] bg-emerald-500/10 px-2 py-0.5 rounded-full border border-emerald-500/30">
                    ⚡ {res.latencyMs}ms
                  </span>
                )}
              </div>

              {/* Code Area */}
              <div className="flex-1 min-h-[400px] max-h-[500px] bg-slate-950 p-4 font-mono text-[11px] overflow-y-auto text-slate-300">
                {res.status === 'idle' && (
                  <div className="h-full flex flex-col items-center justify-center text-slate-600 space-y-2">
                    <Code2 className="w-8 h-8 opacity-40" />
                    <span>Waiting for prompt dispatch</span>
                  </div>
                )}

                {res.status === 'generating' && (
                  <div className="h-full flex flex-col items-center justify-center text-indigo-400 space-y-2">
                    <RefreshCw className="w-8 h-8 animate-spin" />
                    <span className="text-xs font-sans">Generating full codebase...</span>
                  </div>
                )}

                {res.status === 'error' && (
                  <div className="text-red-400 text-xs p-3 bg-red-500/10 border border-red-500/30 rounded-xl">
                    ⚠️ {res.errorMsg || 'Generation failed'}
                  </div>
                )}

                {res.status === 'done' && (
                  <pre className="whitespace-pre-wrap font-mono leading-relaxed select-all">
                    {res.code}
                  </pre>
                )}
              </div>

              {/* Footer */}
              {res.status === 'done' && (
                <div className="p-3.5 border-t border-slate-800 bg-slate-950/80 flex items-center justify-between gap-2">
                  <button
                    onClick={() => copyCode(modelId, res.code)}
                    className="text-slate-400 hover:text-white text-xs font-medium flex items-center gap-1.5 transition p-1"
                  >
                    {copiedId === modelId ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                    <span>{copiedId === modelId ? 'Copied' : 'Copy'}</span>
                  </button>

                  <button
                    onClick={() => onAdoptCode(res.code)}
                    className="bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black px-3.5 py-1.5 rounded-xl text-xs flex items-center gap-1.5 transition shadow-lg shadow-emerald-500/20 active:scale-95"
                  >
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    <span>Adopt Version</span>
                  </button>
                </div>
              )}

            </div>
          );
        })}
      </div>

    </div>
  );
}
