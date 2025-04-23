import { FileSystemItem, StepType } from "../types/types.d";

export function UiPromptParser(response: string): FileSystemItem[] {
  const fileSystemData: FileSystemItem[] = [];
  let idCounter = 1;

  // Improved regex to handle both fenced and unfenced code blocks
  const fileBlockRegex = /([^:\n]+):\n```(?:\w+)?\n([\s\S]*?)```/g;

  let match;
  while ((match = fileBlockRegex.exec(response)) !== null) {
    const [_, fileName, fileContent] = match;
    
    // Clean up the file name and content
    const cleanFileName = fileName.trim();
    let cleanContent = fileContent
      .replace(/\\n/g, '\n') // Convert escaped newlines to actual newlines
      .replace(/^\s+|\s+$/g, '') // Trim whitespace
      .replace(/\r\n/g, '\n') // Normalize line endings
      .replace(/\n{3,}/g, '\n\n'); // Reduce multiple newlines

    // Handle special case for configuration files
    if (cleanFileName.endsWith('.config.ts') || 
        cleanFileName.endsWith('.config.js') || 
        cleanFileName.endsWith('.json')) {
      cleanContent = cleanContent
        .replace(/\\\"/g, '"') // Fix escaped quotes
        .replace(/\\n/g, '\n'); // Fix escaped newlines
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