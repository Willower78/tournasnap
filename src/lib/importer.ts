import JSZip from 'jszip';
import type { VirtualFile } from '../types/ide';

export async function extractZipToFiles(file: File): Promise<VirtualFile[]> {
  const zip = new JSZip();
  const loadedZip = await zip.loadAsync(file);
  const virtualFiles: VirtualFile[] = [];

  for (const [relativePath, zipEntry] of Object.entries(loadedZip.files)) {
    if (zipEntry.dir) continue;
    
    // Ignorera node_modules, git, dolda filer
    if (relativePath.includes('node_modules/') || relativePath.startsWith('.') || relativePath.includes('/.')) {
      continue;
    }

    const content = await zipEntry.async('string');
    const name = relativePath.split('/').pop() || relativePath;
    
    let language = 'typescript';
    if (name.endsWith('.css')) language = 'css';
    if (name.endsWith('.json')) language = 'json';
    if (name.endsWith('.html')) language = 'html';
    if (name.endsWith('.js') || name.endsWith('.jsx')) language = 'javascript';

    virtualFiles.push({
      name,
      path: '/' + relativePath,
      language,
      content
    });
  }

  return virtualFiles;
}

export async function exportProjectToZip(files: VirtualFile[], projectName: string = 'vibe-project'): Promise<void> {
  const zip = new JSZip();

  files.forEach((f) => {
    // Rensa inledande snedstreck
    const cleanPath = f.path.startsWith('/') ? f.path.substring(1) : f.path;
    zip.file(cleanPath, f.content);
  });

  const blob = await zip.generateAsync({ type: 'blob' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `${projectName.toLowerCase().replace(/\s+/g, '-')}.zip`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}
