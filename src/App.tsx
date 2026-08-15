import React, { useState, useEffect } from 'react';
import { 
  Zap, Trophy, Code2, Key, RefreshCw, Cpu, Check, 
  Copy, Download, Sparkles, Rocket, Bookmark, 
  Image as ImageIcon, Video, Swords, ExternalLink, Sliders
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
    id: 'gemini-3-series',
    name: 'Gemini 3.1 Flash / Pro',
    provider: 'Google',
    modelString: 'google/gemini-flash-latest',
    color: 'border-blue-500/40 text-blue-400 bg-blue-500/10',
    badge: 'Gemini 3 Series',
    isFree: false
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
    id: 'phi-4-free',
    name: 'Phi-4 Reasoning',
    provider: 'Microsoft',
    modelString: 'microsoft/phi-4:free',
    color: 'border-pink-500/40 text-pink-400 bg-pink-500/10',
    badge: '100% FREE • Math & Logic',
    isFree: true
  }
];

const CODE_PRESETS = [
  "Bygg en modern timer- och resultattavla för matchsekretariat med mörk sportdesign i Tailwind CSS.",
  "Skapa en interaktiv krypto- och aktieportfölj med live PnL, donut-diagram och köp/sälj-modal.",
  "Bygg en Kanban board för sprint-planering med Drag and Drop, etiketter och prioriteringar.",
  "Skapa en responsiv musik- och podcastspelare med spellista, vågform och volymkontroll."
];

