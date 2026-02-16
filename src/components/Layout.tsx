import React from 'react';

interface LayoutProps {
  children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  return (
    <div className="min-h-screen bg-dungeon-darker text-dungeon-light">
      <header className="bg-dungeon-dark shadow-md">
        <div className="container mx-auto px-4 py-4">
          <h1 className="text-2xl font-bold text-dungeon-accent">2d6 Dungeon Helper</h1>
        </div>
      </header>
      
      <main className="container mx-auto px-4 py-6">
        {children}
      </main>
      
      <footer className="bg-dungeon-dark py-4 mt-8">
        <div className="container mx-auto px-4 text-center text-sm text-dungeon-light/70">
          <p>2d6 Dungeon Helper &copy; {new Date().getFullYear()}</p>
        </div>
      </footer>
    </div>
  );
};

export default Layout;
