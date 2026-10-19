import React from 'react';
import { NavLink } from 'react-router-dom';
import { 
  Heart, Calendar, Target, CheckCircle, 
  TrendingUp, Award, Shield, UserCog, LayoutDashboard, Menu, Contact, X
} from 'lucide-react';
import { useGet } from '@/hooks/useGet';
import { brandConfig } from '@/utils/brand';

const menuItems = [
  { name: 'Dashboard', path: '/home', icon: <LayoutDashboard size={20} /> },
  { name: 'Leads', path: '/leads', icon: <Contact size={20} />, dataKey: 'leadsCount' },
  { name: 'Visits', path: '/visits', icon: <Calendar size={20} />, dataKey: 'visitCount' },
  { name: 'Sales', path: '/sales', icon: <TrendingUp size={20} />, dataKey: 'salesCount' },
  { name: 'Wish List', path: '/wishlist', icon: <Heart size={20} /> },
];

export const Sidebar = ({ 
  isOpen, 
  toggleSidebar, 
  isDesktopExpanded, 
  isMobileOpen = false, 
  closeMobileSidebar 
}) => {
  const isExpanded = isDesktopExpanded !== undefined ? isDesktopExpanded : isOpen;
  const { data, loading } = useGet('/api/admin/visits/report');

  const handleNavClick = () => {
    if (closeMobileSidebar) {
      closeMobileSidebar();
    }
  };

  return (
    <aside 
      className={`h-screen bg-white dark:bg-zinc-900 border-r border-zinc-200 dark:border-zinc-800 flex flex-col fixed left-0 top-0 transition-all duration-300 z-50 ${
        isMobileOpen ? 'translate-x-0 w-64 shadow-2xl' : '-translate-x-full'
      } lg:translate-x-0 ${isExpanded ? 'lg:w-64' : 'lg:w-20'}`}
    >
      {/* Header: Brand title / toggle / mobile close */}
      <div className="p-4 sm:p-5 flex items-center justify-between border-b border-zinc-100 dark:border-zinc-800 lg:border-b-0">
        <div 
          className="flex items-center gap-3 cursor-pointer flex-1 min-w-0" 
          onClick={toggleSidebar}
        >
          <h1 className={`text-xl font-bold text-primary truncate ${isExpanded ? 'block' : 'block lg:hidden'}`}>
            {brandConfig.appTitle}
          </h1>
          <div className={`w-full justify-center text-primary ${isExpanded ? 'hidden' : 'hidden lg:flex'}`}>
            <Menu size={24} />
          </div>
        </div>

        {/* Mobile Close Button */}
        {closeMobileSidebar && (
          <button
            type="button"
            onClick={closeMobileSidebar}
            className="lg:hidden p-1.5 rounded-lg text-zinc-500 hover:text-zinc-800 hover:bg-zinc-100 dark:hover:bg-zinc-800 dark:hover:text-zinc-200 transition-colors"
            aria-label="Close Sidebar"
          >
            <X size={20} />
          </button>
        )}
      </div>
      
      <nav className="flex-1 px-3 sm:px-4 py-2 space-y-1 overflow-y-auto">
        {menuItems.map((item) => {
          const badgeCount = item.dataKey && data?.data ? data.data[item.dataKey] : null;

          return (
            <NavLink
              key={item.name}
              to={item.path}
              title={!isExpanded ? item.name : ""}
              onClick={handleNavClick}
              className={({ isActive }) =>
                `flex items-center gap-3 px-3.5 py-2.5 rounded-lg transition-colors ${
                  isActive
                    ? 'bg-primary/10 text-primary font-medium'
                    : 'text-zinc-600 dark:text-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-800'
                }`
              }
            >
              {item.icon}

              <div className={`flex flex-1 items-center justify-between truncate ${isExpanded ? 'flex' : 'flex lg:hidden'}`}>
                <span>{item.name}</span>

                {badgeCount !== null && badgeCount !== undefined && (
                  <span className="bg-primary text-primary-foreground text-xs font-bold px-2 py-0.5 rounded-full">
                    {loading ? '...' : badgeCount}
                  </span>
                )}
              </div>
            </NavLink>
          );
        })}
      </nav>
    </aside>
  );
};