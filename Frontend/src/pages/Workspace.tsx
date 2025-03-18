
import React, { useState } from 'react';
import { useLocation } from 'react-router-dom';
import { ResizableHandle, ResizablePanel, ResizablePanelGroup } from '@/components/ui/resizable';
import { ChatPanel } from '@/components/ChatPanel';
import { FileExplorer } from '@/components/FileExplorer';
import { CodeEditor } from '@/components/CodeEditor';

interface FileItem {
  id: string;
  name: string;
  type: 'file' | 'folder';
  extension?: string;
}

const Workspace = () => {
  const location = useLocation();
  const initialPrompt = location.state?.prompt || '';
  const [selectedFile, setSelectedFile] = useState<FileItem | null>(null);

  const handleFileSelect = (file: FileItem) => {
    setSelectedFile(file);
  };

  return (
    <div className="h-screen bg-background overflow-hidden">
      <ResizablePanelGroup direction="horizontal">
        <ResizablePanel defaultSize={25} minSize={20} maxSize={40} className="h-screen">
          <ChatPanel initialPrompt={initialPrompt} />
        </ResizablePanel>
        
        <ResizableHandle withHandle />
        
        <ResizablePanel defaultSize={25} minSize={15} maxSize={30}>
          <FileExplorer onFileSelect={handleFileSelect} />
        </ResizablePanel>
        
        <ResizableHandle withHandle />
        
        <ResizablePanel defaultSize={50}>
          <CodeEditor selectedFile={selectedFile} />
        </ResizablePanel>
      </ResizablePanelGroup>
    </div>
  );
};

export default Workspace;
