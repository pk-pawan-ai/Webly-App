import { FileOrFolderProps } from "../../types/types";


export const FileOrFolder = ({node, depth, onFileClick, onFolderClick} : FileOrFolderProps ) => {
    
    const icon = node.type === 'folder' ? (node.isOpen ? '📂' : '📁') : '📄';

    return (
        <li>
            <div 
                className="flex items-center hover:bg-gray-700 rounded px-2 py-1 cursor-pointer"
                style={{ marginLeft: `${depth * 1}rem` }}
                onClick={() => node.type === 'folder' ? onFolderClick(node) : onFileClick(node)}
            >
                <span className="mr-2">{icon}</span>
                <span>{node.name}</span>
            </div>
            {node.type === 'folder' && node.isOpen && node.children && (
                <ul>
                    {node.children.map((child, index) => (
                        <FileOrFolder
                            key={index}
                            node={child}
                            depth={depth+1}
                            onFileClick={onFileClick}
                            onFolderClick={onFolderClick}
                        />
                    ))}
                </ul>
            )}
        </li>
    );
}