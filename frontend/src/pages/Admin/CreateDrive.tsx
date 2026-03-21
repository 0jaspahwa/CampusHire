import { useState } from "react";
import { Briefcase, AlignLeft, CalendarClock, ArrowRight, Loader2, CheckCircle } from "lucide-react";
import AdminLayout from "../../components/layout/AdminLayout"; 
import { createDrive } from "../../services/adminService";

export default function CreateDrivePage({ onLogout }: { onLogout: () => void }) {
  const [isLoading, setIsLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Form State perfectly matching your backend requirements
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    start_time: "",
    end_time: ""
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    try {
      // 1. Send data to your backend function
      const newDrive = await createDrive(formData);
      
      // 2. Show success state
      setSuccess(true);
      
      // 3. In a real app, you might redirect them to add Rounds now
      // e.g., navigate(`/admin/drives/${newDrive.id}/rounds`);
      
    } catch (err: any) {
      setError(err.response?.data?.error || "Failed to create drive. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  if (success) {
    return (
      <AdminLayout onLogout={onLogout}>
        <div className="flex flex-col items-center justify-center py-32">
          <div className="w-16 h-16 bg-emerald-500/10 rounded-full flex items-center justify-center mb-6">
            <CheckCircle className="w-8 h-8 text-emerald-500" />
          </div>
          <h2 className="text-3xl font-serif text-white mb-2">Drive Created!</h2>
          <p className="text-[#888888] mb-8">The placement drive has been successfully initialized.</p>
          <button 
            onClick={() => setSuccess(false)}
            className="bg-white text-black font-semibold rounded-xl px-8 py-3 hover:bg-gray-200 transition-colors"
          >
            Create Another Drive
          </button>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout onLogout={onLogout}>
      
      <div className="mb-10">
        <h1 className="font-serif text-4xl md:text-5xl text-white mb-4 tracking-tight">
          Initialize Drive
        </h1>
        <p className="text-[#888888] max-w-xl text-sm leading-relaxed">
          Create a new master container for a hiring drive. You can add specific interview rounds (Aptitude, Technical, HR) in the next step.
        </p>
      </div>

      <div className="bg-[#0a0a0a]/80 backdrop-blur-xl border border-white/[0.06] rounded-[24px] overflow-hidden p-8 md:p-10 max-w-3xl">
        
        {error && (
          <div className="mb-6 p-4 bg-red-500/10 border border-red-500/20 rounded-xl text-red-400 text-sm">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-8">
          
          {/* Title */}
          <div className="space-y-2">
            <label className="text-xs text-[#888888] font-medium ml-1 uppercase tracking-wider">Drive Title</label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-[#666666]">
                <Briefcase size={16} />
              </div>
              <input 
                type="text" 
                name="title"
                value={formData.title}
                onChange={handleChange}
                placeholder="e.g. Google Software Engineering 2026" 
                required
                className="w-full bg-[#141414] border border-white/[0.04] rounded-xl pl-11 pr-4 py-3.5 text-white placeholder:text-[#444444] focus:outline-none focus:ring-1 focus:ring-white/20 transition-all text-sm"
              />
            </div>
          </div>

          {/* Description */}
          <div className="space-y-2">
            <label className="text-xs text-[#888888] font-medium ml-1 uppercase tracking-wider">Description</label>
            <div className="relative">
              <div className="absolute top-3.5 left-0 pl-4 pointer-events-none text-[#666666]">
                <AlignLeft size={16} />
              </div>
              <textarea 
                name="description"
                value={formData.description}
                onChange={handleChange}
                placeholder="Enter requirements, eligibility, or role details..." 
                rows={4}
                className="w-full bg-[#141414] border border-white/[0.04] rounded-xl pl-11 pr-4 py-3.5 text-white placeholder:text-[#444444] focus:outline-none focus:ring-1 focus:ring-white/20 transition-all text-sm resize-none"
              />
            </div>
          </div>

          {/* Timing Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            
            <div className="space-y-2">
              <label className="text-xs text-[#888888] font-medium ml-1 uppercase tracking-wider">Start Date & Time</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-[#666666]">
                  <CalendarClock size={16} />
                </div>
                <input 
                  type="datetime-local" 
                  name="start_time"
                  value={formData.start_time}
                  onChange={handleChange}
                  required
                  className="w-full bg-[#141414] border border-white/[0.04] rounded-xl pl-11 pr-4 py-3.5 text-white placeholder:text-[#888888] focus:outline-none focus:ring-1 focus:ring-white/20 transition-all text-sm [color-scheme:dark]"
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-xs text-[#888888] font-medium ml-1 uppercase tracking-wider">End Date & Time</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-[#666666]">
                  <CalendarClock size={16} />
                </div>
                <input 
                  type="datetime-local" 
                  name="end_time"
                  value={formData.end_time}
                  onChange={handleChange}
                  required
                  className="w-full bg-[#141414] border border-white/[0.04] rounded-xl pl-11 pr-4 py-3.5 text-white placeholder:text-[#888888] focus:outline-none focus:ring-1 focus:ring-white/20 transition-all text-sm [color-scheme:dark]"
                />
              </div>
            </div>

          </div>

          {/* Submit Action */}
          <div className="pt-6 flex items-center justify-end border-t border-white/[0.06]">
            <button
              type="submit"
              disabled={isLoading}
              className="bg-white text-black font-semibold rounded-xl px-8 py-3.5 hover:bg-gray-200 transition-colors active:scale-[0.98] text-sm flex items-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed"
            >
              {isLoading ? (
                <><Loader2 size={16} className="animate-spin" /> Initializing...</>
              ) : (
                <>Create Drive <ArrowRight size={16} /></>
              )}
            </button>
          </div>

        </form>

      </div>
    </AdminLayout>
  );
}