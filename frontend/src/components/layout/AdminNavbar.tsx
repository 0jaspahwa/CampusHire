// src/components/layout/AdminNavbar.tsx
import { Bell, LogOut, Shield } from "lucide-react";

interface AdminNavbarProps {
  onLogout: () => void;
}

export default function AdminNavbar({ onLogout }: AdminNavbarProps) {
  return (
    <nav className="relative z-10 border-b border-white/[0.06] bg-black/50 backdrop-blur-md">
      <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
        
        {/* Left Side: Brand & Links */}
        <div className="flex items-center gap-12 h-full">
          
          {/* Brand Logo & Name */}
          <div className="flex items-center gap-3">
            <div className="w-6 h-6 bg-emerald-600 rounded flex items-center justify-center">
              <div className="w-3 h-3 bg-white rounded-sm" />
            </div>
            <div className="flex items-center gap-2">
              <span className="font-semibold tracking-[0.1em] uppercase text-sm text-white">
                CAMPUSHIRE
              </span>
              <span className="px-1.5 py-0.5 rounded text-[9px] font-bold tracking-wider bg-white/10 text-[#888888] flex items-center gap-1">
                <Shield size={8} /> ADMIN
              </span>
            </div>
          </div>
          
          {/* Desktop Navigation Links */}
          <div className="hidden md:flex items-center gap-8 h-full">
            <a href="/admin/dashboard" className="text-sm font-medium text-[#888888] hover:text-white transition-colors h-16 flex items-center">
              DASHBOARD
            </a>
            {/* Active Link Example (Blue Border) */}
            <a href="/admin/drives" className="text-sm font-medium text-blue-500 border-b-2 border-blue-500 h-16 flex items-center">
              DRIVES
            </a>
            <a href="/admin/schedule" className="text-sm font-medium text-[#888888] hover:text-white transition-colors h-16 flex items-center">
              SCHEDULE
            </a>
            <a href="/admin/candidates" className="text-sm font-medium text-[#888888] hover:text-white transition-colors h-16 flex items-center">
              CANDIDATES
            </a>
          </div>

        </div>

        {/* Right Side: Notifications & Profile */}
        <div className="flex items-center gap-6">
          
          <button className="text-[#888888] hover:text-white transition-colors">
            <Bell size={18} />
          </button>
          
          <div className="flex items-center gap-3 border-l border-white/[0.06] pl-6">
            
            {/* Admin User Info */}
            <div className="text-right hidden sm:block">
              <div className="text-sm font-medium text-white">Sarah Connor</div>
              <div className="text-xs text-[#888888]">Placement Officer</div>
            </div>
            
            {/* Premium Gold/Amber Avatar for Admins */}
            <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-amber-500 to-orange-500 p-[1px]">
              <div className="w-full h-full rounded-full bg-black border border-black overflow-hidden">
                <img 
                  src="https://api.dicebear.com/7.x/avataaars/svg?seed=Sarah" 
                  alt="Admin Avatar" 
                  className="w-full h-full object-cover" 
                />
              </div>
            </div>
            
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