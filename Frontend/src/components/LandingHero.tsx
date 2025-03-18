
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowRight, Code, FileCode } from 'lucide-react';

export const LandingHero: React.FC = () => {
  const navigate = useNavigate();
  const [prompt, setPrompt] = useState('');
  const [isTyping, setIsTyping] = useState(true);
  const [currentTextIndex, setCurrentTextIndex] = useState(0);
  const placeholderTexts = [
    'Create a React todo app with local storage',
    'Build a responsive landing page with Tailwind',
    'Generate a dark mode dashboard with charts',
    'Make a markdown editor with preview'
  ];

  // Typewriter effect
  useEffect(() => {
    let isMounted = true;
    let typingTimeout: NodeJS.Timeout;
    let erasingTimeout: NodeJS.Timeout;
    
    // Only run the typewriter effect if isTyping is true
    if (!isTyping) {
      return () => {
        isMounted = false;
        clearTimeout(typingTimeout);
        clearTimeout(erasingTimeout);
      };
    }
    
    const typeText = () => {
      const currentPlaceholder = placeholderTexts[currentTextIndex];
      let charIndex = 0;

      const type = () => {
        if (!isMounted) return;
        
        if (charIndex <= currentPlaceholder.length) {
          setPrompt(currentPlaceholder.substring(0, charIndex));
          charIndex++;
          typingTimeout = setTimeout(type, 70);
        } else {
          // Pause before erasing
          erasingTimeout = setTimeout(startErasing, 2000);
        }
      };

      type();
    };

    const startErasing = () => {
      if (!isMounted) return;
      
      let currentPlaceholder = placeholderTexts[currentTextIndex];
      let charIndex = currentPlaceholder.length;

      const erase = () => {
        if (!isMounted) return;
        
        if (charIndex >= 0) {
          setPrompt(currentPlaceholder.substring(0, charIndex));
          charIndex--;
          typingTimeout = setTimeout(erase, 40);
        } else {
          // Move to next text after erasing
          setCurrentTextIndex((prevIndex) => (prevIndex + 1) % placeholderTexts.length);
          // Start typing next text
          typingTimeout = setTimeout(typeText, 500);
        }
      };

      erase();
    };

    // Start the typewriter effect
    typeText();

    return () => {
      isMounted = false;
      clearTimeout(typingTimeout);
      clearTimeout(erasingTimeout);
    };
  }, [currentTextIndex, placeholderTexts, isTyping]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (prompt.trim()) {
      // Navigate to workspace with the prompt
      navigate('/workspace', { state: { prompt } });
    }
  };

  const handlePromptChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setIsTyping(false); // Stop the typewriter effect when user starts typing
    setPrompt(e.target.value);
  };

  const handleFocus = () => {
    setIsTyping(false); // Stop the typewriter effect when user focuses on the input
  };

  return (
    <section className="min-h-screen flex flex-col items-center justify-center px-4 relative">
      {/* Background gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-background via-background to-secondary/30 -z-10" />
      
      {/* Animated blobs */}
      <div className="absolute top-1/4 left-1/4 w-72 h-72 bg-blue-500/10 rounded-full filter blur-3xl animate-pulse opacity-20" />
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-purple-500/10 rounded-full filter blur-3xl animate-pulse opacity-20" />

      <div className="max-w-4xl w-full text-center space-y-8 animate-slide-up">
        <div className="space-y-2">
          <h1 className="text-4xl md:text-6xl font-bold tracking-tight">
            Your Code, Our Intelligence
          </h1>
          <p className="text-xl md:text-2xl text-muted-foreground mt-4">
            Build web applications instantly with Webly AI
          </p>
        </div>

        <form onSubmit={handleSubmit} className="w-full max-w-3xl mx-auto mt-8">
          <div className="flex flex-col md:flex-row space-y-4 md:space-y-0 md:space-x-2">
            <div className="relative flex-1 min-h-16">
              <input
                type="text"
                className="w-full h-16 px-6 py-4 bg-secondary/80 backdrop-blur-sm border border-border rounded-xl shadow-xl focus:outline-none focus:ring-2 focus:ring-blue-500/50 text-foreground placeholder-muted-foreground transition-all"
                placeholder="Describe your project..."
                value={prompt}
                onChange={handlePromptChange}
                onFocus={handleFocus}
              />
              {isTyping && <span className="typing-cursor absolute top-1/2 transform -translate-y-1/2" style={{ left: `${prompt.length * 0.6 + 24}px` }}></span>}
            </div>
            <button
              type="submit"
              className="h-16 px-8 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-medium flex items-center justify-center space-x-2 shadow-lg hover:shadow-blue-500/20 hover:scale-[1.02] active:scale-[0.98] transition-all"
            >
              <span>Generate</span>
              <ArrowRight size={16} />
            </button>
          </div>
        </form>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-12">
          <FeatureCard
            icon={<Code size={24} />}
            title="AI Code Generation"
            description="Generate complete, working code snippets based on simple text prompts."
          />
          <FeatureCard
            icon={<FileCode size={24} />}
            title="Smart File Structure"
            description="Webly automatically organizes your code into a logical file structure."
          />
          <FeatureCard
            icon={<Code size={24} />}
            title="Real-time Preview"
            description="See your application come to life as the code is generated."
          />
        </div>
      </div>
    </section>
  );
};

interface FeatureCardProps {
  icon: React.ReactNode;
  title: string;
  description: string;
}

const FeatureCard: React.FC<FeatureCardProps> = ({ icon, title, description }) => {
  return (
    <div className="p-6 rounded-xl bg-secondary/50 border border-border/50 backdrop-blur-sm hover:shadow-lg hover:shadow-blue-500/5 hover:translate-y-[-2px] transition-all duration-300">
      <div className="rounded-full bg-primary/10 w-12 h-12 flex items-center justify-center text-primary mb-4">
        {icon}
      </div>
      <h3 className="text-lg font-semibold mb-2">{title}</h3>
      <p className="text-muted-foreground">{description}</p>
    </div>
  );
};
