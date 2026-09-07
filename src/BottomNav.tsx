import { NavLink, useLocation } from 'react-router-dom';
import { Search, Heart, Ticket, DollarSign, User } from 'lucide-react';

interface BottomNavProps {
  t: (key: string) => string;
}

export function BottomNav({ t }: BottomNavProps) {
  const location = useLocation();
  const currentPath = location.pathname;

  // Don't show bottom nav on certain pages
  if (currentPath.includes('/ticket/') || currentPath.includes('/transfer/')) return null;

  const navItems = [
    { path: '/discover', label: t('discover'), icon: Search },
    { path: '/favorites', label: 'For You', icon: Heart },
    { path: '/my-tickets', label: 'My Tickets', icon: Ticket },
    { path: '/sell', label: 'Sell', icon: DollarSign },
    { path: '/account', label: t('account'), icon: User },
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 z-[100] safe-area-bottom">
      <div className="flex justify-around items-center h-16">
        {navItems.map((item) => {
          const isActive = currentPath === item.path;
          const Icon = item.icon;
          return (
            <NavLink key={item.path} to={item.path}
              className={`flex flex-col items-center justify-center flex-1 h-full transition-colors ${isActive ? 'text-[#026CDF]' : 'text-gray-500'}`}>
              <Icon size={22} strokeWidth={isActive ? 2.5 : 1.5} className={isActive ? 'text-[#026CDF]' : 'text-gray-400'} />
              <span className={`text-[10px] mt-0.5 ${isActive ? 'font-semibold' : 'font-normal'}`}>{item.label}</span>
            </NavLink>
          );
        })}
      </div>
    </nav>
  );
}
