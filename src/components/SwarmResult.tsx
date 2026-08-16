import React, { useState } from 'react';
import { createSandboxHtml } from '../utils/sandboxEngine';
import { Trophy, Download, Copy, Check, Eye, Code2 } from 'lucide-react';

interface SwarmResultProps {
  finalMasterCode: string;
  onCopy: (id: string, text: string) => void;
  copiedId: string | null;
}

export const SwarmResult: React.FC<SwarmResultProps> = ({ finalMasterCode, onCopy, copiedId }) => {
  const [masterView, setMasterView] = useState<'preview' | 'code'>('preview');

  const downloadFile = (fileName: string, code: string) => {
    const blob = new Blob([code], { type: 'text/typescript' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${fileName}.tsx`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
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
            onClick={() => onCopy('master', finalMasterCode)}
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
            srcDoc={createSandboxHtml(finalMasterCode)}
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
  );
};
