
import React from 'react';
import Sidebar from './Sidebar';
import BottomNav from './BottomNav';

interface LayoutProps {
  children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  return (
    <div className="flex flex-col md:flex-row h-screen w-screen overflow-hidden">
      <Sidebar />
      <main className="flex-1 overflow-auto pb-16 md:pb-0">
        {children}
      </main>
      <BottomNav />
    </div>
  );
};

export default Layout;
