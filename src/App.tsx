import React, { useState, useEffect } from 'react';
import { 
  Zap, Trophy, Code2, Key, RefreshCw, Cpu, Check, 
  Copy, Download, Rocket, Bookmark, Swords, Users, 
  Flame, Eye, AlertCircle
} from 'lucide-react';

interface ModelTarget {
  id: string;
  name: string;
  provider: string;
  modelString: string;
  color: string;
  badge: string;
  role: string;
}

interface ModelResult {
  modelId: string;
  code: string;
  status: 'idle' | 'generating' | 'done' | 'error';
  latencyMs?: number;
  errorMsg?: string;
}

const ALL_MODELS: ModelTarget[] = [
  {
    id: 'gemini-flash',
    name: 'Gemini 2.5 Flash',
    provider: 'Google',
    modelString: 'google/gemini-2.5-flash',
    color: 'border-blue-500/40 text-blue-400 bg-blue-500/10',
    badge: 'Standard',
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
    name: 'DeepSeek V3',
    provider: 'DeepSeek',
    modelString: 'deepseek/deepseek-chat',
    color: 'border-cyan-500/40 text-cyan-400 bg-cyan-500/10',
    badge: 'High Speed',
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

const CODE_PRESETS = [
  "Bygg en modern timer- och resultattavla för matchsekretariat med mörk sportdesign i Tailwind CSS.",
  "Skapa en interaktiv krypto- och aktieportfölj med live PnL, donut-diagram och köp/sälj-modal.",
  "Bygg en Kanban board för sprint-planering med Drag and Drop, etiketter och prioriteringar.",
  "Skapa en responsiv musik- och podcastspelare med spellista, vågform och volymkontroll."
];

function cleanCodeForSandbox(raw: string): string {
  let text = raw
    .replace(/^```[a-zA-Z0-9_-]*\n?/gm, '')
    .replace(/\n?```$/gm, '');

  const lines = text.split('\n');
  const resultLines: string[] = [];
  let skippingImport = false;

  for (let line of lines) {
    const trimmed = line.trim();

    if (trimmed.startsWith('import ') || trimmed.startsWith('import{')) {
      if (!trimmed.includes('from') && !trimmed.endsWith(';')) {
        skippingImport = true;
      }
      continue;
    }

    if (skippingImport) {
      if (trimmed.includes('from') || trimmed.endsWith(';') || trimmed.includes("';") || trimmed.includes('";')) {
        skippingImport = false;
      }
      continue;
    }

    if (trimmed.startsWith('export default ')) {
      line = line.replace('export default ', '');
    } else if (trimmed.startsWith('export ')) {
      line = line.replace('export ', '');
    }

    resultLines.push(line);
  }

  return resultLines.join('\n');
}

function generateSandbox(rawCode: string): string {
  const sanitized = cleanCodeForSandbox(rawCode);
  const safeJson = JSON.stringify(sanitized);

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
    var { useState, useEffect, useRef, useMemo, useCallback } = React;

    function makeIcon() {
      return function(props) {
        var size = props && props.size ? props.size : 16;
        var className = props && props.className ? props.className : "inline-block";
        return React.createElement('svg', {
          width: size,
          height: size,
          viewBox: "0 0 24 24",
          fill: "none",
          stroke: "currentColor",
          strokeWidth: "2",
          strokeLinecap: "round",
          strokeLinejoin: "round",
          className: className
        }, React.createElement('circle', { cx: "12", cy: "12", r: "10" }));
      };
    }

    var iconNames = ['Play', 'Pause', 'RotateCcw', 'Square', 'Clock', 'Trophy', 'Zap', 'Volume2', 'VolumeX', 'Shield', 'Activity', 'Award', 'Plus', 'Minus', 'ChevronUp', 'ChevronDown', 'Users', 'Flame', 'Check', 'Copy', 'Trash2', 'RefreshCw', 'Calendar', 'Timer', 'Settings', 'Bell'];
    iconNames.forEach(function(k) { window[k] = makeIcon(k); });
    window.LucideIcons = new Proxy({}, { get: function() { return makeIcon(); } });

    window.onload = function() {
      try {
        var sourceCode = ${safeJson};

        var transpiled = Babel.transform(sourceCode, {
          presets: ['react', 'typescript'],
          filename: 'app.tsx'
        }).code;

        var evalScope = new Function(
          'React', 'ReactDOM', 'useState', 'useEffect', 'useRef', 'useMemo', 'useCallback',
          transpiled + "\\n;\\n" +
          "if (typeof App !== 'undefined') return App;\\n" +
          "if (typeof Scoreboard !== 'undefined') return Scoreboard;\\n" +
          "if (typeof MatchTimer !== 'undefined') return MatchTimer;\\n" +
          "if (typeof TimerAndScoreboard !== 'undefined') return TimerAndScoreboard;\\n" +
          "if (typeof MatchSecretariat !== 'undefined') return MatchSecretariat;\\n" +
          "if (typeof Component !== 'undefined') return Component;\\n" +
          "return null;"
        );

        var TargetComp = evalScope(React, ReactDOM, useState, useEffect, useRef, useMemo, useCallback);

        if (TargetComp && typeof TargetComp === 'function') {
          ReactDOM.createRoot(document.getElementById('root')).render(React.createElement(TargetComp));
        } else {
          document.getElementById('root').innerHTML = '<div style="padding:16px;color:#34d399;font-family:monospace;font-size:12px;">✅ Komponent kompilerad! Byt till "Kod"-läget för att se källkoden.</div>';
        }
      } catch (err) {
        document.getElementById('root').innerHTML = '<div style="padding:12px;background:rgba(239,68,68,0.1);border:1px solid rgba(239,68,68,0.3);border-radius:12px;color:#f87171;font-family:monospace;font-size:11px;">⚠️ Sandbox: ' + err.message + '</div>';
      }
    };
  </script>
</body>
</html>`;
}

export default function App() {
  const [apiKey, setApiKey] = useState('');
  const [showKeyInput, setShowKeyInput] = useState(false);
  const [prompt, setPrompt] = useState(CODE_PRESETS[0]);
  
  const [selectedModelIds, setSelectedModelIds] = useState<string[]>([
    'gemini-flash', 'qwen-coder', 'deepseek-chat', 'llama-3-3', 'mistral-small'
  ]);
  const [results, setResults] = useState<Record<string, ModelResult>>({});
  const [cardViews, setCardViews] = useState<Record<string, 'preview' | 'code'>>({});
  const [masterView, setMasterView] = useState<'preview' | 'code'>('preview');

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
    showToast('⚡ Alla modeller valda!');
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

  // Parallell Körning med isolerade try/catch per modell
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
Output ONLY executable React TypeScript JSX without markdown backticks. Ensure the code is fully closed and complete.`;

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
            max_tokens: 3500,
            messages: [
              { role: 'system', content: systemPrompt },
              { role: 'user', content: prompt }
            ]
          })
        });

        const data = await res.json();
        const endTime = performance.now();
        const latency = Math.round(endTime - startTime);

        if (!res.ok) {
          throw new Error(data.error?.message || \`HTTP \${res.status}\`);
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
          throw new Error('Ogiltigt svar från OpenRouter');
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

  const startSwarmCollaboration = async (baseModelId: string, baseCode: string) => {
    setSwarmStep('analyzing');
    setSwarmProgressText('🧠 Steg 1/2: Qwen Coder optimerar arkitektur och logik...');

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
          max_tokens: 3500,
          messages: [{ role: 'user', content: logicPrompt }]
        })
      });
      const logicData = await logicRes.json();
      const upgradedLogicCode = logicData.choices?.[0]?.message?.content || baseCode;

      setSwarmStep('polishing');
      setSwarmProgressText('✨ Steg 2/2: Gemini Flash förädlar Tailwind UI och sammanställer slutkoden...');

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
          max_tokens: 3500,
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
      setMasterView('preview');
      showToast('🏆 Master Synthesizer har sammanställt den ultimata komponenten!');

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
                <Users className="w-3 h-3" /> Multi-Agent Swarm
              </span>
            </h1>
            <p className="text-[11px] text-slate-400 hidden sm:block">Parallell tävling $\rightarrow$ Live Sandbox & Kollektiv AI-syntes</p>
          </div>
        </div>

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
              <span className="text-xs font-bold text-slate-300">Fas 1: Välj koncept-arkitekter ({selectedModelIds.length} aktiva):</span>
              <button
                onClick={selectAll}
                className="text-[11px] font-bold text-cyan-400 bg-cyan-500/10 border border-cyan-500/30 px-2.5 py-0.5 rounded-lg hover:bg-cyan-500/20 transition"
              >
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
                  <span className="text-[9px] uppercase font-mono px-1.5 py-0.5 rounded bg-black/40">
                    {m.role}
                  </span>
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
                  <p className="text-[11px] text-slate-400">Logik + UI + TypeScript sammanslaget till ett mästerverk</p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <div className="flex bg-slate-900 border border-slate-700 rounded-xl p-1">
                  <button
                    onClick={() => setMasterView('preview')}
                    className={`px-3 py-1 rounded-lg text-xs font-bold transition flex items-center gap-1.5 ${
                      masterView === 'preview' ? 'bg-emerald-500 text-slate-950 shadow' : 'text-slate-400 hover:text-white'
                    }`}
                  >
                    <Eye className="w-3.5 h-3.5" />
                    <span>Live Preview</span>
                  </button>
                  <button
                    onClick={() => setMasterView('code')}
                    className={`px-3 py-1 rounded-lg text-xs font-bold transition flex items-center gap-1.5 ${
                      masterView === 'code' ? 'bg-indigo-600 text-white shadow' : 'text-slate-400 hover:text-white'
                    }`}
                  >
                    <Code2 className="w-3.5 h-3.5" />
                    <span>Kod</span>
                  </button>
                </div>

                <button
                  onClick={() => downloadFile('MasterSwarmComponent', finalMasterCode)}
                  className="bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold px-3.5 py-2 rounded-xl border border-slate-700 transition flex items-center gap-1.5"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>Ladda ner</span>
                </button>
                <button
                  onClick={() => copyText('master', finalMasterCode)}
                  className="bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black text-xs px-4 py-2 rounded-xl transition flex items-center gap-1.5 shadow-lg shadow-emerald-500/20"
                >
                  {copiedId === 'master' ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>Kopiera</span>
                </button>
              </div>
            </div>

            <div className="min-h-[420px] max-h-[550px] bg-slate-950 flex flex-col">
              {masterView === 'preview' ? (
                <iframe
                  title="Master Live Preview"
                  srcDoc={generateSandbox(finalMasterCode)}
                  className="w-full flex-1 min-h-[450px] border-none rounded-b-3xl bg-slate-900"
                  sandbox="allow-scripts allow-same-origin"
                />
              ) : (
                <div className="p-5 font-mono text-xs text-slate-200 max-h-[550px] overflow-y-auto leading-relaxed select-all">
                  <pre className="whitespace-pre-wrap">{finalMasterCode}</pre>
                </div>
              )}
            </div>
          </div>
        )}

        <div className="space-y-3">
          <h2 className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center gap-2">
            <Swords className="w-4 h-4 text-indigo-400" />
            <span>Fas 2: Granska & Välj Vinnande Grunddesign att Bygga Vidare På</span>
          </h2>

          <div className={`grid grid-cols-1 ${selectedModelIds.length === 2 ? 'md:grid-cols-2' : selectedModelIds.length >= 3 ? 'md:grid-cols-3' : ''} gap-5`}>
            {selectedModelIds.map(modelId => {
              const modelCfg = ALL_MODELS.find(m => m.id === modelId)!;
              const res = results[modelId] || { status: 'idle', code: '' };
              const currentView = cardViews[modelId] || 'preview';

              return (
                <div key={modelId} className="bg-slate-900/90 border border-slate-800 rounded-3xl overflow-hidden flex flex-col shadow-2xl">
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

                    <div className="flex items-center gap-2">
                      {res.status === 'done' && (
                        <div className="flex bg-slate-950 border border-slate-800 rounded-xl p-0.5">
                          <button
                            onClick={() => setCardViews(prev => ({ ...prev, [modelId]: 'preview' }))}
                            className={`p-1 px-2 rounded-lg text-[10px] font-bold transition flex items-center gap-1 ${
                              currentView === 'preview' ? 'bg-indigo-600 text-white' : 'text-slate-400 hover:text-white'
                            }`}
                          >
                            <Eye className="w-3.5 h-3.5" /> Preview
                          </button>
                          <button
                            onClick={() => setCardViews(prev => ({ ...prev, [modelId]: 'code' }))}
                            className={`p-1 px-2 rounded-lg text-[10px] font-bold transition flex items-center gap-1 ${
                              currentView === 'code' ? 'bg-indigo-600 text-white' : 'text-slate-400 hover:text-white'
                            }`}
                          >
                            <Code2 className="w-3.5 h-3.5" /> Kod
                          </button>
                        </div>
                      )}

                      {res.status === 'generating' && (
                        <span className="text-indigo-400 font-mono text-[11px] animate-pulse flex items-center gap-1">
                          <RefreshCw className="w-3.5 h-3.5 animate-spin" /> Skapar...
                        </span>
                      )}
                      {res.status === 'done' && (
                        <span className="text-emerald-400 font-mono text-[10px] bg-emerald-500/10 px-2 py-0.5 rounded-full border border-emerald-500/30 font-bold">
                          ⚡ {res.latencyMs}ms
                        </span>
                      )}
                    </div>
                  </div>

                  <div className="flex-1 min-h-[380px] max-h-[460px] bg-slate-950 flex flex-col">
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
                      <div className="p-4 text-red-400 text-xs bg-red-500/10 border border-red-500/30 rounded-2xl m-4 flex items-start gap-2">
                        <AlertCircle className="w-4 h-4 flex-shrink-0 mt-0.5" />
                        <span>{res.errorMsg || 'Genereringen misslyckades'}</span>
                      </div>
                    )}

                    {res.status === 'done' && (
                      currentView === 'preview' ? (
                        <iframe
                          title={`${modelCfg.name} Preview`}
                          srcDoc={generateSandbox(res.code)}
                          className="w-full flex-1 min-h-[380px] border-none bg-slate-950"
                          sandbox="allow-scripts allow-same-origin"
                        />
                      ) : (
                        <div className="p-4 font-mono text-[11px] overflow-y-auto text-slate-300 leading-relaxed select-all">
                          <pre className="whitespace-pre-wrap">{res.code}</pre>
                        </div>
                      )
                    )}
                  </div>

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

      {toast && (
        <div className="fixed bottom-6 right-6 bg-emerald-500 text-slate-950 px-4 py-2.5 rounded-2xl font-bold text-xs shadow-2xl flex items-center gap-2 z-50 animate-bounce">
          <Check className="w-4 h-4" />
          <span>{toast}</span>
        </div>
      )}
    </div>
  );
}
