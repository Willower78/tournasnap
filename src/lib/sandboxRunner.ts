import type { VirtualFile } from '../types/ide';

export function createSandboxHtml(files: VirtualFile[]): string {
  const appFile = files.find(f => 
    f.name === 'App.tsx' || f.path.endsWith('/App.tsx')
  ) || files.find(f => f.name.endsWith('.tsx') || f.name.endsWith('.jsx')) || files[0];

  if (!appFile || !appFile.content.trim()) {
    return `<!DOCTYPE html><html><body style="background:#020617;color:#94a3b8;font-family:sans-serif;display:flex;align-items:center;justify-content:center;height:100vh;margin:0;"><div style="text-align:center;"><h3>No code available</h3></div></body></html>`;
  }

  let rawSource = appFile.content.trim();

  // Strip conversational markdown lines at the top
  const codeStartIndex = rawSource.search(/(?:import\s+|export\s+|const\s+|function\s+|type\s+|interface\s+)/);
  if (codeStartIndex > 0) {
    rawSource = rawSource.substring(codeStartIndex);
  }

  // Strip markdown code fences
  rawSource = rawSource.replace(/^```(?:tsx|jsx|typescript|javascript)?\n?/, '');
  rawSource = rawSource.replace(/```$/, '');

  // Extract all named imports from 'lucide-react'
  const lucideMatches = [...rawSource.matchAll(/import\s*\{([^}]+)\}\s*from\s*['"]lucide-react['"]/g)];
  const importedIcons = new Set<string>();
  lucideMatches.forEach(m => {
    m[1].split(',').forEach(name => {
      const trimmed = name.trim();
      if (trimmed) importedIcons.add(trimmed);
    });
  });

  // Strip all standard import statements
  rawSource = rawSource.replace(/import\s+[\s\S]*?from\s+['"].*?['"];?/g, '');

  // Normalize default exports to MainApp
  rawSource = rawSource.replace(/export\s+default\s+function\s*([a-zA-Z0-9_$]*)/, 'function MainApp');
  rawSource = rawSource.replace(/export\s+default\s+([a-zA-Z0-9_$]+);?/, 'const MainApp = $1;');
  rawSource = rawSource.replace(/export\s+(?:const|let|var|function|type|interface)\s+/g, (match) => match.replace('export ', ''));

  const payload = JSON.stringify(rawSource);
  const iconList = JSON.stringify([...importedIcons]);

  return `<!DOCTYPE html>
<html lang="en" class="dark">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <script src="https://cdn.tailwindcss.com"></script>
  <script>
    tailwind.config = {
      darkMode: 'class',
      theme: {
        extend: {
          colors: {
            brand: { 500: '#10b981', 600: '#059669', 400: '#34d399' }
          }
        }
      }
    }
  </script>
  <!-- React 18, React DOM & Babel Standalone -->
  <script src="https://unpkg.com/react@18.2.0/umd/react.development.js"></script>
  <script src="https://unpkg.com/react-dom@18.2.0/umd/react-dom.development.js"></script>
  <script src="https://unpkg.com/@babel/standalone@7.24.0/babel.min.js"></script>
  <style>
    body { margin: 0; padding: 0; background-color: #020617; color: #f8fafc; font-family: ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, sans-serif; min-height: 100vh; overflow-x: hidden; }
    ::-webkit-scrollbar { width: 6px; height: 6px; }
    ::-webkit-scrollbar-thumb { background: #1e293b; border-radius: 3px; }
  </style>
</head>
<body>
  <div id="root"></div>

  <script type="text/javascript">
    (function() {
      const R = window.React;
      const RD = window.ReactDOM;

      if (!R || !RD) {
        document.getElementById('root').innerHTML = '<div style="padding:20px;color:#ef4444;">Failed to load React CDN.</div>';
        return;
      }

      // Universal Safe Icon Creator
      const createIcon = (name) => function LucideIcon(props = {}) {
        const size = props.size || 16;
        const className = props.className || '';
        return R.createElement('svg', {
          xmlns: 'http://www.w3.org/2000/svg',
          width: size,
          height: size,
          viewBox: '0 0 24 24',
          fill: 'none',
          stroke: 'currentColor',
          strokeWidth: '2',
          strokeLinecap: 'round',
          strokeLinejoin: 'round',
          className: 'inline-block flex-shrink-0 ' + className,
          style: props.style,
          onClick: props.onClick
        }, [
          R.createElement('circle', { key: 'c', cx: '12', cy: '12', r: '9', opacity: '0.2' }),
          R.createElement('path', { key: 'p', d: 'M12 8v8M8 12h8' })
        ]);
      };

      try {
        const rawCode = ${payload};
        const icons = ${iconList};

        // Build icon definitions header
        let iconDefinitions = '';
        icons.forEach(ic => {
          iconDefinitions += 'const ' + ic + ' = createIcon("' + ic + '");\\n';
        });

        // Common Lucide icon fallback list so undeclared icons don't throw ReferenceError
        const fallbackIcons = [
          'Activity', 'Play', 'Pause', 'Shield', 'Zap', 'Search', 'Target', 'Eye', 
          'Video', 'ChevronRight', 'Award', 'User', 'RefreshCw', 'Layers', 'Sliders', 'Sparkles',
          'CheckCircle2', 'AlertTriangle', 'TrendingUp', 'DollarSign', 'Cpu', 'Brain', 'Lock',
          'ArrowUpRight', 'ArrowDownRight', 'Crosshair', 'Flame', 'Radio', 'Send', 'X', 'ChevronDown',
          'SlidersHorizontal', 'UserPlus', 'Scale', 'Sparkle', 'Database', 'Plus', 'Trash2', 'FolderOpen',
          'Download', 'Smartphone', 'Monitor', 'Tablet', 'Globe', 'Loader2', 'Maximize2'
        ];

        fallbackIcons.forEach(ic => {
          if (!icons.includes(ic)) {
            iconDefinitions += 'if (typeof ' + ic + ' === "undefined") { var ' + ic + ' = createIcon("' + ic + '"); }\\n';
          }
        });

        const fullScriptToTransform = iconDefinitions + '\\n' + rawCode;

        const transformedCode = Babel.transform(fullScriptToTransform, {
          presets: [
            ['react', { runtime: 'classic' }],
            'typescript'
          ],
          filename: 'App.tsx'
        }).code;

        // Execute code in a clean scope with React hooks injected
        const evaluateScope = new Function(
          'React', 'ReactDOM', 'useState', 'useEffect', 'useMemo', 'useRef', 'useCallback', 'useContext', 'createContext', 'createIcon',
          \`
          \${transformedCode}
          if (typeof MainApp !== 'undefined') return MainApp;
          if (typeof RadarTelemetryDashboard !== 'undefined') return RadarTelemetryDashboard;
          if (typeof ProScoutDashboard !== 'undefined') return ProScoutDashboard;
          if (typeof App !== 'undefined') return App;
          return null;
          \`
        );

        const ComponentToRender = evaluateScope(
          R, RD, R.useState, R.useEffect, R.useMemo, R.useRef, R.useCallback, R.useContext, R.createContext, createIcon
        );

        if (!ComponentToRender) {
          document.getElementById('root').innerHTML = '<div style="padding:24px;color:#f59e0b;font-family:monospace;">⚠️ No default component exported in App.tsx.</div>';
          return;
        }

        const root = RD.createRoot(document.getElementById('root'));
        root.render(R.createElement(ComponentToRender));

      } catch (err) {
        document.getElementById('root').innerHTML = \`
          <div style="padding: 24px; color: #ef4444; font-family: monospace; background: #0f172a; border: 1px solid #991b1b; margin: 16px; border-radius: 8px;">
            <h3 style="margin-top:0; font-size: 15px;">⚠️ Live Execution Error:</h3>
            <pre style="white-space: pre-wrap; font-size: 12px; color: #fca5a5;">\${err.message}</pre>
          </div>
        \`;
        console.error(err);
      }
    })();
  </script>
</body>
</html>`;
}
