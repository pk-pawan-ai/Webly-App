import { FileSystemItem, StepType } from "../types/types.d";

export function UiPromptParser(response: string): FileSystemItem[] {
  const fileSystemData: FileSystemItem[] = [];
  let idCounter = 1;

  const fileBlockRegex = /([^:\n]+):\n```(?:\w+)?\n([\s\S]*?)```/g;

  let match;
  while ((match = fileBlockRegex.exec(response)) !== null) {
    const [_, fileName, fileContent] = match;
    
    const cleanFileName = fileName.trim();
    let cleanContent = fileContent
      .replace(/\\n/g, '\n') 
      .replace(/^\s+|\s+$/g, '') 
      .replace(/\r\n/g, '\n') 
      .replace(/\n{3,}/g, '\n\n'); 

    if (cleanFileName.endsWith('.config.ts') || 
        cleanFileName.endsWith('.config.js') || 
        cleanFileName.endsWith('.json')) {
      cleanContent = cleanContent
        .replace(/\\\"/g, '"') 
        .replace(/\\n/g, '\n');
    }

    fileSystemData.push({
      id: idCounter++,
      title: `Create ${cleanFileName}`,
      type: StepType.CreateFile,
      code: cleanContent,
      description: `Creating ${cleanFileName} file`,
      status: "pending"
    });
  }

  // Debug logging
  console.log('Parsed files:', fileSystemData.map(f => ({
    title: f.title,
    contentPreview: f.code.slice(0, 100)
  })));

  return fileSystemData;
}