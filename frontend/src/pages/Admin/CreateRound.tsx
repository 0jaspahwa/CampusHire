import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { ListOrdered, Layers, CalendarClock, ArrowRight, CheckCircle, Loader2, MonitorSmartphone, Timer } from "lucide-react";
import AdminLayout from "../../components/layout/AdminLayout"; 
import { createRound } from "../../services/adminService"; 

export default function CreateRoundPage({ onLogout }: { onLogout: () => void }) {
  // Grab the driveId from the URL (e.g., /admin/drives/123-abc/rounds/create)
  const { driveId } = useParams<{ driveId: string }>(); 
  const navigate = useNavigate();

  const [isLoading, setIsLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Form state perfectly matching your backend expectations
  const [formData, setFormData] = useState({
    sequenceNumber: 1,
    type: "TECHNICAL", 
    mode: "ONLINE", // Added Mode
    slotDurationMins: 30, // Added Slot Duration
    startTime: "",
    endTime: ""
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData({ 
      ...formData, 
      // Ensure numbers stay as numbers for the database
      [name]: name === "sequenceNumber" || name === "slotDurationMins" ? Number(value) : value 
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!driveId) {
      setError("Drive ID is missing. Please select a valid drive first.");
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      await createRound(driveId, formData);
      setSuccess(true);
    } catch (err: any) {
      // This will catch that "23505" sequence error you wrote in your backend!
      setError(err.message || "An error occurred while creating the round.");
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
          <h2 className="text-3xl font-serif text-white mb-2">Round {formData.sequenceNumber} Created!</h2>
          <p className="text-[#888888] mb-8">The round configuration has been successfully saved to the database.</p>
          <div className="flex gap-4">
            <button 
              onClick={() => {
                setSuccess(false);
                setFormData({ ...formData, sequenceNumber: formData.sequenceNumber + 1 });
              }}
              className="bg-[#141414] border border-white/[0.06] text-white font-semibold rounded-xl px-6 py-3 hover:bg-white/[0.04] transition-colors"
            >
              Add Round {formData.sequenceNumber + 1}
            </button>
            <button 
              onClick={() => navigate('/admin/dashboard')}
              className="bg-white text-black font-semibold rounded-xl px-6 py-3 hover:bg-gray-200 transition-colors"
            >
              Finish & Return
            </button>
          </div>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout onLogout={onLogout}>
      
      <div className="mb-10">
        <div className="flex items-center gap-3 mb-4">
          <span className="px-2.5 py-1 rounded text-xs font-bold tracking-wider bg-blue-500/10 text-blue-400 border border-blue-500/20 uppercase">
            Step 2 of 2
          </span>
          <span className="text-xs text-[#666666] font-mono tracking-wider">
            DRIVE: {driveId || "UNKNOWN"}
          </span>
        </div>
        <h1 className="font-serif text-4xl md:text-5xl text-white mb-4 tracking-tight">
          Configure Rounds
        </h1>
        <p className="text-[#888888] max-w-xl text-sm leading-relaxed">
          Define the sequence, format, and slot durations for this hiring drive.
        </p>
      </div>

      <div className="bg-[#0a0a0a]/80 backdrop-blur-xl border border-white/[0.06] rounded-[24px] overflow-hidden p-8 md:p-10 max-w-4xl">
        
        {error && (
          <div className="mb-6 p-4 bg-red-500/10 border border-red-500/20 rounded-xl text-red-400 text-sm">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-8">
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            
            {/* Sequence Number */}
            <div className="space-y-2">
              <label className="text-xs text-[#888888] font-medium ml-1 uppercase tracking-wider">Round Sequence</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-[#666666]">
                  <ListOrdered size={16} />
                </div>
                <input 
                  type="number" 
                  name="sequenceNumber"
                  min="1"
                  value={formData.sequenceNumber}
                  onChange={handleChange}
                  required
                  className="w-full bg-[#141414] border border-white/[0.04] rounded-xl pl-11 pr-4 py-3.5 text-white focus:outline-none focus:ring-1 focus:ring-white/20 transition-all text-sm"
                />
              </div>
            </div>

            {/* Round Type */}
            <div className="space-y-2">
              <label className="text-xs text-[#888888] font-medium ml-1 uppercase tracking-wider">Round Type</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-[#666666]">
                  <Layers size={16} />
                </div>
                <select 
                  name="type"
                  value={formData.type}
                  onChange={handleChange}
                  className="w-full bg-[#141414] border border-white/[0.04] rounded-xl pl-11 pr-4 py-3.5 text-white focus:outline-none focus:ring-1 focus:ring-white/20 transition-all text-sm appearance-none"
                >
                  <option value="TECHNICAL">Technical Interview</option>
                  <option value="HR">HR Interview</option>
                  <option value="APTITUDE">Online Assessment</option>
                </select>
              </div>
            </div>

            {/* Mode (ONLINE/OFFLINE) */}
            <div className="space-y-2">
              <label className="text-xs text-[#888888] font-medium ml-1 uppercase tracking-wider">Interview Mode</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-[#666666]">
                  <MonitorSmartphone size={16} />
                </div>
                <select 
                  name="mode"
                  value={formData.mode}
                  onChange={handleChange}
                  className="w-full bg-[#141414] border border-white/[0.04] rounded-xl pl-11 pr-4 py-3.5 text-white focus:outline-none focus:ring-1 focus:ring-white/20 transition-all text-sm appearance-none"
                >
                  <option value="ONLINE">Online (Virtual)</option>
                  <option value="OFFLINE">Offline (In-Person)</option>
                  <option value="HYBRID">Hybrid</option>
                </select>
              </div>
            </div>

            {/* Slot Duration */}
            <div className="space-y-2">
              <label className="text-xs text-[#888888] font-medium ml-1 uppercase tracking-wider">Slot Duration (Mins)</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-[#666666]">
                  <Timer size={16} />
                </div>
                <input 
                  type="number" 
                  name="slotDurationMins"
                  min="5"
                  step="5"
                  value={formData.slotDurationMins}
                  onChange={handleChange}
                  required
                  className="w-full bg-[#141414] border border-white/[0.04] rounded-xl pl-11 pr-4 py-3.5 text-white focus:outline-none focus:ring-1 focus:ring-white/20 transition-all text-sm"
                />
              </div>
            </div>

          </div>

          {/* Timing Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4 border-t border-white/[0.06]">
            
            <div className="space-y-2">
              <label className="text-xs text-[#888888] font-medium ml-1 uppercase tracking-wider">Start Date & Time</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-[#666666]">
                  <CalendarClock size={16} />
                </div>
                <input 
                  type="datetime-local" 
                  name="startTime"
                  value={formData.startTime}
                  onChange={handleChange}
                  required
                  className="w-full bg-[#141414] border border-white/[0.04] rounded-xl pl-11 pr-4 py-3.5 text-white focus:outline-none focus:ring-1 focus:ring-white/20 transition-all text-sm [color-scheme:dark]"
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
                  name="endTime"
                  value={formData.endTime}
                  onChange={handleChange}
                  required
                  className="w-full bg-[#141414] border border-white/[0.04] rounded-xl pl-11 pr-4 py-3.5 text-white focus:outline-none focus:ring-1 focus:ring-white/20 transition-all text-sm [color-scheme:dark]"
                />
              </div>
            </div>

          </div>

          {/* Submit Action */}
          <div className="pt-6 flex items-center justify-between border-t border-white/[0.06]">
            <span className="text-xs text-[#666666]">
              Your backend automatically checks for duplicate sequences.
            </span>
            <button
              type="submit"
              disabled={isLoading}
              className="bg-white text-black font-semibold rounded-xl px-8 py-3.5 hover:bg-gray-200 transition-colors active:scale-[0.98] text-sm flex items-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed"
            >
              {isLoading ? (
                <><Loader2 size={16} className="animate-spin" /> Saving...</>
              ) : (
                <>Save Round <ArrowRight size={16} /></>
              )}
            </button>
          </div>

        </form>

      </div>
    </AdminLayout>
  );
}