import React, { useState } from 'react';
import { ModelTarget, ModelResult } from '../types';
import { createSandboxHtml } from '../utils/sandboxEngine';
import { Eye, Code2, RefreshCw, Copy, Check, Users, AlertCircle } from 'lucide-react';

interface ModelCardProps {
  modelCfg: ModelTarget;
  result: ModelResult;
  onSwarm: (modelId: string, code: string) => void;
  onCopy: (id: string, text: string) => void;
  copiedId: string | null;
  swarmDisabled: boolean;
}

export const ModelCard: React.FC<ModelCardProps> = ({
  modelCfg,
  result,
  onSwarm,
  onCopy,
  copiedId,
  swarmDisabled
}) => {
  const [view, setView] = useState<'preview' | 'code'>('preview');

  return (
    <div className="bg-slate-900/90 border border-slate-800 rounded-3xl overflow-hidden flex flex-col shadow-2xl">
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

        <div className="flex items-center gap-2">
          {result.status === 'done' && (
            <div className="flex bg-slate-950 border border-slate-800 rounded-xl p-0.5">
              <button
                onClick={() => setView('preview')}
                className={`p-1 px-2 rounded-lg text-[10px] font-bold transition flex items-center gap-1 ${
                  view === 'preview' ? 'bg-indigo-600 text-white' : 'text-slate-400 hover:text-white'
                }`}
              >
                <Eye className="w-3.5 h-3.5" /> Preview
              </button>
              <button
                onClick={() => setView('code')}
                className={`p-1 px-2 rounded-lg text-[10px] font-bold transition flex items-center gap-1 ${
                  view === 'code' ? 'bg-indigo-600 text-white' : 'text-slate-400 hover:text-white'
                }`}
              >
                <Code2 className="w-3.5 h-3.5" /> Kod
              </button>
            </div>
          )}

          {result.status === 'generating' && (
            <span className="text-indigo-400 font-mono text-[11px] animate-pulse flex items-center gap-1">
              <RefreshCw className="w-3.5 h-3.5 animate-spin" /> Skapar...
            </span>
          )}
          {result.status === 'done' && (
            <span className="text-emerald-400 font-mono text-[10px] bg-emerald-500/10 px-2 py-0.5 rounded-full border border-emerald-500/30 font-bold">
              ⚡ {result.latencyMs}ms
            </span>
          )}
        </div>
      </div>

      {/* Main Sandbox or Code view */}
      <div className="flex-1 min-h-[380px] max-h-[460px] bg-slate-950 flex flex-col">
        {result.status === 'idle' && (
          <div className="h-full flex flex-col items-center justify-center text-slate-600 space-y-2 py-20">
            <Code2 className="w-10 h-10 opacity-30" />
            <span>Redo för koncept-race</span>
          </div>
        )}

        {result.status === 'generating' && (
          <div className="h-full flex flex-col items-center justify-center text-indigo-400 space-y-3 py-20">
            <RefreshCw className="w-8 h-8 animate-spin" />
            <span className="text-xs font-sans">Genererar koncept...</span>
          </div>
        )}

        {result.status === 'error' && (
          <div className="p-4 text-red-400 text-xs bg-red-500/10 border border-red-500/30 rounded-2xl m-4 flex items-start gap-2">
            <AlertCircle className="w-4 h-4 flex-shrink-0 mt-0.5" />
            <span>{result.errorMsg || 'Genereringen misslyckades'}</span>
          </div>
        )}

        {result.status === 'done' && (
          view === 'preview' ? (
            <iframe
              title={`${modelCfg.name} Preview`}
              srcDoc={createSandboxHtml(result.code)}
              className="w-full flex-1 min-h-[380px] border-none bg-slate-950"
              sandbox="allow-scripts allow-same-origin"
            />
          ) : (
            <div className="p-4 font-mono text-[11px] overflow-y-auto text-slate-300 leading-relaxed select-all">
              <pre className="whitespace-pre-wrap">{result.code}</pre>
            </div>
          )
        )}
      </div>

      {/* Footer Actions */}
      {result.status === 'done' && (
        <div className="p-3.5 border-t border-slate-800 bg-slate-950/80 flex items-center justify-between gap-2">
          <button
            onClick={() => onCopy(modelCfg.id, result.code)}
            className="text-slate-400 hover:text-white text-xs font-medium flex items-center gap-1 transition px-2 py-1"
          >
            {copiedId === modelCfg.id ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
            <span>Kopiera</span>
          </button>

          <button
            onClick={() => onSwarm(modelCfg.id, result.code)}
            disabled={swarmDisabled}
            className="bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white font-black px-3.5 py-2 rounded-xl text-xs flex items-center gap-1.5 transition shadow-lg shadow-indigo-600/30 active:scale-95 disabled:opacity-50"
          >
            <Users className="w-3.5 h-3.5" />
            <span>🤝 Bygg med AI Swarm</span>
          </button>
        </div>
      )}
    </div>
  );
};
