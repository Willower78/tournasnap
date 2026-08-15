import React, { useState } from 'react';
import { Sparkles, Play, Download, Smartphone, Monitor, Tablet, Globe, Loader2, CheckCircle2, Plus, FolderOpen, Trash2 } from 'lucide-react';
import type { ViewportMode } from '../../types/ide';

export interface ProjectSession {
  id: string;
  name: string;
  updatedAt: string;
}

interface HeaderProps {
  viewport: ViewportMode;
  setViewport: (mode: ViewportMode) => void;
  projects: ProjectSession[];
  currentProjectId: string;
  onSelectProject: (id: string) => void;
  onNewProject: () => void;
  onDeleteProject: (id: string) => void;
  onRun: () => void;
  onExport: () => void;
  onPublish: () => void;
  dailyPromptCount: number;
  isGenerating: boolean;
  statusText: string;
}

export const Header: React.FC<HeaderProps> = ({
  viewport,
  setViewport,
  projects,
  currentProjectId,
  onSelectProject,
  onNewProject,
  onDeleteProject,
  onRun,
  onExport,
  onPublish,
  dailyPromptCount,
  isGenerating,
  statusText,
}) => {
  const [showDropdown, setShowDropdown] = useState(false);
  const currentProject = projects.find(p => p.id === currentProjectId);

  return (
    <header className="h-14 bg-slate-900 border-b border-slate-800 px-4 flex items-center justify-between select-none text-slate-200 gap-4 relative z-50">
      <div className="flex items-center gap-3">
        <div className="flex items-center gap-2 font-bold tracking-tight text-indigo-400 text-lg">
          <Sparkles className="w-5 h-5 text-indigo-400" />
          <span>VibeStudio</span>
        </div>

        {/* Project Selector Dropdown */}
        <div className="relative">
          <button
            onClick={() => setShowDropdown(prev => !prev)}
            className="flex items-center gap-2 bg-slate-950 px-3 py-1.5 rounded-lg border border-slate-800 text-xs font-semibold text-slate-200 hover:border-slate-700 transition"
          >
            <FolderOpen className="w-3.5 h-3.5 text-indigo-400" />
            <span className="max-w-[140px] truncate">{currentProject?.name || 'Untitled App'}</span>
            <span className="text-[10px] text-slate-500 font-mono">({projects.length})</span>
          </button>

          {showDropdown && (
            <div className="absolute top-10 left-0 w-64 bg-slate-900 border border-slate-800 rounded-xl shadow-2xl p-2 z-50">
              <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider px-2 py-1 mb-1">
                Your Saved Apps
              </div>
              <div className="max-h-56 overflow-y-auto space-y-1">
                {projects.map((proj) => (
                  <div
                    key={proj.id}
                    className={`flex items-center justify-between px-2.5 py-1.5 rounded-lg text-xs cursor-pointer group ${
                      proj.id === currentProjectId ? 'bg-indigo-600/20 text-indigo-300 border border-indigo-500/30' : 'hover:bg-slate-800 text-slate-300'
                    }`}
                    onClick={() => {
                      onSelectProject(proj.id);
                      setShowDropdown(false);
                    }}
                  >
                    <div className="truncate flex-1">
                      <div className="font-medium truncate">{proj.name}</div>
                      <div className="text-[9px] text-slate-500">{new Date(proj.updatedAt).toLocaleDateString()}</div>
                    </div>
                    {projects.length > 1 && (
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          if (confirm(`Delete project "${proj.name}"?`)) {
                            onDeleteProject(proj.id);
                          }
                        }}
                        className="opacity-0 group-hover:opacity-100 p-1 hover:text-red-400 text-slate-500 transition"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* New App Button */}
        <button
          onClick={onNewProject}
          className="flex items-center gap-1.5 bg-indigo-600/20 hover:bg-indigo-600/30 text-indigo-300 border border-indigo-500/30 px-2.5 py-1.5 rounded-lg text-xs font-semibold transition"
          title="Start a new app and chat"
        >
          <Plus className="w-3.5 h-3.5" />
          <span>New App</span>
        </button>

        {/* Status / Progress Indicator */}
        <div className="hidden sm:flex items-center">
          {isGenerating ? (
            <span className="flex items-center gap-2 text-xs font-mono bg-amber-500/10 text-amber-300 border border-amber-500/30 px-3 py-1 rounded-full animate-pulse">
              <Loader2 className="w-3.5 h-3.5 animate-spin" />
              <span>{statusText || 'Iterating codebase...'}</span>
            </span>
          ) : (
            <span className="flex items-center gap-1.5 text-xs font-mono bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 px-2.5 py-1 rounded-full">
              <CheckCircle2 className="w-3.5 h-3.5" />
              <span>Engine Ready</span>
            </span>
          )}
        </div>
      </div>

      {/* Viewport Switcher */}
      <div className="flex items-center bg-slate-950 p-1 rounded-lg border border-slate-800 gap-1">
        <button
          onClick={() => setViewport('desktop')}
          className={`px-2.5 py-1 rounded text-xs flex items-center gap-1.5 transition-colors ${
            viewport === 'desktop' ? 'bg-indigo-600 text-white font-medium' : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          <Monitor className="w-3.5 h-3.5" />
          <span className="hidden sm:inline">Desktop</span>
        </button>

        <button
          onClick={() => setViewport('tablet')}
          className={`px-2.5 py-1 rounded text-xs flex items-center gap-1.5 transition-colors ${
            viewport === 'tablet' ? 'bg-indigo-600 text-white font-medium' : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          <Tablet className="w-3.5 h-3.5" />
          <span className="hidden sm:inline">Tablet</span>
        </button>

        <button
          onClick={() => setViewport('mobile')}
          className={`px-2.5 py-1 rounded text-xs flex items-center gap-1.5 transition-colors ${
            viewport === 'mobile' ? 'bg-indigo-600 text-white font-medium' : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          <Smartphone className="w-3.5 h-3.5" />
          <span className="hidden sm:inline">Mobile</span>
        </button>
      </div>

      {/* Action Controls */}
      <div className="flex items-center gap-2">
        <button
          onClick={onRun}
          className="flex items-center gap-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 px-3 py-1.5 rounded-md text-xs font-semibold border border-slate-700 transition"
        >
          <Play className="w-3.5 h-3.5 fill-current" />
          <span>Refresh</span>
        </button>

        <button
          onClick={onExport}
          className="flex items-center gap-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 px-3 py-1.5 rounded-md text-xs font-semibold border border-slate-700 transition"
        >
          <Download className="w-3.5 h-3.5" />
          <span className="hidden sm:inline">Export ZIP</span>
        </button>

        <button
          onClick={onPublish}
          className="flex items-center gap-1.5 bg-emerald-500 hover:bg-emerald-400 text-slate-950 px-3.5 py-1.5 rounded-md text-xs font-black shadow-lg shadow-emerald-500/20 transition-all hover:scale-105 active:scale-95"
        >
          <Globe className="w-3.5 h-3.5" />
          <span>Publish App</span>
        </button>
      </div>
    </header>
  );
};
