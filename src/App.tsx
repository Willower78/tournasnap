import React, { useState, useEffect } from 'react';
import { 
  Zap, Trophy, Code2, CheckCircle2, Key,
  RefreshCw, Cpu, Check, Copy, Shield, Sparkles,
  Terminal, Play, Download, Trash2, Eye, ExternalLink,
  Layers, Rocket, Bookmark
} from 'lucide-react';

interface ModelTarget {
  id: string;
  name: string;
  provider: string;
  modelString: string;
  color: string;
  badge: string;
  isFree?: boolean;
}

const ALL_MODELS: ModelTarget[] = [
  {
    id: 'deepseek-r1-free',
    name: 'DeepSeek R1',
    provider: 'DeepSeek',
    modelString: 'deepseek/deepseek-r1:free',
    color: 'border-cyan-500/40 text-cyan-400 bg-cyan-500/10',
    badge: '100% FREE • Reasoning',
    isFree: true
  },
  {
    id: 'qwen-coder-free',
    name: 'Qwen 2.5 Coder 32B',
    provider: 'Alibaba',
    modelString: 'qwen/qwen-2.5-coder-32b-instruct:free',
    color: 'border-purple-500/40 text-purple-400 bg-purple-500/10',
    badge: '100% FREE • Coder',
    isFree: true
  },
  {
    id: 'llama-free',
    name: 'Llama 3.3 70B',
    provider: 'Meta',
    modelString: 'meta-llama/llama-3.3-70b-instruct:free',
    color: 'border-emerald-500/40 text-emerald-400 bg-emerald-500/10',
    badge: '100% FREE • Fast',
    isFree: true
  },
  {
    id: 'gemini-flash-free',
    name: 'Gemini 2.0 Flash',
    provider: 'Google',
    modelString: 'google/gemini-2.0-flash-exp:free',
    color: 'border-blue-500/40 text-blue-400 bg-blue-500/10',
    badge: '100% FREE • 1M Context',
    isFree: true
  },
  {
    id: 'mistral-free',
    name: 'Mistral Small 24B',
    provider: 'Mistral AI',
    modelString: 'mistralai/mistral-small-24b-instruct-2501:free',
    color: 'border-amber-500/40 text-amber-400 bg-amber-500/10',
    badge: '100% FREE • Logic',
    isFree: true
  },
  {
    id: 'claude-sonnet',
    name: 'Claude 3.5 Sonnet',
    provider: 'Anthropic',
    modelString: 'anthropic/claude-3.5-sonnet',
    color: 'border-orange-500/40 text-orange-400 bg-orange-500/10',
    badge: 'Frontier Benchmark'
  },
  {
    id: 'deepseek-v3',
    name: 'DeepSeek V3 / Coder',
    provider: 'DeepSeek',
    modelString: 'deepseek/deepseek-chat',
    color: 'border-sky-500/40 text-sky-400 bg-sky-500/10',
    badge: 'Direct Coder'
  }
];

const PRESETS = [
  "Bygg en modern timer- och resultattavla för matchsekretariat med mörk sportdesign i Tailwind CSS.",
  "Skapa en interaktiv krypto- och aktieportfölj med live PnL, donut-diagram och köp/sälj-modal.",
  "Bygg en Kanban board för sprint-planering med Drag and Drop, etiketter och prioriteringar.",
  "Skapa en responsiv musik- och podcastspelare med spellista, vågform och volymkontroll."
];

interface ModelResult {
  modelId: string;
  code: string;
  status: 'idle' | 'generating' | 'done' | 'error';
  latencyMs?: number;
  errorMsg?: string;
}

