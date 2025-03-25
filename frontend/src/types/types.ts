
export interface FileSystemItem {
    type: 'file' | 'folder';
    name: string; 
    path: string; 
    content?: string;  // stores the code inside file
    children?: FileSystemItem[]; // the children will have similar structure as FileSystemItem interface 
}