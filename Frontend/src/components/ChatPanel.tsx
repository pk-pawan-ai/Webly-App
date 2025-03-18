
import React, { useState, useRef, useEffect } from 'react';
import { Send, User, Bot, FileText, Folder } from 'lucide-react';
import { Textarea } from '@/components/ui/textarea';

interface Message {
  id: string;
  content: string;
  sender: 'user' | 'ai';
  timestamp: Date;
  fileActions?: FileAction[];
}

interface FileAction {
  type: 'create' | 'modify' | 'delete';
  path: string;
  fileType: 'file' | 'folder';
}

interface ChatPanelProps {
  initialPrompt?: string;
}

export const ChatPanel: React.FC<ChatPanelProps> = ({ initialPrompt }) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);
  
  // Initialize with the initial prompt if provided
  useEffect(() => {
    if (initialPrompt) {
      const initialMessages: Message[] = [
        {
          id: '1',
          content: initialPrompt,
          sender: 'user',
          timestamp: new Date(),
        },
        {
          id: '2',
          content: `I'll help you create that. I've set up the project structure and written the initial code.`,
          sender: 'ai',
          timestamp: new Date(),
          fileActions: [
            { type: 'create', path: 'src/components/App.jsx', fileType: 'file' },
            { type: 'create', path: 'src/components/Navbar.jsx', fileType: 'file' },
            { type: 'create', path: 'src/styles/main.css', fileType: 'file' },
            { type: 'create', path: 'src/index.js', fileType: 'file' }
          ]
        },
      ];
      setMessages(initialMessages);
    }
  }, [initialPrompt]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      content: input,
      sender: 'user',
      timestamp: new Date(),
    };

    setMessages((prevMessages) => [...prevMessages, userMessage]);
    setInput('');

    // Simulate AI response with file actions
    setTimeout(() => {
      const aiMessage: Message = {
        id: (Date.now() + 1).toString(),
        content: `I've updated the code based on your request.`,
        sender: 'ai',
        timestamp: new Date(),
        fileActions: [
          { type: 'modify', path: 'src/components/App.jsx', fileType: 'file' },
          { type: 'create', path: 'src/components/Button.jsx', fileType: 'file' }
        ]
      };
      setMessages((prevMessages) => [...prevMessages, aiMessage]);
    }, 1000);
    
    // Focus back on the input after sending
    setTimeout(() => {
      inputRef.current?.focus();
    }, 0);
  };
  
  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    // Submit on Enter without Shift
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage(e);
    }
  };

  const getFileIcon = (fileType: 'file' | 'folder') => {
    return fileType === 'file' ? <FileText size={14} className="text-blue-400" /> : <Folder size={14} className="text-yellow-400" />;
  };

  return (
    <div className="flex flex-col h-full bg-sidebar">
      <div className="flex items-center justify-between p-4 border-b border-sidebar-border">
        <h2 className="text-lg font-semibold text-sidebar-foreground">Chat</h2>
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-4 scrollbar-none">
        {messages.map((message) => (
          <div
            key={message.id}
            className={`flex ${
              message.sender === 'user' ? 'justify-end' : 'justify-start'
            }`}
          >
            <div
              className={`max-w-[85%] p-3 rounded-lg ${
                message.sender === 'user'
                  ? 'bg-sidebar-primary text-sidebar-primary-foreground rounded-tr-none'
                  : 'bg-sidebar-accent text-sidebar-accent-foreground rounded-tl-none'
              } animate-fade-in`}
            >
              <div className="flex items-center space-x-2 mb-1">
                {message.sender === 'ai' ? (
                  <Bot size={16} className="text-sidebar-primary" />
                ) : (
                  <User size={16} />
                )}
                <span className="text-xs opacity-70">
                  {message.timestamp.toLocaleTimeString([], {
                    hour: '2-digit',
                    minute: '2-digit',
                  })}
                </span>
              </div>
              <p className="text-sm">{message.content}</p>
              
              {/* File changes section */}
              {message.fileActions && message.fileActions.length > 0 && (
                <div className="mt-3 pt-3 border-t border-sidebar-border/30">
                  <div className="text-xs font-medium mb-1 opacity-70">Files modified:</div>
                  <ul className="space-y-1.5">
                    {message.fileActions.map((action, index) => (
                      <li key={index} className="flex items-center text-xs gap-1.5">
                        {getFileIcon(action.fileType)}
                        <span className={`px-1.5 py-0.5 rounded text-[10px] ${
                          action.type === 'create' 
                            ? 'bg-green-500/20 text-green-300' 
                            : action.type === 'modify'
                              ? 'bg-yellow-500/20 text-yellow-300'
                              : 'bg-red-500/20 text-red-300'
                        }`}>
                          {action.type}
                        </span>
                        <span className="opacity-90 font-mono">{action.path}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>

      <form onSubmit={handleSendMessage} className="p-4 border-t border-sidebar-border">
        <div className="relative">
          <Textarea
            ref={inputRef}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Type your message..."
            className="w-full p-3 pr-10 min-h-[60px] max-h-[120px] bg-sidebar-accent text-sidebar-foreground rounded-md border border-sidebar-border focus:outline-none focus:ring-1 focus:ring-sidebar-primary resize-none"
            rows={1}
          />
          <button
            type="submit"
            className="absolute right-3 bottom-3 text-sidebar-foreground hover:text-sidebar-primary transition-colors"
            disabled={!input.trim()}
          >
            <Send size={18} />
          </button>
        </div>
      </form>
    </div>
  );
};
