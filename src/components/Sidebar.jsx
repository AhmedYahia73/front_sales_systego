import React from 'react';
import { NavLink } from 'react-router-dom';
import { 
  Heart, Calendar, Target, CheckCircle, 
  TrendingUp, Award, Shield, UserCog, LayoutDashboard, Menu 
} from 'lucide-react';
import { useGet } from '@/hooks/useGet';

const menuItems = [
  { name: 'Dashboard', path: '/home', icon: <LayoutDashboard size={20} /> },
//   { name: 'Wish List', path: '/wishlist', icon: <Heart size={20} /> },
  { name: 'Visits', path: '/visits', icon: <Calendar size={20} />, dataKey: 'visitCount' },
  { name: 'Sales', path: '/sales', icon: <TrendingUp size={20} />, dataKey: 'salesCount' },
  { name: 'Wish List', path: '/wishlist', icon: <Heart size={20} /> },
//   { name: 'Targets', path: '/targets', icon: <Target size={20} /> },
//   { name: 'Visit Status', path: '/visit-status', icon: <CheckCircle size={20} /> },
//   { name: 'Sales', path: '/sales', icon: <TrendingUp size={20} /> },
//   { name: 'Leaders', path: '/leaders', icon: <Award size={20} /> },
//   { name: 'Auth', path: '/auth', icon: <Shield size={20} /> },
//   { name: 'Admins', path: '/admins', icon: <UserCog size={20} /> },
];

export const Sidebar = ({ isOpen, toggleSidebar }) => {
  
  const { data, loading } = useGet('/api/admin/visits/report');
  return (
    <aside className={`h-screen bg-white dark:bg-zinc-900 border-r border-zinc-200 dark:border-zinc-800 flex flex-col fixed left-0 top-0 transition-all duration-300 ${isOpen ? 'w-64' : 'w-20'}`}>
      
      {/* زر التبديل واللوجو */}
      <div className="p-6 flex items-center justify-between cursor-pointer" onClick={toggleSidebar}>
        {isOpen ? (
          <h1 className="text-xl font-bold text-primary truncate">Systego Sales</h1>
        ) : (
          <div className="w-full flex justify-center text-primary">
            <Menu size={24} />
          </div>
        )}
      </div>
      
      <nav className="flex-1 px-4 space-y-1 overflow-y-auto">
        {menuItems.map((item) => {
          // في حالة وجود قائمة فرعية (Children)
          if (item.children) {
            return (
              <div key={item.name} className="flex flex-col">
                {/* الزر الرئيسي لـ Requests */}
                <button
                  onClick={toggleRequestsMenu}
                  title={!isOpen ? item.name : ""}
                  className="w-full flex items-center justify-between px-4 py-3 rounded-lg text-zinc-600 dark:text-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors"
                >
                  <div className="flex items-center gap-3">
                    {item.icon}
                    {isOpen && <span className="font-medium">{item.name}</span>}
                  </div>
                  {isOpen && (
                    <ChevronDown
                      size={18}
                      className={`transition-transform duration-200 ${isRequestsOpen ? 'rotate-180' : ''}`}
                    />
                  )}
                </button>

                {/* العناصر الفرعية داخل Requests */}
                {isOpen && isRequestsOpen && (
                  <div className="ml-4 pl-2 border-l-2 border-zinc-200 dark:border-zinc-800 space-y-1 mt-1">
                    {item.children.map((subItem) => {
                      const badgeCount = subItem.dataKey && data?.data ? data.data[subItem.dataKey] : null;

                      return (
                        <NavLink
                          key={subItem.name}
                          to={subItem.path}
                          className={({ isActive }) =>
                            `flex items-center gap-3 px-3 py-2 rounded-lg text-sm transition-colors ${
                              isActive
                                ? 'bg-primary/10 text-primary font-medium'
                                : 'text-zinc-600 dark:text-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-800'
                            }`
                          }
                        >
                          {subItem.icon}
                          <div className="flex flex-1 items-center justify-between truncate">
                            <span>{subItem.name}</span>
                            {badgeCount !== null && badgeCount !== undefined && (
                              <span className="bg-primary text-white text-xs font-bold px-2 py-0.5 rounded-full">
                                {loading ? '...' : badgeCount}
                              </span>
                            )}
                          </div>
                        </NavLink>
                      );
                    })}
                  </div>
                )}
              </div>
            );
          }

          // العناصر العادية بدون Sub-menu
          const badgeCount = item.dataKey && data?.data ? data.data[item.dataKey] : null;

          return (
            <NavLink
              key={item.name}
              to={item.path}
              title={!isOpen ? item.name : ""}
              className={({ isActive }) =>
                `flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                  isActive
                    ? 'bg-primary/10 text-primary font-medium'
                    : 'text-zinc-600 dark:text-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-800'
                }`
              }
            >
              {item.icon}

              {isOpen && (
                <div className="flex flex-1 items-center justify-between truncate">
                  <span>{item.name}</span>

                  {badgeCount !== null && badgeCount !== undefined && (
                    <span className="bg-primary text-white text-xs font-bold px-2 py-0.5 rounded-full">
                      {loading ? '...' : badgeCount}
                    </span>
                  )}
                </div>
              )}
            </NavLink>
          );
        })}
      </nav>
    </aside>
  );
};