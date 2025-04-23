import Editor from '@monaco-editor/react';
import { CodeEditorProps } from '../../types/types';

const CodeEditor = ({content} : CodeEditorProps) => {
  // Detect file language based on content
  const detectLanguage = (content: string): string => {
    if (content.includes('import React') || content.includes('export default')) {
      return content.includes('tsx') ? 'typescript' : 'javascript';
    }
    if (content.includes('@tailwind') || content.includes('.')) {
      return 'css';
    }
    if (content.includes('<!DOCTYPE html>') || content.includes('<html>')) {
      return 'html';
    }
    if (content.includes('compilerOptions') || content.includes('"scripts":{')) {
      return 'json';
    }
    return 'typescript'; // Default to TypeScript
  };

  return (
    <div className="w-[90vw] h-[100vh] bg-[#1E1E2F]">
      <div className='text-2xl p-2.5 text-white font-semibold'>
        Code Editor
      </div>
      <Editor
        height="90vh"
        defaultLanguage={detectLanguage(content)}
        language={detectLanguage(content)}
        theme="vs-dark"
        value={content}
        options={{
          minimap: { enabled: false },
          fontSize: 14,
          lineHeight: 1.5,
          formatOnPaste: true,
          formatOnType: true,
          automaticLayout: true,
          wordWrap: 'on',
          scrollBeyondLastLine: false,
          smoothScrolling: true,
          tabSize: 2,
        }}
      />
    </div>
  );
};

export default CodeEditor;