const IMAGE_PRESETS = [
  "Futuristic holographic dashboard interface, cyberpunk neon glow, dark UI design, ultra realistic 8k, Octane render",
  "Minimalist abstract 3D glassmorphism mobile app icon for a developer studio, soft studio lighting, clean background",
  "Sleek sports car telemetry HUD with velocity curves, carbon fiber texture, orange and deep slate accents"
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
  
  // Code Arena State
  const [selectedModelIds, setSelectedModelIds] = useState<string[]>([
    'deepseek-r1-free', 'qwen-coder-free', 'llama-free'
  ]);
  const [results, setResults] = useState<Record<string, ModelResult>>({});
  const [copiedId, setCopiedId] = useState<string | null>(null);

  // Image Studio State (Flux.1 / Pollinations)
  const [imgPrompt, setImgPrompt] = useState(IMAGE_PRESETS[0]);
  const [imgAspect, setImgAspect] = useState<'1:1' | '16:9' | '9:16'>('16:9');
  const [generatedImgUrl, setGeneratedImgUrl] = useState('');
  const [isGeneratingImg, setIsGeneratingImg] = useState(false);

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
    showToast('⚡ Alla 5 gratismodeller valda!');
  };

  const copyText = (id: string, text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    showToast('📋 Kopierad till urklipp!');
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

  const handleGenerateImage = () => {
    if (!imgPrompt.trim()) return;
    setIsGeneratingImg(true);
    
    let width = 1024;
    let height = 1024;
    if (imgAspect === '16:9') { width = 1280; height = 720; }
    if (imgAspect === '9:16') { width = 720; height = 1280; }

    const seed = Math.floor(Math.random() * 999999);
    const encodedPrompt = encodeURIComponent(imgPrompt.trim());
    const finalUrl = `[https://image.pollinations.ai/prompt/$](https://image.pollinations.ai/prompt/$){encodedPrompt}?width=${width}&height=${height}&seed=${seed}&model=flux&nologo=true`;

    const img = new Image();
    img.src = finalUrl;
    img.onload = () => {
      setGeneratedImgUrl(finalUrl);
      setIsGeneratingImg(false);
      showToast('🎨 Bild genererad med Flux.1!');
    };
    img.onerror = () => {
      setGeneratedImgUrl(finalUrl);
      setIsGeneratingImg(false);
    };
  };

  return (
    <div className="min-h-screen bg-[#080B10] text-slate-100 font-sans flex flex-col selection:bg-indigo-500/30">
      
      {/* Top Header */}
      <header className="h-16 border-b border-slate-800/80 bg-slate-950/90 px-4 sm:px-8 flex items-center justify-between backdrop-blur-xl sticky top-0 z-40">
        <div className="flex items-center gap-3">
          <div className="bg-gradient-to-br from-indigo-500 to-purple-600 p-2.5 rounded-2xl text-white shadow-lg shadow-indigo-500/20">
            <Rocket className="w-5 h-5" />
          </div>
          <div>
            <h1 className="text-base font-black tracking-tight text-white flex items-center gap-2">
              <span>VibeCoder Multimodal Studio</span>
              <span className="text-[10px] uppercase font-mono px-2 py-0.5 border border-indigo-500/30 bg-indigo-500/10 text-indigo-300 rounded-full font-bold">
                Code • Image • Video
              </span>
            </h1>
            <p className="text-[11px] text-slate-400 hidden sm:block">Parallell kodgenerering, Flux.1-bildstudio & video-pipelines</p>
          </div>
        </div>

        {/* Global Navigation Tabs & API Key */}
        <div className="flex items-center gap-3">
          <div className="flex bg-slate-900 border border-slate-800 rounded-xl p-1">
            <button
              onClick={() => setActiveTab('code')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition flex items-center gap-1.5 ${
                activeTab === 'code' ? 'bg-indigo-600 text-white shadow' : 'text-slate-400 hover:text-white'
              }`}
            >
              <Swords className="w-3.5 h-3.5" />
              <span>AI Arena</span>
            </button>
            <button
              onClick={() => setActiveTab('image')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition flex items-center gap-1.5 ${
                activeTab === 'image' ? 'bg-purple-600 text-white shadow' : 'text-slate-400 hover:text-white'
              }`}
            >
              <ImageIcon className="w-3.5 h-3.5" />
              <span>Bild Studio (Flux)</span>
            </button>
            <button
              onClick={() => setActiveTab('video')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition flex items-center gap-1.5 ${
                activeTab === 'video' ? 'bg-pink-600 text-white shadow' : 'text-slate-400 hover:text-white'
              }`}
            >
              <Video className="w-3.5 h-3.5" />
              <span>Video Hub</span>
            </button>
          </div>

          <button
            onClick={() => setShowKeyInput(!showKeyInput)}
            className={`text-xs px-3 py-1.5 rounded-xl font-bold flex items-center gap-1.5 transition border ${
              apiKey 
                ? 'bg-slate-900 text-emerald-400 border-emerald-500/30' 
                : 'bg-amber-500/10 border-amber-500/30 text-amber-400 animate-pulse'
            }`}
          >
            <Key className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">{apiKey ? 'OpenRouter Klar' : 'Ange Nyckel'}</span>
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

        {/* TAB 1: CODE ARENA */}
        {activeTab === 'code' && (
          <div className="space-y-6">
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
                  <span>Kör Parallell Dispatch ({selectedModelIds.length} Modeller)</span>
                </button>
              </div>
            </div>

            {/* Arena Grid */}
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

                    {/* Code Area */}
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

                    {/* Footer */}
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
                          onClick={() => copyText(modelId, res.code)}
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
          </div>
        )}

        {/* TAB 2: IMAGE STUDIO (FLUX.1 / POLLINATIONS) */}
        {activeTab === 'image' && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            <div className="lg:col-span-5 bg-slate-900/90 border border-slate-800 rounded-3xl p-6 space-y-5 shadow-2xl">
              <div className="flex items-center gap-2.5 border-b border-slate-800 pb-4">
                <div className="p-2 bg-purple-500/10 border border-purple-500/30 rounded-xl text-purple-400">
                  <ImageIcon className="w-5 h-5" />
                </div>
                <div>
                  <h2 className="text-sm font-bold text-white">Flux.1 AI Image Engine</h2>
                  <p className="text-[11px] text-slate-400 font-mono">100% Gratis • Ingen API-nyckel krävs</p>
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-300">Bildprompt</label>
                <textarea
                  rows={4}
                  value={imgPrompt}
                  onChange={(e) => setImgPrompt(e.target.value)}
                  placeholder="Beskriv bilden du vill generera i detalj..."
                  className="w-full bg-slate-950 border border-slate-800 rounded-2xl p-3.5 text-xs text-white placeholder-slate-600 focus:outline-none focus:border-purple-500 resize-none font-sans"
                />
              </div>

              {/* Format selection */}
              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-300 flex items-center gap-1">
                  <Sliders className="w-3.5 h-3.5" /> Bildformat
                </label>
                <div className="grid grid-cols-3 gap-2">
                  {[
                    { id: '16:9', label: '16:9 Widescreen' },
                    { id: '1:1', label: '1:1 Kvadrat' },
                    { id: '9:16', label: '9:16 Mobil Story' }
                  ].map(f => (
                    <button
                      key={f.id}
                      onClick={() => setImgAspect(f.id as any)}
                      className={`py-2 px-2 text-xs font-bold rounded-xl border transition text-center ${
                        imgAspect === f.id ? 'bg-purple-600/30 text-purple-300 border-purple-500' : 'bg-slate-950 border-slate-800 text-slate-400 hover:text-white'
                      }`}
                    >
                      {f.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Presets */}
              <div className="space-y-1.5">
                <span className="text-[11px] font-bold text-slate-500">Exempel-prompts:</span>
                {IMAGE_PRESETS.map((p, idx) => (
                  <button
                    key={idx}
                    onClick={() => setImgPrompt(p)}
                    className="w-full text-left text-[10px] bg-slate-950 border border-slate-800/80 hover:border-slate-700 p-2 rounded-xl text-slate-400 hover:text-white transition truncate"
                  >
                    {p}
                  </button>
                ))}
              </div>

              <button
                onClick={handleGenerateImage}
                disabled={isGeneratingImg || !imgPrompt.trim()}
                className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 disabled:opacity-50 text-white font-black py-4 rounded-2xl text-xs flex items-center justify-center gap-2 transition shadow-xl shadow-purple-600/20 active:scale-95"
              >
                {isGeneratingImg ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Sparkles className="w-4 h-4" />}
                <span>{isGeneratingImg ? 'Genererar bild i Flux.1...' : 'Generera Bild'}</span>
              </button>
            </div>

            {/* Image Preview Canvas */}
            <div className="lg:col-span-7 bg-slate-900/90 border border-slate-800 rounded-3xl p-6 flex flex-col items-center justify-center min-h-[460px] shadow-2xl">
              {generatedImgUrl ? (
                <div className="space-y-4 w-full flex flex-col items-center">
                  <div className="rounded-2xl overflow-hidden border border-slate-800 max-h-[500px] w-full flex items-center justify-center bg-slate-950">
                    <img
                      src={generatedImgUrl}
                      alt="Flux AI Generated"
                      className="max-h-[500px] w-auto object-contain rounded-xl"
                    />
                  </div>
                  <div className="flex gap-3 w-full">
                    <button
                      onClick={() => copyText('img-url', generatedImgUrl)}
                      className="flex-1 bg-slate-950 border border-slate-800 hover:border-slate-700 text-slate-300 font-bold py-2.5 rounded-xl text-xs flex items-center justify-center gap-2 transition"
                    >
                      <Copy className="w-3.5 h-3.5" />
                      <span>Kopiera Bild-URL till Kod</span>
                    </button>
                    <a
                      href={generatedImgUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="bg-purple-600 hover:bg-purple-500 text-white font-bold px-4 py-2.5 rounded-xl text-xs flex items-center gap-1.5 transition shadow"
                    >
                      <ExternalLink className="w-3.5 h-3.5" />
                      <span>Öppna Full HD</span>
                    </a>
                  </div>
                </div>
              ) : (
                <div className="text-center space-y-3 text-slate-600">
                  <ImageIcon className="w-16 h-16 mx-auto opacity-30" />
                  <p className="text-xs">Skriv en prompt och tryck på Generera Bild för att skapa grafik i Flux.1</p>
                </div>
              )}
            </div>
          </div>
        )}

        {/* TAB 3: VIDEO STUDIO HUB */}
        {activeTab === 'video' && (
          <div className="space-y-6">
            <div className="bg-slate-900/90 border border-slate-800 rounded-3xl p-6 shadow-2xl">
              <div className="flex items-center gap-2.5 border-b border-slate-800 pb-4 mb-4">
                <div className="p-2 bg-pink-500/10 border border-pink-500/30 rounded-xl text-pink-400">
                  <Video className="w-5 h-5" />
                </div>
                <div>
                  <h2 className="text-sm font-bold text-white">AI Video & Storyboard Hub</h2>
                  <p className="text-[11px] text-slate-400">De bästa kostnadsfria videomodellerna för app-mockups och animationer</p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {[
                  {
                    name: "Kling AI",
                    badge: "66 Credits / Dag Gratis",
                    desc: "Världsledande fysik och 1080p generation för filmiska produktklipp och sportsekvenser.",
                    link: "[https://klingai.com](https://klingai.com)"
                  },
                  {
                    name: "Luma Dream Machine",
                    badge: "Gratis Månadskvot",
                    desc: "Snabb generation med avancerad kamerakontroll (zoom, pan, orbital rotation).",
                    link: "[https://lumalabs.ai/dream-machine](https://lumalabs.ai/dream-machine)"
                  },
                  {
                    name: "MiniMax Hailuo AI",
                    badge: "Gratis Webbgenerator",
                    desc: "Exceptionell på naturtrogna karaktärer, textanimationer och ljussättning.",
                    link: "[https://hailuoai.video](https://hailuoai.video)"
                  }
                ].map(v => (
                  <div key={v.name} className="bg-slate-950 border border-slate-800 p-5 rounded-2xl flex flex-col justify-between space-y-3">
                    <div className="space-y-1.5">
                      <div className="flex items-center justify-between">
                        <h3 className="font-bold text-white text-sm">{v.name}</h3>
                        <span className="text-[9px] uppercase font-mono px-2 py-0.5 rounded-full bg-pink-500/10 text-pink-300 border border-pink-500/30">
                          {v.badge}
                        </span>
                      </div>
                      <p className="text-xs text-slate-400 leading-relaxed">{v.desc}</p>
                    </div>
                    <a
                      href={v.link}
                      target="_blank"
                      rel="noreferrer"
                      className="bg-slate-900 hover:bg-slate-800 text-white font-bold py-2 rounded-xl text-xs flex items-center justify-center gap-1.5 transition border border-slate-800"
                    >
                      <span>Öppna {v.name}</span>
                      <ExternalLink className="w-3.5 h-3.5 text-slate-400" />
                    </a>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

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
