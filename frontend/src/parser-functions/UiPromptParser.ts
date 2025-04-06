import { FileSystemItem, StepType } from "../types/types.d";


// parses uiPrompt to ts
export function UiPromptParser(response: string): FileSystemItem[] {
  const fileSystemData: FileSystemItem[] = [];
  let idCounter = 1; // Initialize an ID counter

  // Split the input string into individual file entries
  const fileEntries = response.split("\n\n");

  // Iterate through each file entry
  fileEntries.forEach((entry) => {
      // Extract the file name and content
      const [fileName, fileContent] = entry.split(":\n```\n");
      if (fileName && fileContent){
        // Add a new file system item to the array
        fileSystemData.push({
          id: idCounter++, // Assign and increment the ID
          title: `Create ${fileName}`,
          type: StepType.CreateFile,
          code: fileContent.replace("\n```", ""), // Remove the trailing "\n```" from the content
          description: "", // Add any necessary description
          status: "pending", // Set the initial status
        });
      }
  });

  return fileSystemData;
}