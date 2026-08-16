import React, { useState, useEffect } from 'react';
import { 
  Zap, Trophy, Code2, Key, RefreshCw, Cpu, Check, 
  Copy, Download, Rocket, Bookmark, Swords, Users, 
  Flame, Eye, AlertCircle, Wrench, ShieldCheck
} from 'lucide-react';

interface ModelTarget {
  id: string;
  name: string;
  provider: string;
  modelString: string;
  color: string;
  badge: string;
  role: string;
  fallbackModel?: string;
}

interface ModelResult {
  modelId: string;
  code: string;
  status: 'idle' | 'generating' | 'validating' | 'repairing' | 'done' | 'error';
  latencyMs?: number;
  errorMsg?: string;
  repairAttempts?: number;
}

const ALL_MODELS: ModelTarget[] = [
  {
    id: 'nemotron-ultra',
    name: 'Nemotron 3 Ultra 550B',
    provider: 'NVIDIA',
    modelString: 'nvidia/nemotron-3-ultra-550b-a55b:free',
    fallbackModel: 'openai/gpt-oss-120b:free',
    color: 'border-blue-500/40 text-blue-400 bg-blue-500/10',
    badge: '1M Context',
    role: 'Master Synthesizer'
  },
  {
    id: 'gpt-oss',
    name: 'OpenAI GPT-OSS 120B',
    provider: 'OpenAI',
    modelString: 'openai/gpt-oss-120b:free',
    fallbackModel: 'nvidia/nemotron-3-nano-30b-a3b:free',
    color: 'border-purple-500/40 text-purple-400 bg-purple-500/10',
    badge: 'Top Coding',
    role: 'TypeScript & Arkitektur'
  },
  {
    id: 'gemma-it',
    name: 'Google Gemma 4 31B',
    provider: 'Google',
    modelString: 'google/gemma-4-31b-it:free',
    fallbackModel: 'openai/gpt-oss-120b:free',
    color: 'border-cyan-500/40 text-cyan-400 bg-cyan-500/10',
    badge: 'Multilingual',
    role: 'Logik & Edge Cases'
  },
  {
    id: 'llama-free',
    name: 'Llama 3.3 70B Instruct',
    provider: 'Meta',
    modelString: 'meta-llama/llama-3.3-70b-instruct:free',
    fallbackModel: 'nvidia/nemotron-3-nano-30b-a3b:free',
    color: 'border-emerald-500/40 text-emerald-400 bg-emerald-500/10',
    badge: 'Ultra Fast',
    role: 'UI & Interaktioner'
  },
  {
    id: 'nemotron-nano',
    name: 'Nemotron 3 Nano 30B',
    provider: 'NVIDIA',
    modelString: 'nvidia/nemotron-3-nano-30b-a3b:free',
    fallbackModel: 'openai/gpt-oss-120b:free',
    color: 'border-amber-500/40 text-amber-400 bg-amber-500/10',
    badge: 'High Efficiency',
    role: 'Validering & Stabilitet'
  }
];

const CODE_PRESETS = [
  "Bygg en modern timer- och resultattavla för matchsekretariat med mörk sportdesign i Tailwind CSS.",
  "Skapa en interaktiv krypto- och aktieportfölj med live PnL, donut-diagram och köp/sälj-modal.",
  "Bygg en Kanban board för sprint-planering med Drag and Drop, etiketter och prioriteringar.",
  "Skapa en responsiv musik- och podcastspelare med spellista, vågform och volymkontroll."
];

// Syntax Validator via Babel (Kollar om koden har syntaxfel innan den körs)
function validateCodeSyntax(code: string): { isValid: boolean; error?: string } {
  try {
    // Kika efter vanliga avhuggna strängar eller taggar
    const clean = code
      .replace(/^```[a-zA-Z0-9_-]*\n?/gm, '')
      .replace(/\n?```$/gm, '');

    // Testkompilera via Babel parser
    (window as any).Babel.transform(clean, {
      presets: ['react', 'typescript'],
      filename: 'validate.tsx'
    });
    return { isValid: true };
  } catch (err: any) {
    return { isValid: false, error: err.message };
  }
}

