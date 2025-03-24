
import React from 'react';
import { Link, Outlet, useLocation } from 'react-router-dom';
import { BarChart3, Users, FileText, Settings, Bell, Package, Gift, Video, Lightbulb, Layout, PieChart, BadgeCheck, DollarSign, Folder } from 'lucide-react';

const AdminLayout: React.FC = () => {
  const location = useLocation();
  
  const menuItems = [
    { title: 'Dashboard', icon: <BarChart3 className="w-5 h-5" />, path: '/admin' },
    { title: 'Orders', icon: <FileText className="w-5 h-5" />, path: '/admin/orders' },
    { title: 'Editor Assignment', icon: <BadgeCheck className="w-5 h-5" />, path: '/admin/editor-assignment' },
    { title: 'Quality Control', icon: <Settings className="w-5 h-5" />, path: '/admin/quality-control' },
    { title: 'Notifications', icon: <Bell className="w-5 h-5" />, path: '/admin/notifications' },
    { title: 'Users', icon: <Users className="w-5 h-5" />, path: '/admin/users' },
    { title: 'Editors', icon: <Users className="w-5 h-5" />, path: '/admin/editors' },
    { title: 'Add-On Services', icon: <Package className="w-5 h-5" />, path: '/admin/add-ons' },
    { title: 'Job Folders', icon: <Folder className="w-5 h-5" />, path: '/admin/job-folders' },
    { title: 'Discounts', icon: <Gift className="w-5 h-5" />, path: '/admin/discounts' },
    { title: 'Payments', icon: <DollarSign className="w-5 h-5" />, path: '/admin/payments' },
    { title: 'Tutorials', icon: <Video className="w-5 h-5" />, path: '/admin/tutorials' },
    { title: 'Smart Suggestions', icon: <Lightbulb className="w-5 h-5" />, path: '/admin/suggestions' },
    { title: 'Floorplans', icon: <Layout className="w-5 h-5" />, path: '/admin/floorplans' },
    { title: 'Reports', icon: <PieChart className="w-5 h-5" />, path: '/admin/reports' },
  ];
  
  return (
    <div className="flex h-screen bg-[#0A0A14] text-white">
      {/* Sidebar */}
      <div className="w-64 border-r border-white/10 bg-black/30 overflow-y-auto">
        <div className="p-4 border-b border-white/10">
          <Link to="/admin" className="flex items-center space-x-2">
            <img src="/assets/camera-icon.svg" alt="HomeSnap Pro" className="w-6 h-6" />
            <span className="text-xl font-bold gradient-text">HomeSnap Admin</span>
          </Link>
        </div>
        
        <nav className="p-4 space-y-1">
          {menuItems.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              className={`flex items-center space-x-2 p-2 rounded-lg transition-all ${
                location.pathname === item.path
                  ? 'bg-white/10 text-white'
                  : 'hover:bg-white/5 text-white/70'
              }`}
            >
              {item.icon}
              <span>{item.title}</span>
            </Link>
          ))}
        </nav>
      </div>
      
      {/* Main content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        <header className="bg-black/40 border-b border-white/10 p-4">
          <div className="flex items-center justify-between">
            <h1 className="text-2xl font-semibold">
              {menuItems.find(item => item.path === location.pathname)?.title || 'Admin Panel'}
            </h1>
            <div className="flex items-center space-x-4">
              <button className="p-2 rounded-full hover:bg-white/5">
                <Bell className="w-5 h-5" />
              </button>
              <div className="h-8 w-8 rounded-full bg-gradient-to-r from-primary to-secondary flex items-center justify-center">
                <span className="text-xs font-bold">A</span>
              </div>
            </div>
          </div>
        </header>
        
        <main className="flex-1 overflow-y-auto p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;
