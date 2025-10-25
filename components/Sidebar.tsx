
import React from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { HomeIcon, PencilIcon, InformationCircleIcon } from '@heroicons/react/24/outline';

const Sidebar: React.FC = () => {
  const location = useLocation();
  const isEditorActive = location.pathname.startsWith('/editor');

  const navItems = [
    { name: 'Home', href: '/', icon: HomeIcon, active: location.pathname === '/' },
    { name: 'Editor', href: '#', icon: PencilIcon, active: isEditorActive, disabled: !isEditorActive },
    { name: 'About', href: '/about', icon: InformationCircleIcon, active: location.pathname === '/about' },
  ];

  return (
    <aside className="hidden md:flex flex-col w-64 bg-base-100 border-r border-base-300">
      <div className="flex items-center justify-center h-16 border-b border-base-300">
        <h1 className="text-2xl font-bold text-primary">DotStudio</h1>
      </div>
      <nav className="flex-1 p-4">
        <ul>
          {navItems.map((item) => (
            <li key={item.name}>
              <NavLink
                to={item.disabled ? '#' : item.href}
                className={({ isActive }) =>
                  `flex items-center p-3 my-1 rounded-lg transition-colors
                  ${(item.active)
                    ? 'bg-blue-100 text-primary'
                    : 'text-text-secondary hover:bg-base-300 hover:text-text-primary'}
                  ${item.disabled ? 'opacity-50 cursor-not-allowed' : ''}`
                }
              >
                <item.icon className="h-6 w-6 mr-3" />
                {item.name}
              </NavLink>
            </li>
          ))}
        </ul>
      </nav>
    </aside>
  );
};

export default Sidebar;
