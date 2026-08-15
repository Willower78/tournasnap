import React from 'react';
import type { ViewportMode } from '../../types/ide';
import { RefreshCw } from 'lucide-react';

interface PreviewPanelProps {
  viewport: ViewportMode;
  iframeRef: React.RefObject<HTMLIFrameElement | null>;
  onRefresh: () => void;
}

export const PreviewPanel: React.FC<PreviewPanelProps> = ({
  viewport,
  iframeRef,
  onRefresh,
}) => {
  const getContainerWidth = () => {
    switch (viewport) {
      case 'mobile':
        return 'w-[375px] h-[667px] rounded-2xl border-4 border-slate-700 shadow-2xl';
      case 'tablet':
        return 'w-[768px] h-[95%] rounded-lg border-2 border-slate-700 shadow-xl';
      case 'desktop':
      default:
        return 'w-full h-full border-none';
    }
  };

  return (
    <div className="flex flex-col h-full bg-slate-900 overflow-hidden">
      <div className="h-9 bg-slate-900 border-b border-slate-800 px-3 flex items-center justify-between text-xs text-slate-400">
        <div className="flex items-center gap-2">
          <span className="inline-block w-2 h-2 rounded-full bg-emerald-400"></span>
          <span className="font-mono">Live Sandbox ({viewport})</span>
        </div>
        <button
          onClick={onRefresh}
          className="p-1 hover:text-slate-200 rounded transition-colors"
          title="Reload Sandbox"
        >
          <RefreshCw className="w-3.5 h-3.5" />
        </button>
      </div>

      <div className="flex-1 bg-slate-950 flex items-center justify-center p-4 overflow-auto">
        <div className={`transition-all duration-300 ease-in-out bg-white overflow-hidden relative ${getContainerWidth()}`}>
          <iframe
            ref={iframeRef}
            title="live-sandbox"
            sandbox="allow-scripts allow-modals allow-forms allow-same-origin"
            className="w-full h-full bg-white border-0"
          />
        </div>
      </div>
    </div>
  );
};
