import React, { useState } from 'react';
import { Copy, Check, Code, Eye, Maximize2, Minimize2 } from 'lucide-react';
import { toast } from '@/components/ui/use-toast';
import { ToggleGroup, ToggleGroupItem } from '@/components/ui/toggle-group';

interface FileItem {
  id: string;
  name: string;
  type: 'file' | 'folder';
  extension?: string;
}

interface CodeEditorProps {
  selectedFile: FileItem | null;
}

export const CodeEditor: React.FC<CodeEditorProps> = ({ selectedFile }) => {
  const [viewMode, setViewMode] = useState<'code' | 'preview' | 'split'>('code');
  const [maximized, setMaximized] = useState(false);
  const [copied, setCopied] = useState(false);

  const getCodeContent = () => {
    if (!selectedFile) return '';
    
    switch (selectedFile.id) {
      case '3': // App.jsx
        return `import React from 'react';
import Navbar from './Navbar';
import Footer from './Footer';

function App() {
  return (
    <div className="app">
      <Navbar />
      <main className="content">
        <h1>Welcome to My App</h1>
        <p>This is a sample React application.</p>
      </main>
      <Footer />
    </div>
  );
}

export default App;`;
      case '4': // Navbar.jsx
        return `import React from 'react';

function Navbar() {
  return (
    <nav className="navbar">
      <div className="logo">MyApp</div>
      <ul className="nav-links">
        <li><a href="/">Home</a></li>
        <li><a href="/about">About</a></li>
        <li><a href="/contact">Contact</a></li>
      </ul>
    </nav>
  );
}

export default Navbar;`;
      case '9': // index.js
        return `import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './components/App';
import './styles/main.css';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);`;
      default:
        return `// Select a file to view its contents`;
    }
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(getCodeContent());
    setCopied(true);
    toast({
      title: "Copied to clipboard",
      description: "The code has been copied to your clipboard.",
    });
    setTimeout(() => setCopied(false), 2000);
  };

  const toggleMaximize = () => {
    setMaximized(!maximized);
  };

  return (
    <div className={`flex flex-col h-full bg-background ${maximized ? 'fixed inset-0 z-50' : ''}`}>
      <div className="flex items-center justify-between p-4 border-b border-border">
        <div className="flex items-center space-x-2">
          <h2 className="text-lg font-semibold">
            {selectedFile ? selectedFile.name : 'Code Editor'}
          </h2>
        </div>
        <div className="flex items-center space-x-3">
          <ToggleGroup type="single" value={viewMode} onValueChange={(value) => value && setViewMode(value as 'code' | 'preview' | 'split')}>
            <ToggleGroupItem value="code" aria-label="Show Code">
              <Code size={16} />
            </ToggleGroupItem>
            <ToggleGroupItem value="preview" aria-label="Show Preview">
              <Eye size={16} />
            </ToggleGroupItem>
          </ToggleGroup>
          
          <button
            onClick={copyToClipboard}
            className="p-1.5 rounded-md hover:bg-secondary transition-colors"
            title="Copy Code"
          >
            {copied ? <Check size={18} className="text-green-500" /> : <Copy size={18} />}
          </button>
          <button
            onClick={toggleMaximize}
            className="p-1.5 rounded-md hover:bg-secondary transition-colors"
            title={maximized ? "Exit Fullscreen" : "Fullscreen"}
          >
            {maximized ? <Minimize2 size={18} /> : <Maximize2 size={18} />}
          </button>
        </div>
      </div>

      <div className="flex-1 flex">
        {/* Code Editor */}
        {(viewMode === 'code' || viewMode === 'split') && (
          <div className={`${viewMode === 'split' ? 'w-1/2' : 'w-full'} overflow-auto border-r border-border`}>
            <div className="h-8 flex items-center px-4 bg-[#1e1e1e] text-sm border-b border-[#333]">
              <span className="opacity-70 text-[#cccccc]">Editor</span>
            </div>
            <pre className="p-4 text-sm font-mono bg-[#1e1e1e] text-[#d4d4d4] overflow-auto h-[calc(100%-2rem)] leading-relaxed">
              <code>{getCodeContent()}</code>
            </pre>
          </div>
        )}
        
        {/* Preview */}
        {(viewMode === 'preview' || viewMode === 'split') && (
          <div className={`${viewMode === 'split' ? 'w-1/2' : 'w-full'} flex flex-col overflow-hidden`}>
            <div className="h-8 flex items-center justify-between px-4 bg-secondary/40 text-sm border-b border-border">
              <span className="opacity-70">Preview</span>
            </div>
            <div className="flex-1 bg-white overflow-auto">
              <iframe
                title="preview"
                className="w-full h-full border-0"
                srcDoc={`
                  <html>
                    <head>
                      <style>
                        body {
                          font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif;
                          margin: 0;
                          padding: 20px;
                        }
                        .navbar {
                          display: flex;
                          justify-content: space-between;
                          align-items: center;
                          padding: 1rem;
                          background-color: #333;
                          color: white;
                        }
                        .nav-links {
                          display: flex;
                          list-style: none;
                          gap: 1rem;
                        }
                        .nav-links a {
                          color: white;
                          text-decoration: none;
                        }
                        .content {
                          padding: 2rem;
                        }
                      </style>
                    </head>
                    <body>
                      <div class="app">
                        <nav class="navbar">
                          <div class="logo">MyApp</div>
                          <ul class="nav-links">
                            <li><a href="/">Home</a></li>
                            <li><a href="/about">About</a></li>
                            <li><a href="/contact">Contact</a></li>
                          </ul>
                        </nav>
                        <main class="content">
                          <h1>Welcome to My App</h1>
                          <p>This is a sample React application.</p>
                        </main>
                        <footer style="padding: 1rem; text-align: center; background-color: #f5f5f5;">
                          &copy; 2023 MyApp. All rights reserved.
                        </footer>
                      </div>
                    </body>
                  </html>
                `}
              />
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
