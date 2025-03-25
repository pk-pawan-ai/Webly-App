import { FileSystemItem } from "./types/types";

function cleanXMLContent(input: string): string {
  const match = input.match(/<boltArtifact[\s\S]*?<\/boltArtifact>/);
  if (!match) return '';
  
  let xml = match[0];
  
  // Clean up the XML content
  return xml
    .replace(/\n(?=[^<]*>)/g, '')
    .replace(/\s+/g, ' ')
    .replace(/(\w+)\s*=\s*"/g, '$1="')
    .replace(/>\s+</g, '><')
    .trim();
}

function printFileSystemTree(fileSystemData: FileSystemItem[]): void {
  function printItem(item: FileSystemItem, indent: string = '') {
    if (isFolder(item)) {
      console.log(`${indent}📁 ${item.name}/`);
      item.children.forEach(child => printItem(child, indent + '  '));
    } else {
      console.log(`${indent}📄 ${item.name}`);
    }
  }

  fileSystemData.forEach(item => printItem(item));
}

export function parseAIOutput(aiOutput: string): FileSystemItem[] {
  try {
    const cleanedXML = cleanXMLContent(aiOutput);
    if (!cleanedXML) {
      console.error('No valid XML content found');
      return [];
    }

    const fileSystemData: FileSystemItem[] = [];
    const parser = new DOMParser();
    
    const xmlDoc = parser.parseFromString(cleanedXML, 'text/html');
    const fileActions = xmlDoc.querySelectorAll('boltAction[type="file"]');
    console.log(`Found ${fileActions.length} file actions`);

    fileActions.forEach((action) => {
      const filePath = action.getAttribute('filePath') || '';
      const code = action.textContent?.trim();

      if (!filePath || !code) {
        console.error('Invalid file action:', { filePath, hasCode: !!code });
        return;
      }

      const pathParts = filePath.split('/');
      let currentFolder = fileSystemData;

      // Handle root-level files
      if (pathParts.length === 1) {
        currentFolder.push({
          type: 'file',
          name: filePath,
          path: filePath,
          content: code
        });
        return;
      }

      // Process folders
      for (let i = 0; i < pathParts.length - 1; i++) {
        const part = pathParts[i];
        if (!part) continue;

        let folder = currentFolder.find(
          item => item.type === 'folder' && item.name === part
        ) as FileSystemItem | undefined;

        if (!folder) {
          folder = {
            type: 'folder',
            name: part,
            path: pathParts.slice(0, i + 1).join('/'),
            children: []
          };
          currentFolder.push(folder);
        }

        currentFolder = folder.children || [];
      }

      // Add the file
      const fileName = pathParts[pathParts.length - 1];
      if (fileName) {
        currentFolder.push({
          type: 'file',
          name: fileName,
          path: filePath,
          content: code
        });
      }
    });

    // Debug output
    console.log('Parsed file system:', JSON.stringify(fileSystemData, null, 2));
    console.log('File System Structure:');
    printFileSystemTree(fileSystemData);

    return fileSystemData;

  } catch (error) {
    console.error('Error parsing AI output:', error);
    return [];
  }
}

function isFolder(item: FileSystemItem): item is FileSystemItem & { children: FileSystemItem[] } {
  return item.type === 'folder' && Array.isArray((item as any).children);
}