function generateSandbox(rawCode: string): string {
  let code = rawCode
    .replace(/^```[a-zA-Z0-9_-]*\n?/gm, '')
    .replace(/\n?```$/gm, '');

  code = code.replace(/import\s+[\s\S]*?from\s+['"][^'"]+['"];?/gm, '');
  code = code.replace(/import\s+['"][^'"]+['"];?/gm, '');
  code = code.replace(/export\s+default\s+/g, '');
  code = code.replace(/export\s+(const|let|var|function|class|type|interface)\s+/g, '$1 ');

  const safeJson = JSON.stringify(code);

  return `<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <script src="https://cdn.tailwindcss.com"></script>
  <script src="https://unpkg.com/react@18/umd/react.production.min.js"></script>
  <script src="https://unpkg.com/react-dom@18/umd/react-dom.production.min.js"></script>
  <script src="https://unpkg.com/@babel/standalone/babel.min.js"></script>
  <style>
    body { background-color: #0b0f19; color: #f8fafc; font-family: ui-sans-serif, system-ui, sans-serif; margin: 0; padding: 14px; }
  </style>
</head>
<body>
  <div id="root"></div>
  <script>
    window.addEventListener('DOMContentLoaded', () => {
      try {
        const { useState, useEffect, useRef, useMemo, useCallback } = React;
        const IconMock = (props) => React.createElement('span', { className: 'inline-block mx-1' }, '⚡');
        const LucideIcons = new Proxy({}, { get: () => IconMock });
        Object.assign(window, {
          Play: IconMock, Pause: IconMock, RotateCcw: IconMock, Square: IconMock, Clock: IconMock,
          Trophy: IconMock, Zap: IconMock, Volume2: IconMock, VolumeX: IconMock, Shield: IconMock,
          Activity: IconMock, Award: IconMock, Plus: IconMock, Minus: IconMock, Users: IconMock,
          Flame: IconMock, Check: IconMock, Copy: IconMock, Trash2: IconMock, RefreshCw: IconMock,
          Calendar: IconMock, Timer: IconMock, Settings: IconMock, Bell: IconMock, LucideIcons
        });

        const rawSource = ${safeJson};
        const transpiled = Babel.transform(rawSource, {
          presets: ['react', 'typescript'],
          filename: 'app.tsx'
        }).code;

        const runCode = new Function('React', 'ReactDOM', 'useState', 'useEffect', 'useRef', 'useMemo', 'useCallback',
          transpiled + \`
          const root = ReactDOM.createRoot(document.getElementById('root'));
          if (typeof App !== 'undefined') root.render(<App />);
          else if (typeof Scoreboard !== 'undefined') root.render(<Scoreboard />);
          else if (typeof MatchTimer !== 'undefined') root.render(<MatchTimer />);
          else if (typeof Component !== 'undefined') root.render(<Component />);
          else root.render(<div className="p-4 text-emerald-400 font-mono text-xs">✅ Komponent laddad! Se 'Kod' för källkod.</div>);
        \`);

        runCode(React, ReactDOM, useState, useEffect, useRef, useMemo, useCallback);
      } catch (err) {
        document.getElementById('root').innerHTML = '<div style="padding:12px;background:rgba(239,68,68,0.1);border:1px solid rgba(239,68,68,0.3);border-radius:8px;color:#f87171;font-family:monospace;font-size:11px;">⚠️ Sandbox Error: ' + err.message + '</div>';
      }
    });
  </script>
</body>
</html>`;
}

