import { useEffect, useRef, useState } from "react";
import CodeEditor from "../components/ui/CodeEditor";
import FileExplorer from "../components/ui/FileExplorer";
import { BACKEND_URL } from "../utils/config";
import { useLocation } from "react-router-dom";
import { ChatResTypes, FileSystemNode, PromptTypes } from "../types/types";
import axios from "axios";
import ChatSection from "../components/ui/ChatSection";
import { UiPromptParser } from "../parser-functions/UiPromptParser";
import { AiOutputParser } from "../parser-functions/AiOutputParser";
import Preview from "../components/ui/Preview";
import { ToggleButton } from "../components/ui/ToggleButton";

const Workspace = () => {
  const [aiResponse, setAiResponse] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [selectedFileContent, setSelectedFileContent] = useState<string>("");
  const [fileSystem, setFileSystem] = useState<FileSystemNode[]>([]);
  const [currentView, setCurrentView] = useState<'code' | 'preview'>('code');
  const initRef = useRef(false);

  const location = useLocation();
  // Get both userPrompt and aiOutput from navigation state
  const userPrompt = location.state?.userPrompt || "";

  const handleFileSelect = (node : FileSystemNode) => {
    if (node.type === 'file' && node.content) {
      setSelectedFileContent(node.content);
    };
  };

  // Helper function to create file system structure
  const createFileSystemStructure = (files: { title: string, code: string }[]) => {
  const fileSystem: FileSystemNode[] = [];
  const folderMap = new Map<string, FileSystemNode>();

  files.forEach(file => {
    const path = file.title.replace('Create ', '').split('/');
    const fileName = path[path.length - 1];
    const folders = path.slice(0, -1);

    let currentLevel = fileSystem;
    let currentPath = '';

    // Create folders if they don't exist
    folders.forEach(folder => {
      currentPath += folder + '/';
      if (!folderMap.has(currentPath)) {
        const newFolder: FileSystemNode = {
          name: folder,
          type: 'folder',
          isOpen: true,
          children: []
        };
        folderMap.set(currentPath, newFolder);
        currentLevel.push(newFolder);
      }
      const folderNode = folderMap.get(currentPath);
      currentLevel = folderNode!.children!;
    });

    // Add file
    currentLevel.push({
      name: fileName,
      type: 'file',
      content: file.code,
      isOpen: false
    });
    });

    return fileSystem;

  };

  async function init() {
    try {
      setIsLoading(true);
      const response = await axios.post<PromptTypes>(`${BACKEND_URL}/api/template`, {
        userPrompt: userPrompt
      });
  
      const parsedFiles = UiPromptParser(response.data.uiPrompt);
      const {prompts, uiPrompt} = response.data;
      const chatRes = await axios.post<ChatResTypes>(`${BACKEND_URL}/api/chat`, {
        message: [...prompts, uiPrompt]
      });
  
      const aiOutput = chatRes.data.aiOutput;
      const parsedAiOutput = AiOutputParser(aiOutput);
  
      // Separate files and commands
      const fileSteps = parsedAiOutput.filter(item => !item.title.startsWith('Run '));
      const commandSteps = parsedAiOutput.filter(item => item.title.startsWith('Run '));
  
      // Filter out duplicate files from template files
      const uniqueTemplateFiles = parsedFiles.filter(file => {
        const fileName = file.title.replace('Create ', '');
        return !fileSteps.some(aiFile => 
          aiFile.title.replace('Create ', '') === fileName
        );
      });
  
      // Create file system structure only with files (no commands)
      const fileSystemStructure = createFileSystemStructure([...uniqueTemplateFiles, ...fileSteps]);
      setFileSystem(fileSystemStructure);
  
      // Show all steps (including commands) in chat
      const allSteps = [...uniqueTemplateFiles, ...fileSteps, ...commandSteps]
        .map(file => file.title)
        .join('\n');
      
      const formattedSteps = `Creating files:\n✓ ${allSteps.split('\n').join('\n✓ ')}`;
      setAiResponse(formattedSteps);
  
    } catch (error) {
      console.error(`The error is ${error}`);
    } finally {
      setIsLoading(false);
    }
  }

  useEffect(() => {
    if (!initRef.current) {
      init();
      initRef.current=true;
    }
  },[userPrompt]);

  return (
    <div className="h-[110vh] w-[100vw] bg-slate-900">
      <div className="flex h-[100vh]">
        <ChatSection 
          aiResponse={aiResponse} 
          isLoading={isLoading}
        />
        <FileExplorer onFileSelect={handleFileSelect} files={fileSystem} />
        <div className="flex flex-col w-[55vw] h-[100vh]">
          <div className="p-4">
            <ToggleButton 
                currentView={currentView}
                onToggle={setCurrentView}
              />
          </div>
          <div className="flex">
            {currentView === 'code' ? (
              <CodeEditor content={selectedFileContent}/>
            ) : (
              <Preview />
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Workspace;