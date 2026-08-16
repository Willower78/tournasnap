export function createSandboxHtml(rawCode: string): string {
  // Städa bort eventuella markdown codeblocks
  let code = rawCode
    .replace(/^```[a-zA-Z0-9_-]*\n?/gm, '')
    .replace(/\n?```$/gm, '');

  const safeJsonCode = JSON.stringify(code);

  return `<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <script src="https://cdn.tailwindcss.com"></script>
  <!-- Babel standalone för in-browser TypeScript & JSX transpilering -->
  <script src="https://unpkg.com/@babel/standalone@7.24.0/babel.min.js"></script>
  
  <!-- Import Map som gör att alla vanliga imports fungerar som moduler -->
  <script type="importmap">
  {
    "imports": {
      "react": "https://esm.sh/react@18.2.0?dev",
      "react/jsx-runtime": "https://esm.sh/react@18.2.0/jsx-runtime?dev",
      "react-dom": "https://esm.sh/react-dom@18.2.0?dev",
      "react-dom/client": "https://esm.sh/react-dom@18.2.0/client?dev",
      "lucide-react": "https://esm.sh/lucide-react@0.344.0?dev"
    }
  }
  </script>
  <style>
    body { background-color: #0b0f19; color: #f8fafc; font-family: ui-sans-serif, system-ui, sans-serif; margin: 0; padding: 14px; }
  </style>
</head>
<body>
  <div id="root"></div>

  <script type="module">
    import React from 'react';
    import ReactDOM from 'react-dom/client';
    import * as LucideIcons from 'lucide-react';

    // Gör dem tillgängliga globalt inuti sandboxen
    window.React = React;
    window.ReactDOM = ReactDOM;
    window.LucideIcons = LucideIcons;

    try {
      const sourceCode = ${safeJsonCode};

      // Transpilera TypeScript + TSX till standard ES-kod
      const transpiled = Babel.transform(sourceCode, {
        presets: ['react', 'typescript'],
        filename: 'App.tsx'
      }).code;

      // Konvertera export default till global export eller dynamisk import URL
      const dataUri = "data:text/javascript;charset=utf-8," + encodeURIComponent(transpiled);
      
      const module = await import(dataUri);
      const Component = module.default || module.App || module.Scoreboard || module.MatchTimer || Object.values(module).find(v => typeof v === 'function');

      if (Component) {
        ReactDOM.createRoot(document.getElementById('root')).render(React.createElement(Component));
      } else {
        document.getElementById('root').innerHTML = '<div style="padding:16px;color:#34d399;font-family:monospace;font-size:12px;">✅ Kompilerad och klar! Växla till "Kod"-läget för att se källkoden.</div>';
      }
    } catch (err) {
      document.getElementById('root').innerHTML = '<div style="padding:12px;background:rgba(239,68,68,0.1);border:1px solid rgba(239,68,68,0.3);border-radius:12px;color:#f87171;font-family:monospace;font-size:11px;">⚠️ Sandbox: ' + err.message + '</div>';
    }
  </script>
</body>
</html>`;
}
