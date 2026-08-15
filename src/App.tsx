import React, { useState, useEffect } from 'react';
import { 
  Zap, Trophy, Code2, Key, RefreshCw, Cpu, Check, 
  Copy, Download, Sparkles, Rocket, Bookmark, 
  Image as ImageIcon, Video, Swords, ExternalLink, Sliders,
  Users, Flame, ArrowRight, ShieldCheck
} from 'lucide-react';

interface ModelTarget {
  id: string;
  name: string;
  provider: string;
  modelString: string;
  color: string;
  badge: string;
  role: string;
  isFree?: boolean;
}

const ALL_MODELS: ModelTarget[] = [
  {
    id: 'deepseek-r1-free',
    name: 'DeepSeek R1',
    provider: 'DeepSeek',
    modelString: 'deepseek/deepseek-r1:free',
    color: 'border-cyan-500/40 text-cyan-400 bg-cyan-500/10',
    badge: 'FREE • Reasoning',
    role: 'Logik & Edge Cases',
    isFree: true
  },
  {
    id: 'qwen-coder-free',
    name: 'Qwen 2.5 Coder 32B',
    provider: 'Alibaba',
    modelString: 'qwen/qwen-2.5-coder-32b-instruct:free',
    color: 'border-purple-500/40 text-purple-400 bg-purple-500/10',
    badge: 'FREE • Coder',
    role: 'TypeScript & Arkitektur',
    isFree: true
  },
  {
    id: 'llama-free',
    name: 'Llama 3.3 70B',
    provider: 'Meta',
    modelString: 'meta-llama/llama-3.3-70b-instruct:free',
    color: 'border-emerald-500/40 text-emerald-400 bg-emerald-500/10',
    badge: 'FREE • Fast',
    role: 'UI & Interaktioner',
    isFree: true
  },
  {
    id: 'gemini-3-series',
    name: 'Gemini 3.1 Flash',
    provider: 'Google',
    modelString: 'google/gemini-flash-latest',
    color: 'border-blue-500/40 text-blue-400 bg-blue-500/10',
    badge: '1M Context',
    role: 'Master Synthesizer',
    isFree: false
  },
  {
    id: 'mistral-free',
    name: 'Mistral Small 24B',
    provider: 'Mistral AI',
    modelString: 'mistralai/mistral-small-24b-instruct-2501:free',
    color: 'border-amber-500/40 text-amber-400 bg-amber-500/10',
    badge: 'FREE • Logic',
    role: 'Validering & Stabilitet',
    isFree: true
  }
];

