
import React from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { HomeIcon, PencilIcon, InformationCircleIcon } from '@heroicons/react/24/solid';

const BottomNav: React.FC = () => {
  const location = useLocation();
  const isEditorActive = location.pathname.startsWith('/editor');

  const navItems = [
    { name: 'Home', href: '/', icon: HomeIcon, active: location.pathname === '/' },
    { name: 'Editor', href: '#', icon: PencilIcon, active: isEditorActive, disabled: !isEditorActive },
    { name: 'About', href: '/about', icon: InformationCircleIcon, active: location.pathname === '/about' },
  ];

  return (
    <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-base-100 border-t border-base-300 flex justify-around p-2 z-50">
      {navItems.map((item) => (
        <NavLink
          key={item.name}
          to={item.disabled ? '#' : item.href}
          className={({ isActive }) =>
            `flex flex-col items-center w-full p-2 rounded-lg
            ${item.active ? 'text-primary' : 'text-text-secondary'}
            ${item.disabled ? 'opacity-50 cursor-not-allowed' : 'hover:bg-base-300'}`
          }
        >
          <item.icon className="h-6 w-6" />
          <span className="text-xs">{item.name}</span>
        </NavLink>
      ))}
    </nav>
  );
};

export default BottomNav;
