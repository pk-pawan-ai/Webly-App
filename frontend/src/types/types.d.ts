import { ReactNode } from "react";

export interface InputProps {
    ids: keyof idSection;
    placeholder: keyof placeholderObjsTypes;    
    onChange ?: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
}

export interface idSection {
    1: string;
    2: string;
}

export interface placeholderObjsTypes {
    var1 : string;
    var2: string;
}

export interface ButtonProps {
    variant : "primary" | "secondary" ;
    startIcon ?: ReactNode;
    text?: string;
    endIcon ?: ReactNode;
    onClick ?: () => void;
    disabled ?: boolean;
};

export interface variantClassesTypes {
    primary : string;
    secondary : string;
}

export interface FileSystem {
    [key: string]: string;
}

export enum StepType {
    CreateFile,
    CreateFolder,
    EditFile,
    DeleteFile,
    RunShellScript
}
export interface FileSystemItem {
    id: number;
    type: StepType;
    title: string; 
    description: string;
    code : string;
    status: "pending" | "in progress" | "completed";
    children?: FileSystemItem[]; // the children will have similar structure as FileSystemItem interface 
}

export interface PromptTypes {
    prompts : string[];
    uiPrompt : string;
}

export interface ChatResTypes {
    data : object;
    aiOutput : string;
}

export interface Message {
    id : string;
    content : string;
    isUser : boolean;
    timestamp : Date;
}

export interface FileSystemNode {
    name : string;
    type : 'file' | 'folder';
    content ?: string; 
    children ?: FileSystemNode[]; 
    isOpen ?: boolean; 
}

export interface FileOrFolderProps {
    node : FileSystemNode;
    depth : number;
    onFileClick : (node : FileSystemNode) => void;
    onFolderClick : (node : FileSystemNode) => void; 
}

export interface CodeEditorProps {
    content : string;
}

export interface FileExplorerProps {
    onFileSelect : (node: FileSystemNode) => void;
    files?: FileSystemNode[];
}

export interface ChatSectionProps {
    aiResponse : string;
    isLoading : boolean;
}

export interface ToggleButtonProps {
    currentView: 'code' | 'preview';
    onToggle: (view: 'code' | 'preview') => void;
}