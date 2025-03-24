import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { 
  LayoutDashboard, 
  FileText, 
  Users, 
  CheckSquare,
  User,
  LogOut,
  BellRing,
  PenTool,
  PackagePlus,
  FolderKanban,
  Ticket,
  CreditCard,
  Video,
  MessageSquare,
  Layers,
  BarChart4
} from 'lucide-react';

const AdminLayout: React.FC = () => {
  const location = useLocation();

  const menuItems = [
    { title: 'Dashboard', path: '/admin', icon: <LayoutDashboard className="w-5 h-5" /> },
    { title: 'Order Management', path: '/admin/orders', icon: <FileText className="w-5 h-5" /> },
    { title: 'Editor Assignment', path: '/admin/editor-assignment', icon: <Users className="w-5 h-5" /> },
    { title: 'Quality Control', path: '/admin/quality-control', icon: <CheckSquare className="w-5 h-5" /> },
    { title: 'User Management', path: '/admin/users', icon: <User className="w-5 h-5" /> },
    { title: 'Notifications', path: '/admin/notifications', icon: <BellRing className="w-5 h-5" /> },
    { title: 'Editor Management', path: '/admin/editor-management', icon: <PenTool className="w-5 h-5" /> },
    { title: 'Add-On Services', path: '/admin/add-on-management', icon: <PackagePlus className="w-5 h-5" /> },
    { title: 'Job Folders', path: '/admin/job-folders', icon: <FolderKanban className="w-5 h-5" /> },
    { title: 'Discounts & Coupons', path: '/admin/discounts', icon: <Ticket className="w-5 h-5" /> },
    { title: 'Payment Dashboard', path: '/admin/payments', icon: <CreditCard className="w-5 h-5" /> },
    { title: 'Tutorials', path: '/admin/tutorials', icon: <Video className="w-5 h-5" /> },
    { title: 'Smart Suggestions', path: '/admin/suggestions', icon: <MessageSquare className="w-5 h-5" /> },
    { title: 'Floorplan Manager', path: '/admin/floorplans', icon: <Layers className="w-5 h-5" /> },
    { title: 'Reports', path: '/admin/reports', icon: <BarChart4 className="w-5 h-5" /> },
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