
import React from "react";
import InterviewerNavbar from "./InterviewerNavbar";

interface InterviewerLayoutProps {
  children: React.ReactNode;
  onLogout: () => void;
}

export default function InterviewerLayout({ children, onLogout }: InterviewerLayoutProps) {
  return (
    <div className="min-h-screen bg-black font-sans text-white selection:bg-white/20 relative">
      
      {/* Background atmospheric gradients */}
      <div className="fixed bottom-0 left-0 right-0 h-[55vh] bg-gradient-to-t from-[#2a2a2a] via-[#0a0a0a] to-transparent pointer-events-none z-0" />
      <div className="fixed bottom-0 left-0 right-0 h-[30vh] bg-gradient-to-t from-[#4a4a4a]/30 to-transparent blur-3xl pointer-events-none z-0" />

      {/* Interviewer Navbar */}
      <InterviewerNavbar onLogout={onLogout} />

      {/* Main content area */}
      <main className="relative z-10 max-w-7xl mx-auto px-6 py-12">
        {children}
      </main>

    </div>
  );
}