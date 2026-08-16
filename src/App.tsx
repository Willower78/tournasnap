import React, { useState, useEffect } from 'react';
import { ALL_MODELS, CODE_PRESETS, ModelResult } from './types';
import { ModelCard } from './components/ModelCard';
import { SwarmResult } from './components/SwarmResult';
import { 
  Zap, Key, Cpu, Rocket, Bookmark, Swords, Users, Flame, RefreshCw, Check 
} from 'lucide-react';

export default function App() {
  const [apiKey, setApiKey] = useState('');
  const [showKeyInput, setShowKeyInput] = useState(false);
  const [prompt, setPrompt] = useState(CODE_PRESETS[0]);
  
  const [selectedModelIds, setSelectedModelIds] = useState<string[]>([
    'gemini-flash', 'qwen-coder', 'deepseek-chat', 'llama-3-3', 'mistral-small'
  ]);
  const [results, setResults] = useState<Record<string, ModelResult>>({});
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [swarmStep, setSwarmStep] = useState<'idle' | 'analyzing' | 'polishing' | 'synthesizing' | 'done'>('idle');
  const [swarmProgressText, setSwarmProgressText] = useState('');
  const [finalMasterCode, setFinalMasterCode] = useState('');
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

  const selectAll = () => {
    setSelectedModelIds(ALL_MODELS.map(m => m.id));
    showToast('⚡ Alla modeller valda!');
  };

  const copyText = (id: string, text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    showToast('📋 Kopierad till urklipp!');
    setTimeout(() => setCopiedId(null), 2000);
  };

  // Fas 1: Parallell Körning
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

    const systemPrompt = `You are an elite React engineer. Write a complete, self-contained functional component using Tailwind CSS based on the user prompt. 
Export the component as 'export default function App()'.
Output ONLY valid React TypeScript code directly without markdown description.`;

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
            'X-Title': 'VibeCoder Swarm Studio'
          },
          body: JSON.stringify({
            model: modelCfg.modelString,
            max_tokens: 4500,
            messages: [
              { role: 'system', content: systemPrompt },
              { role: 'user', content: prompt }
            ]
          })
        });

        const data = await res.json();
        const endTime = performance.now();
        const latency = Math.round(endTime - startTime);

        if (res.status === 402) {
          throw new Error('Kräver OpenRouter credits (402 Payment Required).');
        }
        if (res.status === 404) {
          throw new Error(`Modellen ${modelCfg.modelString} hittades inte (404).`);
        }

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

  // Fas 2 & 3: Swarm Synthesis
  const startSwarmCollaboration = async (baseModelId: string, baseCode: string) => {
    setSwarmStep('analyzing');
    setSwarmProgressText('🧠 Steg 1/2: Qwen Coder optimerar TypeScript-arkitektur och state-logik...');

    try {
      const logicPrompt = `Here is a React component base:\n\`\`\`tsx\n${baseCode}\n\`\`\`\nEnhance its state management, interactive features and types while keeping the overall design. Return the upgraded code with 'export default function App()'.`;
      
      const logicRes = await fetch('[https://openrouter.ai/api/v1/chat/completions](https://openrouter.ai/api/v1/chat/completions)', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${apiKey.trim()}`,
          'HTTP-Referer': window.location.origin
        },
        body: JSON.stringify({
          model: 'qwen/qwen-2.5-coder-32b-instruct',
          max_tokens: 4500,
          messages: [{ role: 'user', content: logicPrompt }]
        })
      });
      const logicData = await logicRes.json();
      const upgradedLogicCode = logicData.choices?.[0]?.message?.content || baseCode;

      setSwarmStep('polishing');
      setSwarmProgressText('✨ Steg 2/2: Gemini Flash förädlar Tailwind UI, micro-animationer & sammanställer slutkoden...');

      const uiPrompt = `Here is the logic-enhanced code:\n\`\`\`tsx\n${upgradedLogicCode}\n\`\`\`\nPolishing phase: Enhance the Tailwind CSS styling, sleek dark-mode, micro-interactions, and perfect TypeScript interfaces. Return ONLY clean code with 'export default function App()'.`;

      const uiRes = await fetch('[https://openrouter.ai/api/v1/chat/completions](https://openrouter.ai/api/v1/chat/completions)', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${apiKey.trim()}`,
          'HTTP-Referer': window.location.origin
        },
        body: JSON.stringify({
          model: 'google/gemini-2.5-flash',
          max_tokens: 4500,
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
      
      {/* Header */}
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
            <p className="text-[11px] text-slate-400 hidden sm:block">Parallell tävling $\rightarrow$ ESM Native Sandbox & Kollektiv AI-syntes</p>
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

      {/* Main Content */}
      <main className="flex-1 max-w-7xl w-full mx-auto p-4 sm:p-8 space-y-6">
        
        {/* API Key Modal */}
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

        {/* Prompt Deck */}
        <div className="bg-slate-900/90 border border-slate-800/80 rounded-3xl p-6 shadow-2xl space-y-5 backdrop-blur-xl">
          <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-800 pb-4">
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-slate-300">Fas 1: Välj koncept-arkitekter ({selectedModelIds.length} aktiva):</span>
              <button
                onClick={selectAll}
                className="text-[11px] font-bold text-cyan-400 bg-cyan-500/10 border border-cyan-500/30 px-2.5 py-0.5 rounded-lg hover:bg-cyan-500/20 transition"
              >
                ⚡ Välj alla modeller
              </button>
            </div>
          </div>

          {/* Model Selection Chips */}
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

          {/* Prompt Input */}
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

        {/* SWARM PROGRESS */}
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

        {/* MASTERPIECE COMPONENT */}
        {finalMasterCode && (
          <SwarmResult
            finalMasterCode={finalMasterCode}
            onCopy={copyText}
            copiedId={copiedId}
          />
        )}

        {/* Phase 1 Comparison Grid with Sub-Components */}
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
                <ModelCard
                  key={modelId}
                  modelCfg={modelCfg}
                  result={res}
                  onSwarm={startSwarmCollaboration}
                  onCopy={copyText}
                  copiedId={copiedId}
                  swarmDisabled={swarmStep !== 'idle' && swarmStep !== 'done'}
                />
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
