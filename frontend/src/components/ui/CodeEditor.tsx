import Editor from '@monaco-editor/react';
import { CodeEditorProps } from '../../types/types';

const CodeEditor = ({content} : CodeEditorProps) => {
  return (
    <div className="w-[100vw] h-80vh bg-[#1E1E2F]">
      <div className='text-2xl p-2.5 text-white font-semibold'>
        Code Editor
      </div>
      <Editor
        height="100vh"
        defaultLanguage="typescript"
        theme="vs-dark"
        value={content}
      />
    </div>
  );
};

export default CodeEditor;