export default function App() {
  const [apiKey, setApiKey] = useState('');
  const [showKeyInput, setShowKeyInput] = useState(false);
  const [prompt, setPrompt] = useState(PRESETS[0]);
  
  // Standard-aktiverade gratismodeller
  const [selectedModelIds, setSelectedModelIds] = useState<string[]>([
    'deepseek-r1-free', 'qwen-coder-free', 'gemini-flash-free'
  ]);
  
  const [results, setResults] = useState<Record<string, ModelResult>>({});
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [toast, setToast] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToast(msg);
    setTimeout(() => setToast(null), 3000);
  };

  useEffect(() => {
    const saved = localStorage.getItem('VIBECODER_OPENROUTER_KEY');
    if (saved) setApiKey(saved);

    const initialResults: Record<string, ModelResult> = {};
    ALL_MODELS.forEach(m => {
      initialResults[m.id] = { modelId: m.id, code: '', status: 'idle' };
    });
    setResults(initialResults);
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

  const selectOnlyFree = () => {
    setSelectedModelIds(ALL_MODELS.filter(m => m.isFree).map(m => m.id));
    showToast('⚡ Alla 5 gratismodeller valda!');
  };

  const copyCode = (id: string, code: string) => {
    navigator.clipboard.writeText(code);
    setCopiedId(id);
    showToast('📋 Kod kopierad till urklipp!');
    setTimeout(() => setCopiedId(null), 2000);
  };

  const downloadFile = (modelName: string, code: string) => {
    const blob = new Blob([code], { type: 'text/typescript' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${modelName.replace(/\s+/g, '_')}_Component.tsx`;
    a.click();
    URL.revokeObjectURL(url);
    showToast('💾 Fil nedladdad!');
  };

  const executeParallelGeneration = async () => {
    if (!prompt.trim()) return;
    if (!apiKey.trim()) {
      setShowKeyInput(true);
      showToast('⚠️ Ange din OpenRouter-nyckel först!');
      return;
    }

    if (selectedModelIds.length === 0) {
      showToast('⚠️ Välj minst en AI-modell!');
      return;
    }

    const nextResults = { ...results };
    selectedModelIds.forEach(id => {
      nextResults[id] = { modelId: id, code: '', status: 'generating' };
    });
    setResults(nextResults);

    const systemPrompt = `You are an elite TypeScript React and Tailwind CSS engineer.
Write a complete, single-file, self-contained functional component based on the user prompt.
Output ONLY the clean raw code directly without backtick wrappers or markdown descriptions.`;

    const promises = selectedModelIds.map(async (modelId) => {
      const modelCfg = ALL_MODELS.find(m => m.id === modelId);
      if (!modelCfg) return;

      const startTime = performance.now();

      try {
        const res = await fetch('https://openrouter.ai/api/v1/chat/completions', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${apiKey.trim()}`,
            'HTTP-Referer': window.location.origin,
            'X-Title': 'VibeCoder Multi-AI Studio'
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
          const errMsg = data.error?.message || (data.error ? JSON.stringify(data.error) : 'Genereringen misslyckades');
          throw new Error(errMsg);
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
    <div className="min-h-screen bg-[#080B10] text-slate-100 font-sans flex flex-col selection:bg-indigo-500/30">
      
      {/* Header */}
      <header className="h-16 border-b border-slate-800/80 bg-slate-950/90 px-4 sm:px-8 flex items-center justify-between backdrop-blur-xl sticky top-0 z-40">
        <div className="flex items-center gap-3">
          <div className="bg-gradient-to-br from-indigo-500 to-purple-600 p-2.5 rounded-2xl text-white shadow-lg shadow-indigo-500/20">
            <Rocket className="w-5 h-5" />
          </div>
          <div>
            <h1 className="text-base font-black tracking-tight text-white flex items-center gap-2">
              <span>VibeCoder Studio</span>
              <span className="text-[10px] uppercase font-mono px-2 py-0.5 border border-indigo-500/30 bg-indigo-500/10 text-indigo-300 rounded-full font-bold">
                Multi-AI Arena
              </span>
            </h1>
            <p className="text-[11px] text-slate-400">Parallell kodgenerering över 7 AI-modeller & gratis-endpoints</p>
          </div>
        </div>

        {/* API Key Connection */}
        <div className="flex items-center gap-3">
          <button
            onClick={() => setShowKeyInput(!showKeyInput)}
            className={`text-xs px-3.5 py-1.5 rounded-xl font-bold flex items-center gap-2 transition border ${
              apiKey 
                ? 'bg-slate-900 text-emerald-400 border-emerald-500/30 shadow-lg shadow-emerald-500/10' 
                : 'bg-amber-500/10 border-amber-500/30 text-amber-400 animate-pulse'
            }`}
          >
            <Key className="w-3.5 h-3.5" />
            <span>{apiKey ? 'OpenRouter Ansluten' : 'Ange OpenRouter Nyckel'}</span>
          </button>
        </div>
      </header>

      {/* Main Studio Canvas */}
      <main className="flex-1 max-w-7xl w-full mx-auto p-4 sm:p-8 space-y-6">
        
        {/* API Key Modal / Drawer */}
        {showKeyInput && (
          <div className="p-5 bg-slate-900 border border-slate-800 rounded-3xl flex flex-col sm:flex-row items-center gap-3 shadow-2xl">
            <Key className="w-5 h-5 text-indigo-400 flex-shrink-0" />
            <input
              type="password"
              value={apiKey}
              onChange={(e) => saveKey(e.target.value)}
              placeholder="Klistra in din OpenRouter API-nyckel (sk-or-v1-...)"
              className="flex-1 w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2 text-xs text-white placeholder-slate-600 focus:outline-none font-mono"
            />
            <span className="text-[11px] text-emerald-400 font-mono flex-shrink-0">Sparad lokalt</span>
          </div>
        )}

        {/* Prompt Control Deck */}
        <div className="bg-slate-900/90 border border-slate-800/80 rounded-3xl p-6 shadow-2xl space-y-5 backdrop-blur-xl">
          
          <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-800 pb-4">
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-slate-300">Välj AI-modeller att tävla ({selectedModelIds.length} aktiva):</span>
              <button
                onClick={selectOnlyFree}
                className="text-[11px] font-bold text-cyan-400 bg-cyan-500/10 border border-cyan-500/30 px-2.5 py-0.5 rounded-lg hover:bg-cyan-500/20 transition"
              >
                ⚡ Välj alla 5 GRATIS
              </button>
            </div>
          </div>

          {/* Model Chips */}
          <div className="flex flex-wrap gap-2.5">
            {ALL_MODELS.map(m => {
              const active = selectedModelIds.includes(m.id);
              return (
                <button
                  key={m.id}
                  onClick={() => toggleModel(m.id)}
                  className={`text-xs px-3.5 py-2 rounded-2xl font-bold flex items-center gap-2 transition border ${
                    active ? m.color + ' shadow-lg' : 'bg-slate-950 border-slate-800 text-slate-500 hover:text-slate-300'
                  }`}
                >
                  <Cpu className="w-3.5 h-3.5" />
                  <span className="font-semibold">{m.name}</span>
                  <span className="text-[9px] uppercase font-mono px-1.5 py-0.5 rounded bg-black/40">
                    {m.badge}
                  </span>
                </button>
              );
            })}
          </div>

          {/* Prompt Area */}
          <div className="space-y-3">
            <textarea
              rows={3}
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              placeholder="Beskriv vad du vill att modellerna ska bygga..."
              className="w-full bg-slate-950 border border-slate-800 rounded-2xl p-4 text-xs sm:text-sm text-white placeholder-slate-600 focus:outline-none focus:border-indigo-500 resize-none font-sans leading-relaxed"
            />

            {/* Presets */}
            <div className="flex flex-wrap items-center gap-2 pt-1">
              <span className="text-[11px] font-bold text-slate-500 flex items-center gap-1">
                <Bookmark className="w-3 h-3" /> Snabbval:
              </span>
              {PRESETS.map((p, i) => (
                <button
                  key={i}
                  onClick={() => setPrompt(p)}
                  className="text-[10px] bg-slate-950 border border-slate-800 hover:border-slate-700 text-slate-400 hover:text-white px-2.5 py-1 rounded-xl transition truncate max-w-xs"
                >
                  {p.slice(0, 40)}...
                </button>
              ))}
            </div>
          </div>

          <div className="flex justify-end pt-2">
            <button
              onClick={executeParallelGeneration}
              disabled={!prompt.trim()}
              className="w-full sm:w-auto bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 disabled:opacity-40 text-white font-black px-8 py-4 rounded-2xl text-xs sm:text-sm flex items-center justify-center gap-2.5 transition shadow-2xl shadow-indigo-600/30 active:scale-95"
            >
              <Zap className="w-4 h-4 fill-white" />
              <span>Kör Parallell Dispatch ({selectedModelIds.length} Modeller)</span>
            </button>
          </div>
        </div>

        {/* Live Parallel Arena Grid */}
        <div className={`grid grid-cols-1 ${selectedModelIds.length === 2 ? 'md:grid-cols-2' : selectedModelIds.length >= 3 ? 'md:grid-cols-3' : ''} gap-5`}>
          {selectedModelIds.map(modelId => {
            const modelCfg = ALL_MODELS.find(m => m.id === modelId)!;
            const res = results[modelId] || { status: 'idle', code: '' };

            return (
              <div key={modelId} className="bg-slate-900/90 border border-slate-800 rounded-3xl overflow-hidden flex flex-col shadow-2xl">
                
                {/* Header */}
                <div className="p-4 border-b border-slate-800 flex items-center justify-between bg-slate-950/70">
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
                    <span className="text-indigo-400 font-mono text-[11px] animate-pulse flex items-center gap-1.5">
                      <RefreshCw className="w-3.5 h-3.5 animate-spin" /> Bygger...
                    </span>
                  )}
                  {res.status === 'done' && (
                    <span className="text-emerald-400 font-mono text-[10px] bg-emerald-500/10 px-2 py-0.5 rounded-full border border-emerald-500/30 font-bold">
                      ⚡ {res.latencyMs}ms
                    </span>
                  )}
                </div>

                {/* Code Window */}
                <div className="flex-1 min-h-[420px] max-h-[520px] bg-slate-950 p-4 font-mono text-[11px] overflow-y-auto text-slate-300 leading-relaxed select-all">
                  {res.status === 'idle' && (
                    <div className="h-full flex flex-col items-center justify-center text-slate-600 space-y-2 py-20">
                      <Code2 className="w-10 h-10 opacity-30" />
                      <span>Redo för dispatch</span>
                    </div>
                  )}

                  {res.status === 'generating' && (
                    <div className="h-full flex flex-col items-center justify-center text-indigo-400 space-y-3 py-20">
                      <RefreshCw className="w-8 h-8 animate-spin" />
                      <span className="text-xs font-sans">Genererar fullständig kodbas parallellt...</span>
                    </div>
                  )}

                  {res.status === 'error' && (
                    <div className="text-red-400 text-xs p-4 bg-red-500/10 border border-red-500/30 rounded-2xl">
                      ⚠️ {res.errorMsg || 'Genereringen misslyckades'}
                    </div>
                  )}

                  {res.status === 'done' && (
                    <pre className="whitespace-pre-wrap font-mono">
                      {res.code}
                    </pre>
                  )}
                </div>

                {/* Footer Controls */}
                {res.status === 'done' && (
                  <div className="p-3.5 border-t border-slate-800 bg-slate-950/80 flex items-center justify-between gap-2">
                    <button
                      onClick={() => downloadFile(modelCfg.name, res.code)}
                      className="text-slate-400 hover:text-white text-xs font-medium flex items-center gap-1.5 transition px-2 py-1 rounded-lg hover:bg-slate-900"
                    >
                      <Download className="w-3.5 h-3.5" />
                      <span>Ladda ner</span>
                    </button>

                    <button
                      onClick={() => copyCode(modelId, res.code)}
                      className="bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black px-4 py-1.5 rounded-xl text-xs flex items-center gap-1.5 transition shadow-lg shadow-emerald-500/20 active:scale-95"
                    >
                      {copiedId === modelId ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                      <span>{copiedId === modelId ? 'Kopierad!' : 'Kopiera Kod'}</span>
                    </button>
                  </div>
                )}

              </div>
            );
          })}
        </div>

      </main>

      {/* Toast Notification */}
      {toast && (
        <div className="fixed bottom-6 right-6 bg-emerald-500 text-slate-950 px-4 py-2.5 rounded-2xl font-bold text-xs shadow-2xl flex items-center gap-2 z-50 animate-bounce">
          <Check className="w-4 h-4" />
          <span>{toast}</span>
        </div>
      )}

    </div>
  );
}
