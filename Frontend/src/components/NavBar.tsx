
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Menu, X } from 'lucide-react';
import { useIsMobile } from '@/hooks/use-mobile';

export const NavBar: React.FC = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const isMobile = useIsMobile();

  useEffect(() => {
    const handleScroll = () => {
      const offset = window.scrollY;
      setIsScrolled(offset > 50);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled ? 'bg-background/90 backdrop-blur-md shadow-md' : 'bg-transparent'
      }`}
    >
      <div className="container mx-auto px-6 py-4">
        <div className="flex items-center justify-between">
          <Link to="/" className="flex items-center space-x-2">
            <span className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-500">
              webly
            </span>
          </Link>

          {isMobile ? (
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="p-2 rounded-md text-foreground hover:bg-secondary transition-colors"
              aria-label="Toggle menu"
            >
              {isMobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
          ) : (
            <nav className="flex items-center space-x-8">
              <NavLinks />
            </nav>
          )}
        </div>

        {/* Mobile menu */}
        {isMobile && isMobileMenuOpen && (
          <div className="mt-4 py-4 border-t border-border/20 animate-slide-down">
            <nav className="flex flex-col space-y-4">
              <NavLinks isMobile={true} />
            </nav>
          </div>
        )}
      </div>
    </header>
  );
};

const NavLinks: React.FC<{ isMobile?: boolean }> = ({ isMobile }) => {
  const linkClasses = `text-muted-foreground hover:text-foreground transition-colors duration-200 ${
    isMobile ? 'text-base py-2' : 'text-sm'
  }`;

  return (
    <>
      <a href="https://github.com" target="_blank" rel="noopener noreferrer" className={linkClasses}>
        GitHub
      </a>
      <a href="https://docs.com" target="_blank" rel="noopener noreferrer" className={linkClasses}>
        Documentation
      </a>
      <Link to="/workspace" className="bg-primary text-primary-foreground hover:bg-primary/90 px-4 py-2 rounded-md text-sm font-medium transition-colors">
        Launch Webly
      </Link>
    </>
  );
};
