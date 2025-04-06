import { FileSystemItem, StepType } from "../types/types.d";

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
                code: content.trim(), // Store the file content
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
                type: StepType.CreateFile,
                code: command,
                description: "",
                status: "pending"
            });
        }
    }

    return fileSystemData;
}