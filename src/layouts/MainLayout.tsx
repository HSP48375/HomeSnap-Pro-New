import React from 'react';
import { Outlet } from 'react-router-dom';
import { 
  LayoutDashboard, 
  Upload, 
  FileBox, 
  User, 
  Video,
  Layers
} from 'lucide-react';
import { Link, NavLink } from 'react-router-dom';

const MainLayout = ({ isAdmin = false }) => {
  const navLinkClass = ({ isActive }: { isActive: boolean }) => 
    `flex items-center space-x-2 px-4 py-2 rounded-lg transition-all duration-200 nav-item ${
      isActive 
        ? 'bg-white/10 text-white' 
        : 'text-white/70 hover:text-white hover:bg-white/5'
    }`;

  return (
    <div className="min-h-screen bg-dark">
      {/* Floating Navigation Bar */}
      <nav className="fixed top-4 left-1/2 transform -translate-x-1/2 z-50 bg-black/50 backdrop-blur-lg rounded-full border border-white/10 shadow-xl">
        <div className="px-4 py-2">
          <div className="flex items-center space-x-2">
            <NavLink to="/dashboard" className={navLinkClass}>
              <LayoutDashboard className="h-5 w-5" />
              <span>Dashboard</span>
            </NavLink>
            <NavLink to="/upload" className={navLinkClass}>
              <Upload className="h-5 w-5" />
              <span>Upload</span>
            </NavLink>
            <NavLink to="/orders" className={navLinkClass}>
              <FileBox className="h-5 w-5" />
              <span>Orders</span>
            </NavLink>
            <NavLink to="/floorplan" className={navLinkClass}>
              <Layers className="h-5 w-5" />
              <span>Floorplan</span>
            </NavLink>
            <NavLink to="/tutorials" className={navLinkClass}>
              <Video className="h-5 w-5" />
              <span>Tutorials</span>
            </NavLink>
            <NavLink to="/profile" className={navLinkClass}>
              <User className="h-5 w-5" />
              <span>Profile</span>
            </NavLink>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="pt-20 pb-8">
        <Outlet />
      </main>
    </div>
  );
};

export default MainLayout;