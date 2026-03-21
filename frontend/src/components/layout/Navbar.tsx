import { Bell, LogOut } from "lucide-react";
import { NavLink } from "react-router-dom";

interface NavbarProps {
  onLogout: () => void;
}

export default function Navbar({ onLogout }: NavbarProps) {
  return (
    <nav className="relative z-10 border-b border-white/[0.06] bg-black/50 backdrop-blur-md">
      <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
        
        {/* Left Side: Brand & Links */}
        <div className="flex items-center gap-12 h-full">
          
          {/* Brand Logo & Name */}
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 bg-blue-600 rounded flex items-center justify-center">
              <div className="w-3 h-3 bg-white rounded-sm" />
            </div>
            <span className="font-semibold tracking-[0.1em] uppercase text-sm text-white">
              CAMPUSHIRE
            </span>
          </div>
          
          {/* Desktop Navigation Links */}
          <div className="hidden md:flex items-center gap-8 h-full">

            <NavLink
              to="/"
              className={({ isActive }) =>
                `text-sm font-medium h-16 flex items-center transition-colors ${
                  isActive
                    ? "text-blue-500 border-b-2 border-blue-500"
                    : "text-[#888888] hover:text-white"
                }`
              }
            >
              LIVE SLOTS
            </NavLink>

            <NavLink
              to="/drives"
              className={({ isActive }) =>
                `text-sm font-medium h-16 flex items-center transition-colors ${
                  isActive
                    ? "text-blue-500 border-b-2 border-blue-500"
                    : "text-[#888888] hover:text-white"
                }`
              }
            >
              DRIVES
            </NavLink>

            <NavLink
              to="/results"
              className={({ isActive }) =>
                `text-sm font-medium h-16 flex items-center transition-colors ${
                  isActive
                    ? "text-blue-500 border-b-2 border-blue-500"
                    : "text-[#888888] hover:text-white"
                }`
              }
            >
              RESULTS
            </NavLink>

          </div>

        </div>

        {/* Right Side: Notifications & Profile */}
        <div className="flex items-center gap-6">
          
          <button className="text-[#888888] hover:text-white transition-colors">
            <Bell size={18} />
          </button>
          
          <div className="flex items-center gap-3 border-l border-white/[0.06] pl-6">
            
            {/* User Info (Hidden on very small screens) */}
            <div className="text-right hidden sm:block">
              <div className="text-sm font-medium text-white">Ojas</div>
              <div className="text-xs text-[#888888]">B.Tech CS</div>
            </div>
            
            {/* Gradient Avatar */}
            <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-blue-500 to-purple-500 p-[1px]">
              <div className="w-full h-full rounded-full bg-black border border-black overflow-hidden">
                <img 
                  src="https://api.dicebear.com/7.x/avataaars/svg?seed=Alex" 
                  alt="Avatar" 
                  className="w-full h-full object-cover" 
                />
              </div>
            </div>
            
            {/* Logout Button */}
            <button 
              onClick={onLogout} 
              className="text-[#888888] hover:text-white transition-colors ml-2"
              title="Log out"
            >
              <LogOut size={18} />
            </button>

          </div>
        </div>

      </div>
    </nav>
  );
}