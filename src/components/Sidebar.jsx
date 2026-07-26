import React from 'react';
import { NavLink } from 'react-router-dom';
import { 
  Heart, Calendar, Target, CheckCircle, 
  TrendingUp, Award, Shield, UserCog, LayoutDashboard, Menu 
} from 'lucide-react';

const menuItems = [
  { name: 'Dashboard', path: '/home', icon: <LayoutDashboard size={20} /> },
//   { name: 'Wish List', path: '/wishlist', icon: <Heart size={20} /> },
  { name: 'Visits', path: '/visits', icon: <Calendar size={20} /> },
  { name: 'Wish List', path: '/wishlist', icon: <Heart size={20} /> },
//   { name: 'Targets', path: '/targets', icon: <Target size={20} /> },
//   { name: 'Visit Status', path: '/visit-status', icon: <CheckCircle size={20} /> },
//   { name: 'Sales', path: '/sales', icon: <TrendingUp size={20} /> },
//   { name: 'Leaders', path: '/leaders', icon: <Award size={20} /> },
//   { name: 'Auth', path: '/auth', icon: <Shield size={20} /> },
//   { name: 'Admins', path: '/admins', icon: <UserCog size={20} /> },
];

export const Sidebar = ({ isOpen, toggleSidebar }) => {
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
        {menuItems.map((item) => (
          <NavLink
            key={item.name}
            to={item.path}
            title={!isOpen ? item.name : ""} // يظهر الاسم عند الوقوف بالفارة في حالة التصغير
            className={({ isActive }) =>
              `flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                isActive 
                  ? 'bg-primary/10 text-primary font-medium' 
                  : 'text-zinc-600 dark:text-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-800'
              }`
            }
          >
            {item.icon}
            {/* إخفاء النص عند التصغير */}
            {isOpen && <span className="truncate">{item.name}</span>}
          </NavLink>
        ))}
      </nav>
    </aside>
  );
};