export default function App() {
  const [apiKey, setApiKey] = useState('');
  const [showKeyInput, setShowKeyInput] = useState(false);
  const [prompt, setPrompt] = useState(CODE_PRESETS[0]);
  
  const [selectedModelIds, setSelectedModelIds] = useState<string[]>([
    'nemotron-ultra', 'gpt-oss', 'gemma-it', 'llama-free', 'nemotron-nano'
  ]);
  const [results, setResults] = useState<Record<string, ModelResult>>({});
  const [cardViews, setCardViews] = useState<Record<string, 'preview' | 'code'>>({});
  const [masterView, setMasterView] = useState<'preview' | 'code'>('preview');

  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [swarmStep, setSwarmStep] = useState<'idle' | 'analyzing' | 'polishing' | 'synthesizing' | 'done'>('idle');
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
    const initialViews: Record<string, 'preview' | 'code'> = {};
    ALL_MODELS.forEach(m => {
      initialResults[m.id] = { modelId: m.id, code: '', status: 'idle' };
      initialViews[m.id] = 'preview';
    });
    setResults(initialResults);
    setCardViews(initialViews);
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

  // AI Repair Agent (3-strikes policy)
  const repairCodeWithAI = async (modelSlug: string, brokenCode: string, errorMessage: string, attempt: number): Promise<string> => {
    const repairPrompt = `You are an expert React Code Repair Agent. 
The following TSX code has a syntax error. Fix ONLY the syntax error and ensure all strings, brackets, and JSX tags are closed properly. Return ONLY valid corrected React TypeScript code.

ERROR:
${errorMessage}

BROKEN CODE:
\`\`\`tsx
${brokenCode}
\`\`\`
`;

    const res = await fetch('https://openrouter.ai/api/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey.trim()}`,
        'HTTP-Referer': window.location.origin,
        'X-Title': 'VibeCoder Swarm Studio'
      },
      body: JSON.stringify({
        model: modelSlug,
        max_tokens: 2500,
        messages: [{ role: 'user', content: repairPrompt }]
      })
    });

    const data = await res.json();
    if (res.ok && data.choices?.[0]?.message?.content) {
      let fixed = data.choices[0].message.content.trim();
      if (fixed.startsWith('```')) fixed = fixed.replace(/^```[a-z]*\n/, '').replace(/\n```$/, '');
      return fixed;
    }
    throw new Error('Repair failed');
  };

  const callModelWithPipeline = async (modelCfg: ModelTarget, systemPrompt: string, userPrompt: string, onStatusChange: (status: ModelResult['status']) => void) => {
    const modelsToTry = [modelCfg.modelString, modelCfg.fallbackModel].filter(Boolean) as string[];

    for (const modelSlug of modelsToTry) {
      try {
        onStatusChange('generating');
        const res = await fetch('[https://openrouter.ai/api/v1/chat/completions](https://openrouter.ai/api/v1/chat/completions)', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${apiKey.trim()}`,
            'HTTP-Referer': window.location.origin,
            'X-Title': 'VibeCoder Swarm Studio'
          },
          body: JSON.stringify({
            model: modelSlug,
            max_tokens: 2500,
            messages: [
              { role: 'system', content: systemPrompt },
              { role: 'user', content: userPrompt }
            ]
          })
        });

        const data = await res.json();
        if (!res.ok || !data.choices?.[0]?.message?.content) continue;

        let code = data.choices[0].message.content.trim();
        if (code.startsWith('```')) code = code.replace(/^```[a-z]*\n/, '').replace(/\n```$/, '');

        // --- VALIDATION & REPAIR PIPELINE ---
        onStatusChange('validating');
        let validation = validateCodeSyntax(code);
        let attempts = 0;

        while (!validation.isValid && attempts < 3) {
          onStatusChange('repairing');
          try {
            code = await repairCodeWithAI(modelSlug, code, validation.error || 'Syntax error', attempts + 1);
            validation = validateCodeSyntax(code);
          } catch (e) {
            break;
          }
          attempts++;
        }

        if (!validation.isValid) {
          throw new Error(`Build blocked after 3 automatic repair attempts: ${validation.error}`);
        }

        return code;
      } catch (e) {
        // Testa nästa modell
      }
    }
    throw new Error('Alla fria agenter misslyckades med att generera giltig kod.');
  };

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

    const systemPrompt = `You are an elite React engineer.
Write a single, complete functional component named 'App' using Tailwind CSS based on the user request.
Export it with 'export default function App()'.
Output ONLY executable React TypeScript JSX without markdown backticks, without import statements. Ensure all strings and brackets are fully closed.`;

    const promises = selectedModelIds.map(async (modelId) => {
      const modelCfg = ALL_MODELS.find(m => m.id === modelId);
      if (!modelCfg) return;

      const startTime = performance.now();

      try {
        const cleanCode = await callModelWithPipeline(modelCfg, systemPrompt, prompt, (status) => {
          setResults(prev => ({
            ...prev,
            [modelId]: { ...prev[modelId], status }
          }));
        });
        const endTime = performance.now();
        const latency = Math.round(endTime - startTime);

        setResults(prev => ({
          ...prev,
          [modelId]: { modelId, code: cleanCode, status: 'done', latencyMs: latency }
        }));
      } catch (err: any) {
        setResults(prev => ({
          ...prev,
          [modelId]: { modelId, code: '', status: 'error', errorMsg: err.message }
        }));
      }
    });

    await Promise.allSettled(promises);
  };

  const startSwarmCollaboration = async (baseModelId: string, baseCode: string) => {
    setSwarmStep('analyzing');

    try {
      const gptCfg = ALL_MODELS.find(m => m.id === 'gpt-oss')!;
      let code = await callModelWithPipeline(gptCfg, 'You are an expert React architect. No imports.', 'Enhance this component: \n' + baseCode, () => {});
      
      setSwarmStep('done');
      setFinalMasterCode(code);
      setMasterView('preview');
      showToast('🏆 Master-komponenten har skapats!');
    } catch (err: any) {
      setSwarmStep('idle');
      showToast('⚠️ Swarm-fel: ' + err.message);
    }
  };

  return (
    <div className="min-h-screen bg-[#080B10] text-slate-100 font-sans flex flex-col selection:bg-indigo-500/30">
      <header className="h-16 border-b border-slate-800/80 bg-slate-950/90 px-4 sm:px-8 flex items-center justify-between backdrop-blur-xl sticky top-0 z-40">
        <div className="flex items-center gap-3">
          <div className="bg-gradient-to-br from-indigo-500 via-purple-600 to-pink-500 p-2.5 rounded-2xl text-white shadow-lg shadow-indigo-500/20">
            <Rocket className="w-5 h-5" />
          </div>
          <div>
            <h1 className="text-base font-black tracking-tight text-white flex items-center gap-2">
              <span>VibeCoder Swarm Studio</span>
              <span className="text-[10px] uppercase font-mono px-2 py-0.5 border border-indigo-500/30 bg-indigo-500/10 text-indigo-300 rounded-full font-bold flex items-center gap-1">
                <ShieldCheck className="w-3 h-3 text-emerald-400" /> Pipeline Protected
              </span>
            </h1>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => setShowKeyInput(!showKeyInput)}
            className={`text-xs px-3.5 py-1.5 rounded-xl font-bold flex items-center gap-1.5 transition border ${
              apiKey ? 'bg-slate-900 text-emerald-400 border-emerald-500/30' : 'bg-amber-500/10 border-amber-500/30 text-amber-400 animate-pulse'
            }`}
          >
            <Key className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">{apiKey ? 'OpenRouter Ansluten' : 'Ange Nyckel'}</span>
          </button>
        </div>
      </header>

      <main className="flex-1 max-w-7xl w-full mx-auto p-4 sm:p-8 space-y-6">
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

        <div className="bg-slate-900/90 border border-slate-800/80 rounded-3xl p-6 shadow-2xl space-y-5 backdrop-blur-xl">
          <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-800 pb-4">
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-slate-300">Fas 1: Välj fria koncept-arkitekter ({selectedModelIds.length} aktiva):</span>
              <button onClick={selectAll} className="text-[11px] font-bold text-cyan-400 bg-cyan-500/10 border border-cyan-500/30 px-2.5 py-0.5 rounded-lg hover:bg-cyan-500/20 transition">
                ⚡ Välj alla modeller
              </button>
            </div>
          </div>

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
                </button>
              );
            })}
          </div>

          <div className="space-y-3">
            <textarea
              rows={3}
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              placeholder="Beskriv vad du vill att AI-teamet ska bygga..."
              className="w-full bg-slate-950 border border-slate-800 rounded-2xl p-4 text-xs sm:text-sm text-white placeholder-slate-600 focus:outline-none focus:border-indigo-500 resize-none font-sans leading-relaxed"
            />
          </div>

          <div className="flex justify-end pt-2">
            <button
              onClick={executeParallelGeneration}
              disabled={!prompt.trim()}
              className="w-full sm:w-auto bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 disabled:opacity-40 text-white font-black px-8 py-4 rounded-2xl text-xs sm:text-sm flex items-center justify-center gap-2.5 transition shadow-2xl shadow-indigo-600/30 active:scale-95"
            >
              <Zap className="w-4 h-4 fill-white" />
              <span>Generera Grundkoncept med Pipeline ({selectedModelIds.length} Modeller)</span>
            </button>
          </div>
        </div>

        {finalMasterCode && (
          <div className="bg-gradient-to-b from-indigo-950/80 to-slate-900 border-2 border-emerald-500/60 rounded-3xl overflow-hidden shadow-2xl space-y-0">
            <div className="p-5 border-b border-slate-800 flex items-center justify-between bg-slate-950/80">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-emerald-500/20 text-emerald-400 rounded-xl border border-emerald-500/40">
                  <Trophy className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-sm font-black text-white">Slutgiltigt Mästerverk</h3>
                </div>
              </div>
            </div>
            <div className="min-h-[420px] bg-slate-950 flex flex-col">
              <iframe
                title="Master Live Preview"
                srcDoc={generateSandbox(finalMasterCode)}
                className="w-full flex-1 min-h-[450px] border-none rounded-b-3xl bg-slate-900"
                sandbox="allow-scripts allow-same-origin"
              />
            </div>
          </div>
        )}

        <div className="space-y-3">
          <h2 className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center gap-2">
            <Swords className="w-4 h-4 text-indigo-400" />
            <span>Fas 2: Granska & Välj Vinnande Grunddesign</span>
          </h2>

          <div className={`grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5`}>
            {selectedModelIds.map(modelId => {
              const modelCfg = ALL_MODELS.find(m => m.id === modelId);
              if (!modelCfg) return null;
              const res = results[modelId] || { status: 'idle', code: '' };
              const currentView = cardViews[modelId] || 'preview';

              return (
                <div key={modelId} className="bg-slate-900/90 border border-slate-800 rounded-3xl overflow-hidden flex flex-col shadow-2xl">
                  <div className="p-4 border-b border-slate-800 flex items-center justify-between bg-slate-950/70">
                    <span className="text-xs font-black text-white">{modelCfg.name}</span>
                    {res.status === 'done' && (
                      <div className="flex bg-slate-950 border border-slate-800 rounded-xl p-0.5">
                        <button onClick={() => setCardViews(prev => ({ ...prev, [modelId]: 'preview' }))} className={`p-1 px-2 rounded-lg text-[10px] font-bold ${currentView === 'preview' ? 'bg-indigo-600 text-white' : 'text-slate-400'}`}>Preview</button>
                        <button onClick={() => setCardViews(prev => ({ ...prev, [modelId]: 'code' }))} className={`p-1 px-2 rounded-lg text-[10px] font-bold ${currentView === 'code' ? 'bg-indigo-600 text-white' : 'text-slate-400'}`}>Kod</button>
                      </div>
                    )}
                  </div>

                  <div className="flex-1 min-h-[380px] bg-slate-950 flex flex-col">
                    {res.status === 'idle' && <div className="h-full flex items-center justify-center text-slate-600 text-xs py-20">Redo för koncept-race</div>}
                    {res.status === 'generating' && <div className="h-full flex flex-col items-center justify-center text-indigo-400 text-xs py-20 space-y-2 animate-pulse"><RefreshCw className="w-5 h-5 animate-spin" /><span>Genererar kod...</span></div>}
                    {res.status === 'validating' && <div className="h-full flex flex-col items-center justify-center text-amber-400 text-xs py-20 space-y-2 animate-pulse"><Zap className="w-5 h-5" /><span>⚙ Validerar syntax via AST...</span></div>}
                    {res.status === 'repairing' && <div className="h-full flex flex-col items-center justify-center text-cyan-400 text-xs py-20 space-y-2 animate-pulse"><Wrench className="w-5 h-5 animate-spin" /><span>🔧 AI Repair Agent lagar kod...</span></div>}
                    {res.status === 'error' && <div className="p-4 text-red-400 text-xs flex items-start gap-2"><AlertCircle className="w-4 h-4 mt-0.5 flex-shrink-0" /><span>{res.errorMsg}</span></div>}
                    {res.status === 'done' && (
                      currentView === 'preview' ? (
                        <iframe title="Preview" srcDoc={generateSandbox(res.code)} className="w-full flex-1 min-h-[380px] border-none bg-slate-950" sandbox="allow-scripts allow-same-origin" />
                      ) : (
                        <div className="p-4 font-mono text-[11px] overflow-y-auto text-slate-300 select-all"><pre>{res.code}</pre></div>
                      )
                    )}
                  </div>

                  {res.status === 'done' && (
                    <div className="p-3.5 border-t border-slate-800 bg-slate-950/80 flex justify-between">
                      <button onClick={() => copyText(modelId, res.code)} className="text-slate-400 text-xs flex items-center gap-1"><Copy className="w-3.5 h-3.5" /> Kopiera</button>
                      <button onClick={() => startSwarmCollaboration(modelId, res.code)} className="bg-indigo-600 text-white font-bold px-3 py-1.5 rounded-xl text-xs">🤝 Bygg med AI Swarm</button>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </main>

      {toast && (
        <div className="fixed bottom-6 right-6 bg-emerald-500 text-slate-950 px-4 py-2.5 rounded-2xl font-bold text-xs shadow-2xl flex items-center gap-2 z-50">
          <Check className="w-4 h-4" /> <span>{toast}</span>
        </div>
      )}
    </div>
  );
}
