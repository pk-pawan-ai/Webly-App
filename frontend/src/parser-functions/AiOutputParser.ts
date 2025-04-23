import { FileSystemItem, StepType } from "../types/types.d";

function formatCode(code: string): string {
  try {
    // Remove any leading/trailing whitespace and normalize line endings
    let formattedCode = code.trim().replace(/\r\n/g, '\n');

    // Handle different file types differently
    if (formattedCode.includes('.tsx') || formattedCode.includes('.jsx') || 
        formattedCode.includes('import React') || formattedCode.includes('export default')) {
      // React/TypeScript files
      formattedCode = formatReactCode(formattedCode);
    } else if (formattedCode.includes('"scripts":{') || formattedCode.includes('"dependencies":')) {
      // JSON files
      formattedCode = formatJsonCode(formattedCode);
    } else if (formattedCode.includes('@tailwind') || formattedCode.includes('.css')) {
      // CSS files
      formattedCode = formatCssCode(formattedCode);
    } else if (formattedCode.includes('<!DOCTYPE html>') || formattedCode.includes('<html>')) {
      // HTML files
      formattedCode = formatHtmlCode(formattedCode);
    }

    // Common formatting for all files
    formattedCode = formattedCode
      .split('\n')
      .map(line => {
        // Remove trailing whitespace
        line = line.trim();
        // Convert tabs to spaces (2 spaces per tab)
        line = line.replace(/^\t+/, match => '  '.repeat(match.length));
        // Normalize multiple spaces
        line = line.replace(/\s{2,}/g, ' ');
        return line;
      })
      .join('\n');

    // Remove multiple blank lines
    formattedCode = formattedCode.replace(/\n{3,}/g, '\n\n');
    
    return formattedCode;
  } catch (error) {
    console.error('Error formatting code:', error);
    return code;
  }
}

function formatReactCode(code: string): string {
  return code
    .replace(/([{([])\s+/g, '$1') // Remove space after opening brackets
    .replace(/\s+([})\]])/g, '$1') // Remove space before closing brackets
    .replace(/;\s+}/g, ';}') // Remove space between semicolon and closing brace
    .replace(/{\s+'/g, "{'") // Remove space after opening string interpolation
    .replace(/'\s+}/g, "'}") // Remove space before closing string interpolation
    .replace(/{\s+"/g, '{\"') // Remove space after opening string interpolation with double quotes
    .replace(/"\s+}/g, '\"}') // Remove space before closing string interpolation with double quotes
    .replace(/>\s+</g, '>\n<') // Add newline between JSX elements
    .replace(/([^>])\s+</g, '$1<') // Remove extra spaces before opening JSX tags
    .replace(/>\s+([^<])/g, '>$1') // Remove extra spaces after closing JSX tags
    .split('\n')
    .map(line => {
      // Add semicolons where needed
      if (line.match(/^(import|export|const|let|var).*[^;,{[]$/)) {
        return line + ';';
      }
      return line;
    })
    .join('\n');
}

function formatJsonCode(code: string): string {
  try {
    // Parse and stringify JSON with proper indentation
    return JSON.stringify(JSON.parse(code), null, 2);
  } catch {
    return code;
  }
}

function formatCssCode(code: string): string {
  return code
    .replace(/{\s+/g, ' { ') // Normalize spaces around opening braces
    .replace(/\s+}/g, ' }') // Normalize spaces around closing braces
    .replace(/;\s+/g, ';\n  ') // Add newline after semicolons with indentation
    .replace(/:\s+/g, ': ') // Normalize spaces after colons
    .replace(/,\s+/g, ', '); // Normalize spaces after commas
}

function formatHtmlCode(code: string): string {
  return code
    .replace(/>\s+</g, '>\n<') // Add newline between tags
    .replace(/(<[^/][^>]*>)\s+/g, '$1\n  ') // Add newline and indent after opening tags
    .replace(/\s+(<\/[^>]*>)/g, '\n$1') // Add newline before closing tags
    .replace(/^\s+</gm, '<') // Remove leading spaces before tags
    .replace(/>\s+$/gm, '>'); // Remove trailing spaces after tags
}

export function AiOutputParser(aiOutput: string): FileSystemItem[] {
  const fileSystemData: FileSystemItem[] = [];
  let idCounter = 1;

  // Extract file actions with their content
  const fileRegex = /<boltAction\s+type="file"\s+filePath="([^"]+)">([\s\S]*?)<\/boltAction>/g;
  let match;

  while ((match = fileRegex.exec(aiOutput)) !== null) {
    const [_, filePath, content] = match;
    if (filePath) {
      fileSystemData.push({
        id: idCounter++,
        title: `Create ${filePath}`,
        type: StepType.CreateFile,
        code: formatCode(content),
        description: "",
        status: "pending"
      });
    }
  }

  // Extract shell commands
  const shellRegex = /<boltAction\s+type="shell">([\s\S]*?)<\/boltAction>/g;
  while ((match = shellRegex.exec(aiOutput)) !== null) {
    const command = match[1].trim();
    if (command) {
      fileSystemData.push({
        id: idCounter++,
        title: `Run ${command}`,
        type: StepType.RunShellScript, // Changed from CreateFile to RunShellScript
        code: command,
        description: "",
        status: "pending"
      });
    }
  }

  return fileSystemData;
}