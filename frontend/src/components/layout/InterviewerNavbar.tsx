// src/components/layout/InterviewerNavbar.tsx
import { Bell, LogOut, Briefcase } from "lucide-react";

interface InterviewerNavbarProps {
  onLogout: () => void;
}

export default function InterviewerNavbar({ onLogout }: InterviewerNavbarProps) {
  return (
    <nav className="relative z-10 border-b border-white/[0.06] bg-black/50 backdrop-blur-md">
      <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
        
        {/* Left Side: Brand & Links */}
        <div className="flex items-center gap-12 h-full">
          
          <div className="flex items-center gap-3">
            <div className="w-6 h-6 bg-emerald-600 rounded flex items-center justify-center">
              <div className="w-3 h-3 bg-white rounded-sm" />
            </div>
            <div className="flex items-center gap-2">
              <span className="font-semibold tracking-[0.1em] uppercase text-sm text-white">
                CAMPUSHIRE
              </span>
              <span className="px-1.5 py-0.5 rounded text-[9px] font-bold tracking-wider bg-blue-500/10 text-blue-400 flex items-center gap-1">
                <Briefcase size={8} /> INTERVIEWER
              </span>
            </div>
          </div>
          
          <div className="hidden md:flex items-center gap-8 h-full">
            <a href="/interviewer/dashboard" className="text-sm font-medium text-blue-500 border-b-2 border-blue-500 h-16 flex items-center">
              MY SCHEDULE
            </a>
            <a href="#" className="text-sm font-medium text-[#888888] hover:text-white transition-colors h-16 flex items-center">
              EVALUATIONS
            </a>
          </div>

        </div>

        {/* Right Side: Notifications & Profile */}
        <div className="flex items-center gap-6">
          <button className="text-[#888888] hover:text-white transition-colors">
            <Bell size={18} />
          </button>
          
          <div className="flex items-center gap-3 border-l border-white/[0.06] pl-6">
            <div className="text-right hidden sm:block">
              <div className="text-sm font-medium text-white">HR Panel</div>
              <div className="text-xs text-[#888888]">Technical Interviewer</div>
            </div>
            
            {/* Blue Avatar for Interviewers */}
            <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-blue-500 to-cyan-500 p-[1px]">
              <div className="w-full h-full rounded-full bg-black border border-black overflow-hidden">
                <img 
                  src="https://api.dicebear.com/7.x/avataaars/svg?seed=Felix" 
                  alt="Interviewer Avatar" 
                  className="w-full h-full object-cover" 
                />
              </div>
            </div>
            
            <button onClick={onLogout} className="text-[#888888] hover:text-white transition-colors ml-2" title="Log out">
              <LogOut size={18} />
            </button>
          </div>
        </div>

      </div>
    </nav>
  );
}