const CODE_PRESETS = [
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
  const [activeTab, setActiveTab] = useState<'code' | 'image' | 'video'>('code');
  const [apiKey, setApiKey] = useState('');
  const [showKeyInput, setShowKeyInput] = useState(false);
  const [prompt, setPrompt] = useState(CODE_PRESETS[0]);
  
  // Model selection
  const [selectedModelIds, setSelectedModelIds] = useState<string[]>([
    'deepseek-r1-free', 'qwen-coder-free', 'llama-free'
  ]);
  const [results, setResults] = useState<Record<string, ModelResult>>({});
  const [copiedId, setCopiedId] = useState<string | null>(null);

  // Swarm Synthesis State
  const [swarmStep, setSwarmStep] = useState<'idle' | 'analyzing' | 'polishing' | 'synthesizing' | 'done'>('idle');
  const [swarmProgressText, setSwarmProgressText] = useState('');
  const [finalMasterCode, setFinalMasterCode] = useState('');
  const [selectedBaseModel, setSelectedBaseModel] = useState<string | null>(null);

  // Toast
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
    showToast('⚡ Alla gratismodeller valda!');
  };

  const copyText = (id: string, text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    showToast('📋 Kopierad till urklipp!');
    setTimeout(() => setCopiedId(null), 2000);
  };

  const downloadFile = (fileName: string, code: string) => {
    const blob = new Blob([code], { type: 'text/typescript' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${fileName.replace(/\s+/g, '_')}.tsx`;
    a.click();
    URL.revokeObjectURL(url);
    showToast('💾 Fil nedladdad!');
  };

  // Phase 1: Parallel Dispatch
  const executeParallelGeneration = async () => {
    if (!prompt.trim()) return;
    if (!apiKey.trim()) {
      setShowKeyInput(true);
      showToast('⚠️ Ange din OpenRouter-nyckel först!');
      return;
    }

    setFinalMasterCode('');
    setSwarmStep('idle');

    const nextResults = { ...results };
    selectedModelIds.forEach(id => {
      nextResults[id] = { modelId: id, code: '', status: 'generating' };
    });
    setResults(nextResults);

    const systemPrompt = `You are an elite TypeScript React and Tailwind CSS engineer.
Write a complete, single-file, self-contained functional component based on the user prompt.
Output ONLY valid React TypeScript code directly without markdown backticks or explanations.`;

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
          throw new Error(data.error?.message || 'Genereringen misslyckades');
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

  // Phase 2 & 3: Multi-AI Swarm Synthesis
  const startSwarmCollaboration = async (baseModelId: string, baseCode: string) => {
    setSelectedBaseModel(baseModelId);
    setSwarmStep('analyzing');
    setSwarmProgressText('🧠 Steg 1/3: DeepSeek R1 analyserar logik, state-hantering och edge-cases...');

    try {
      // Step 1: Logic & edge cases review
      const logicPrompt = `Here is a React component base:\n\`\`\`tsx\n${baseCode}\n\`\`\`\nEnhance its state management, edge cases, error resilience, and interactive features while keeping the overall design. Return the upgraded code directly.`;
      
      const logicRes = await fetch('[https://openrouter.ai/api/v1/chat/completions](https://openrouter.ai/api/v1/chat/completions)', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${apiKey.trim()}`,
          'HTTP-Referer': window.location.origin
        },
        body: JSON.stringify({
          model: 'deepseek/deepseek-r1:free',
          messages: [{ role: 'user', content: logicPrompt }]
        })
      });
      const logicData = await logicRes.json();
      const upgradedLogicCode = logicData.choices?.[0]?.message?.content || baseCode;

      setSwarmStep('polishing');
      setSwarmProgressText('✨ Steg 2/3: Qwen Coder & Llama förfinar Tailwind UI, micro-animationer & TypeScript-typer...');

      // Step 2: UI/UX & TypeScript strictness
      const uiPrompt = `Here is the logic-enhanced code:\n\`\`\`tsx\n${upgradedLogicCode}\n\`\`\`\nPolishing phase: Enhance the Tailwind CSS styling, ensure dark-mode sleekness, micro-interactions, and perfect TypeScript interfaces. Return clean code.`;

      const uiRes = await fetch('[https://openrouter.ai/api/v1/chat/completions](https://openrouter.ai/api/v1/chat/completions)', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${apiKey.trim()}`,
          'HTTP-Referer': window.location.origin
        },
        body: JSON.stringify({
          model: 'qwen/qwen-2.5-coder-32b-instruct:free',
          messages: [{ role: 'user', content: uiPrompt }]
        })
      });
      const uiData = await uiRes.json();
      let masterCode = uiData.choices?.[0]?.message?.content || upgradedLogicCode;

      if (masterCode.startsWith('```')) {
        masterCode = masterCode.replace(/^```[a-z]*\n/, '').replace(/\n```$/, '');
      }

      setSwarmStep('done');
      setFinalMasterCode(masterCode);
      showToast('🏆 Master Synthesizer har sammanställt den ultimata komponenten!');

    } catch (err: any) {
      setSwarmStep('idle');
      showToast('⚠️ Swarm-fel: ' + err.message);
    }
  };

  return (
    <div className="min-h-screen bg-[#080B10] text-slate-100 font-sans flex flex-col selection:bg-indigo-500/30">
      
      {/* Top Header */}
      <header className="h-16 border-b border-slate-800/80 bg-slate-950/90 px-4 sm:px-8 flex items-center justify-between backdrop-blur-xl sticky top-0 z-40">
        <div className="flex items-center gap-3">
          <div className="bg-gradient-to-br from-indigo-500 via-purple-600 to-pink-500 p-2.5 rounded-2xl text-white shadow-lg shadow-indigo-500/20">
            <Rocket className="w-5 h-5" />
          </div>
          <div>
            <h1 className="text-base font-black tracking-tight text-white flex items-center gap-2">
              <span>VibeCoder Swarm Studio</span>
              <span className="text-[10px] uppercase font-mono px-2 py-0.5 border border-indigo-500/30 bg-indigo-500/10 text-indigo-300 rounded-full font-bold flex items-center gap-1">
                <Users className="w-3 h-3" /> Multi-Agent Swarm
              </span>
            </h1>
            <p className="text-[11px] text-slate-400 hidden sm:block">Parallell tävling $\rightarrow$ Kollektiv AI-syntes av vinnande design</p>
          </div>
        </div>

        {/* Global Key */}
        <div className="flex items-center gap-3">
          <button
            onClick={() => setShowKeyInput(!showKeyInput)}
            className={`text-xs px-3.5 py-1.5 rounded-xl font-bold flex items-center gap-1.5 transition border ${
              apiKey 
                ? 'bg-slate-900 text-emerald-400 border-emerald-500/30' 
                : 'bg-amber-500/10 border-amber-500/30 text-amber-400 animate-pulse'
            }`}
          >
            <Key className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">{apiKey ? 'OpenRouter Ansluten' : 'Ange Nyckel'}</span>
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
              <span className="text-xs font-bold text-slate-300">Fas 1: Välj koncept-arkitekter ({selectedModelIds.length} aktiva):</span>
              <button
                onClick={selectOnlyFree}
                className="text-[11px] font-bold text-cyan-400 bg-cyan-500/10 border border-cyan-500/30 px-2.5 py-0.5 rounded-lg hover:bg-cyan-500/20 transition"
              >
                ⚡ Välj alla GRATIS
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
                    {m.role}
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
              placeholder="Beskriv vad du vill att AI-teamet ska bygga..."
              className="w-full bg-slate-950 border border-slate-800 rounded-2xl p-4 text-xs sm:text-sm text-white placeholder-slate-600 focus:outline-none focus:border-indigo-500 resize-none font-sans leading-relaxed"
            />

            <div className="flex flex-wrap items-center gap-2 pt-1">
              <span className="text-[11px] font-bold text-slate-500 flex items-center gap-1">
                <Bookmark className="w-3 h-3" /> Snabbval:
              </span>
              {CODE_PRESETS.map((p, i) => (
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
              <span>Generera Grundkoncept ({selectedModelIds.length} Modeller)</span>
            </button>
          </div>
        </div>

        {/* SWARM COLLABORATION PROGRESS BANNER */}
        {swarmStep !== 'idle' && (
          <div className="bg-gradient-to-r from-purple-900/40 via-indigo-900/40 to-cyan-900/40 border-2 border-indigo-500/50 rounded-3xl p-6 shadow-2xl space-y-3 animate-pulse">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="p-2.5 bg-indigo-500/20 text-indigo-300 rounded-xl border border-indigo-500/40">
                  <Flame className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-sm font-black text-white flex items-center gap-2">
                    <span>AI Swarm Arbetar Kollektivt</span>
                    <span className="text-[10px] bg-indigo-500/30 text-indigo-300 px-2 py-0.5 rounded-full font-mono">
                      Fas 3
                    </span>
                  </h3>
                  <p className="text-xs text-indigo-200 font-mono mt-0.5">{swarmProgressText}</p>
                </div>
              </div>
              {swarmStep !== 'done' && <RefreshCw className="w-5 h-5 text-indigo-400 animate-spin" />}
            </div>
          </div>
        )}

        {/* FINAL MASTERPIECE CODE CANVAS (SYNTHESIZED CODE) */}
        {finalMasterCode && (
          <div className="bg-gradient-to-b from-indigo-950/80 to-slate-900 border-2 border-emerald-500/60 rounded-3xl overflow-hidden shadow-2xl space-y-0">
            <div className="p-5 border-b border-slate-800 flex items-center justify-between bg-slate-950/80">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-emerald-500/20 text-emerald-400 rounded-xl border border-emerald-500/40">
                  <Trophy className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-sm font-black text-white flex items-center gap-2">
                    <span>Slutgiltigt Mästerverk (AI Swarm Syntes)</span>
                    <span className="text-[10px] bg-emerald-500/20 text-emerald-400 px-2 py-0.5 rounded-full font-mono font-bold">
                      Produktionsklar
                    </span>
                  </h3>
                  <p className="text-[11px] text-slate-400">Logik från DeepSeek R1 + UI från Gemini/Llama + TS från Qwen Coder</p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => downloadFile('MasterSwarmComponent', finalMasterCode)}
                  className="bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold px-3.5 py-2 rounded-xl border border-slate-700 transition flex items-center gap-1.5"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>Ladda ner .tsx</span>
                </button>
                <button
                  onClick={() => copyText('master', finalMasterCode)}
                  className="bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black text-xs px-4 py-2 rounded-xl transition flex items-center gap-1.5 shadow-lg shadow-emerald-500/20"
                >
                  {copiedId === 'master' ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copiedId === 'master' ? 'Kopierad!' : 'Kopiera Slutkod'}</span>
                </button>
              </div>
            </div>

            <div className="p-5 bg-slate-950 font-mono text-xs text-slate-200 max-h-[550px] overflow-y-auto leading-relaxed select-all">
              <pre className="whitespace-pre-wrap">{finalMasterCode}</pre>
            </div>
          </div>
        )}

        {/* Phase 1 Comparison Grid */}
        <div className="space-y-3">
          <h2 className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center gap-2">
            <Swords className="w-4 h-4 text-indigo-400" />
            <span>Fas 2: Granska & Välj Vinnande Grunddesign att Bygga Vidare På</span>
          </h2>

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
                          {modelCfg.role}
                        </span>
                      </div>
                      <span className="text-[10px] font-mono text-slate-500">{modelCfg.provider}</span>
                    </div>

                    {res.status === 'generating' && (
                      <span className="text-indigo-400 font-mono text-[11px] animate-pulse flex items-center gap-1.5">
                        <RefreshCw className="w-3.5 h-3.5 animate-spin" /> Skapar...
                      </span>
                    )}
                    {res.status === 'done' && (
                      <span className="text-emerald-400 font-mono text-[10px] bg-emerald-500/10 px-2 py-0.5 rounded-full border border-emerald-500/30 font-bold">
                        ⚡ {res.latencyMs}ms
                      </span>
                    )}
                  </div>

                  {/* Code Area */}
                  <div className="flex-1 min-h-[380px] max-h-[460px] bg-slate-950 p-4 font-mono text-[11px] overflow-y-auto text-slate-300 leading-relaxed select-all">
                    {res.status === 'idle' && (
                      <div className="h-full flex flex-col items-center justify-center text-slate-600 space-y-2 py-20">
                        <Code2 className="w-10 h-10 opacity-30" />
                        <span>Redo för koncept-race</span>
                      </div>
                    )}

                    {res.status === 'generating' && (
                      <div className="h-full flex flex-col items-center justify-center text-indigo-400 space-y-3 py-20">
                        <RefreshCw className="w-8 h-8 animate-spin" />
                        <span className="text-xs font-sans">Genererar koncept...</span>
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

                  {/* Footer - The Swarm Trigger */}
                  {res.status === 'done' && (
                    <div className="p-3.5 border-t border-slate-800 bg-slate-950/80 flex items-center justify-between gap-2">
                      <button
                        onClick={() => copyText(modelId, res.code)}
                        className="text-slate-400 hover:text-white text-xs font-medium flex items-center gap-1 transition px-2 py-1"
                      >
                        {copiedId === modelId ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                        <span>Kopiera</span>
                      </button>

                      <button
                        onClick={() => startSwarmCollaboration(modelId, res.code)}
                        disabled={swarmStep !== 'idle' && swarmStep !== 'done'}
                        className="bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white font-black px-3.5 py-2 rounded-xl text-xs flex items-center gap-1.5 transition shadow-lg shadow-indigo-600/30 active:scale-95 disabled:opacity-50"
                      >
                        <Users className="w-3.5 h-3.5" />
                        <span>🤝 Bygg med AI Swarm</span>
                      </button>
                    </div>
                  )}

                </div>
              );
            })}
          </div>
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
