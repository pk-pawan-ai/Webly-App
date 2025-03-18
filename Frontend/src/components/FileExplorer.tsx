
import React, { useState } from 'react';
import { 
  Folder, File, ChevronRight, ChevronDown, 
  FileCode, FileText, FileImage, Code 
} from 'lucide-react';

interface FileItem {
  id: string;
  name: string;
  type: 'file' | 'folder';
  extension?: string;
  children?: FileItem[];
  isOpen?: boolean;
}

interface FileExplorerProps {
  onFileSelect: (file: FileItem) => void;
}

export const FileExplorer: React.FC<FileExplorerProps> = ({ onFileSelect }) => {
  // Simulate file structure
  const [fileStructure, setFileStructure] = useState<FileItem[]>([
    {
      id: '1',
      name: 'src',
      type: 'folder',
      isOpen: true,
      children: [
        {
          id: '2',
          name: 'components',
          type: 'folder',
          isOpen: true,
          children: [
            { id: '3', name: 'App.jsx', type: 'file', extension: 'jsx' },
            { id: '4', name: 'Navbar.jsx', type: 'file', extension: 'jsx' },
            { id: '5', name: 'Footer.jsx', type: 'file', extension: 'jsx' },
          ],
        },
        {
          id: '6',
          name: 'styles',
          type: 'folder',
          isOpen: false,
          children: [
            { id: '7', name: 'main.css', type: 'file', extension: 'css' },
            { id: '8', name: 'components.css', type: 'file', extension: 'css' },
          ],
        },
        { id: '9', name: 'index.js', type: 'file', extension: 'js' },
        { id: '10', name: 'utils.js', type: 'file', extension: 'js' },
      ],
    },
    {
      id: '11',
      name: 'public',
      type: 'folder',
      isOpen: false,
      children: [
        { id: '12', name: 'index.html', type: 'file', extension: 'html' },
        { id: '13', name: 'favicon.ico', type: 'file', extension: 'ico' },
      ],
    },
    { id: '14', name: 'package.json', type: 'file', extension: 'json' },
    { id: '15', name: 'README.md', type: 'file', extension: 'md' },
  ]);

  const [selectedFile, setSelectedFile] = useState<string | null>(null);

  const toggleFolder = (id: string) => {
    const updateIsOpen = (items: FileItem[]): FileItem[] => {
      return items.map((item) => {
        if (item.id === id) {
          return { ...item, isOpen: !item.isOpen };
        }
        if (item.children) {
          return { ...item, children: updateIsOpen(item.children) };
        }
        return item;
      });
    };

    setFileStructure(updateIsOpen(fileStructure));
  };

  const handleFileSelect = (file: FileItem) => {
    if (file.type === 'file') {
      setSelectedFile(file.id);
      onFileSelect(file);
    }
  };

  const getFileIcon = (extension?: string) => {
    switch (extension) {
      case 'js':
      case 'jsx':
      case 'ts':
      case 'tsx':
        return <FileCode size={16} className="text-yellow-500" />;
      case 'css':
      case 'scss':
        return <FileCode size={16} className="text-blue-500" />;
      case 'html':
        return <Code size={16} className="text-orange-500" />;
      case 'md':
        return <FileText size={16} className="text-green-500" />;
      case 'jpg':
      case 'png':
      case 'gif':
      case 'ico':
        return <FileImage size={16} className="text-purple-500" />;
      default:
        return <File size={16} className="text-gray-400" />;
    }
  };

  const renderFileTree = (items: FileItem[], level = 0) => {
    return items.map((item) => (
      <div key={item.id} style={{ paddingLeft: `${level * 12}px` }}>
        <div
          className={`flex items-center p-1.5 rounded-md cursor-pointer hover:bg-sidebar-accent/50 ${
            selectedFile === item.id ? 'bg-sidebar-accent text-sidebar-accent-foreground' : ''
          }`}
          onClick={() => {
            if (item.type === 'folder') {
              toggleFolder(item.id);
            } else {
              handleFileSelect(item);
            }
          }}
        >
          {item.type === 'folder' ? (
            <>
              <span className="mr-1 text-sidebar-foreground">
                {item.isOpen ? <ChevronDown size={16} /> : <ChevronRight size={16} />}
              </span>
              <Folder
                size={16}
                className={`mr-1.5 ${
                  item.isOpen ? 'text-blue-400' : 'text-yellow-400'
                }`}
              />
            </>
          ) : (
            <span className="ml-4 mr-1.5">{getFileIcon(item.extension)}</span>
          )}
          <span className="text-sm truncate">{item.name}</span>
        </div>
        {item.type === 'folder' && item.isOpen && item.children && (
          <div className="file-tree-children animate-slide-down">
            {renderFileTree(item.children, level + 1)}
          </div>
        )}
      </div>
    ));
  };

  return (
    <div className="flex flex-col h-full bg-sidebar">
      <div className="flex items-center justify-between p-4 border-b border-sidebar-border">
        <h2 className="text-lg font-semibold text-sidebar-foreground">Explorer</h2>
      </div>
      <div className="flex-1 overflow-y-auto p-2 scrollbar-none">
        {renderFileTree(fileStructure)}
      </div>
    </div>
  );
};
