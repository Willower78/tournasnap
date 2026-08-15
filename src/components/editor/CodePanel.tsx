import React from 'react';
import { FileCode, Folder } from 'lucide-react';
import type { VirtualFile } from '../../types/ide';

interface CodePanelProps {
  files: VirtualFile[];
  activeFile: string;
  setActiveFile: (path: string) => void;
  onCodeChange: (newContent: string) => void;
}

export const CodePanel: React.FC<CodePanelProps> = ({
  files,
  activeFile,
  setActiveFile,
  onCodeChange,
}) => {
  const currentFile = files.find((f) => f.path === activeFile) || files[0];

  return (
    <div className="flex flex-col h-full bg-slate-950 border-r border-slate-800">
      <div className="flex items-center bg-slate-900 border-b border-slate-800 overflow-x-auto">
        <div className="flex items-center gap-1.5 px-3 py-2 text-xs font-semibold text-slate-400 border-r border-slate-800">
          <Folder className="w-3.5 h-3.5 text-amber-400" />
          <span>Files</span>
        </div>
        {files.map((file) => (
          <button
            key={file.path}
            onClick={() => setActiveFile(file.path)}
            className={`flex items-center gap-1.5 px-3 py-2 text-xs font-mono border-r border-slate-800 transition-colors whitespace-nowrap ${
              file.path === activeFile
                ? 'bg-slate-950 text-indigo-300 border-t-2 border-t-indigo-500'
                : 'text-slate-400 hover:bg-slate-800/50 hover:text-slate-200'
            }`}
          >
            <FileCode className="w-3.5 h-3.5 text-blue-400" />
            <span>{file.name}</span>
          </button>
        ))}
      </div>

      <div className="flex-1 p-0 relative">
        <textarea
          value={currentFile?.content || ''}
          onChange={(e) => onCodeChange(e.target.value)}
          spellCheck={false}
          className="w-full h-full p-4 bg-slate-950 text-slate-200 font-mono text-xs leading-relaxed resize-none focus:outline-none border-none selection:bg-indigo-900 selection:text-white"
        />
      </div>
    </div>
  );
};
