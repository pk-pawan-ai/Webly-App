
import React from 'react';
import { NavBar } from '@/components/NavBar';
import { LandingHero } from '@/components/LandingHero';

const Index = () => {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <NavBar />
      <main>
        <LandingHero />
      </main>
    </div>
  );
};

export default Index;
