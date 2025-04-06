import { useState, useEffect } from 'react';
import { FileExplorerProps, FileSystemNode } from '../../types/types';
import { FileOrFolder } from './FileorFolder';

const FileExplorer = ({onFileSelect, files = []} : FileExplorerProps) => {
  const [fileSystem, setFileSystem] = useState<FileSystemNode[]>([]);

  // Update fileSystem when files prop changes
  useEffect(() => {
    if (files.length > 0) {
      setFileSystem(files);
    }
  }, [files]);

  const handleFileClick = (node: FileSystemNode) => {
    onFileSelect(node);
  };

  const handleFolderClick = (node: FileSystemNode) => {
    const updateNodes = (nodes: FileSystemNode[]): FileSystemNode[] => {
      return nodes.map(n => {
        if (n === node) {
          return { ...n, isOpen: !n.isOpen };
        }
        if (n.children) {
          return { ...n, children: updateNodes(n.children) };
        }
        return n;
      });
    };
    
    setFileSystem(updateNodes(fileSystem));
  };
  
  return (
    <div className="w-[20vw] h-[100vh] bg-[#1A1A2E] text-gray-200 p-4 overflow-auto border-r border-gray-700">
      <div className="text-lg font-semibold mb-4">File Explorer</div>
      <ul className="text-sm space-y-2">
        {fileSystem.map((node, index) => (
          <FileOrFolder
            key={index}
            node={node}
            depth={0}
            onFileClick={handleFileClick}
            onFolderClick={handleFolderClick}
          />
        ))}
      </ul>
    </div>
  );
};

export default FileExplorer;