import React, { useState } from 'react';
import { Eye, EyeOff } from 'lucide-react';

import { loginUser } from '../services/authService';

export default function LoginPage() {
  const [role, setRole] = useState<'Student' | 'Recruiter' | 'Admin'>('Student');
  const [showPassword, setShowPassword] = useState(false);

  return (
    <div className="min-h-screen bg-black flex items-center justify-center p-4 font-sans text-white relative overflow-hidden selection:bg-white/20">

      <div className="absolute bottom-0 left-0 right-0 h-[55vh] bg-gradient-to-t from-[#2a2a2a] via-[#0a0a0a] to-transparent pointer-events-none" />
      <div className="absolute bottom-0 left-0 right-0 h-[30vh] bg-gradient-to-t from-[#4a4a4a]/30 to-transparent blur-3xl pointer-events-none" />
      
      <div className="absolute top-8 left-8 text-xs font-semibold tracking-[0.2em] uppercase text-white/90">
        CAMPUSHIRE®
      </div>

      <div className="relative w-full max-w-[420px] bg-[#0a0a0a] border border-white/[0.06] rounded-[32px] p-10 shadow-2xl shadow-black/50 z-10">
        

        <div className="flex justify-center mb-8">
          <div className="grid grid-cols-3 gap-1.5">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="w-2.5 h-2.5 bg-white rounded-full" />
            ))}
          </div>
        </div>

        {/* Headings */}
        <div className="text-center mb-8">
          <h1 className="font-serif text-3xl md:text-[32px] text-white mb-3 tracking-tight">
            Welcome to CampusHire
          </h1>
          <p className="text-[#888888] text-sm">
            Sign in to your account
          </p>
        </div>

        {/* Role Selector */}
        <div className="flex p-1 bg-[#141414] rounded-full mb-8 border border-white/[0.04]">
          {['Student', 'Recruiter', 'Admin'].map((r) => (
            <button
              key={r}
              onClick={() => setRole(r as any)}
              className={`flex-1 py-2.5 text-sm font-medium rounded-full transition-all duration-200 ${
                role === r 
                  ? 'bg-[#222222] text-white shadow-sm' 
                  : 'text-[#888888] hover:text-white hover:bg-white/[0.02]'
              }`}
            >
              {r}
            </button>
          ))}
        </div>

        {/* Form */}
        <form className="space-y-4" onSubmit={(e) => e.preventDefault()}>
          <div>
            <input
              type="email"
              placeholder="Email"
              className="w-full bg-[#141414] border border-white/[0.04] rounded-xl px-4 py-3.5 text-white placeholder:text-[#666666] focus:outline-none focus:ring-1 focus:ring-white/20 transition-all text-sm"
            />
          </div>
          <div className="relative">
            <input
              type={showPassword ? "text" : "password"}
              placeholder="Password"
              className="w-full bg-[#141414] border border-white/[0.04] rounded-xl px-4 py-3.5 text-white placeholder:text-[#666666] focus:outline-none focus:ring-1 focus:ring-white/20 transition-all text-sm"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-4 top-1/2 -translate-y-1/2 text-[#666666] hover:text-white transition-colors"
            >
              {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
            </button>
          </div>

          {/* Terms */}
          <div className="pt-4 pb-2 text-center">
            <p className="text-[#666666] text-xs leading-relaxed">
              By continuing, you agree to our<br />
              <a href="#" className="text-[#888888] hover:text-white transition-colors">Terms</a> and <a href="#" className="text-[#888888] hover:text-white transition-colors">Privacy Policy</a>
            </p>
          </div>


          <button
            type="submit"
            className="w-full bg-white text-black font-semibold rounded-full py-3.5 mt-2 hover:bg-gray-100 transition-colors active:scale-[0.98] text-sm"
          >
            Continue
          </button>
        </form>
      </div>
    </div>
  );
}
