import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Plus, Briefcase, ChevronRight, Calendar, Loader2, AlertCircle } from "lucide-react";
import AdminLayout from "../../components/layout/AdminLayout";
import { getDrives, Drive } from "../../services/adminService";

export default function AdminDrivesPage({ onLogout }: { onLogout: () => void }) {
  const navigate = useNavigate();
  
  const [drives, setDrives] = useState<Drive[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch drives when the page loads
  useEffect(() => {
    const fetchDrives = async () => {
      try {
        const data = await getDrives();
        setDrives(data);
      } catch (err) {
        setError("Failed to load drives from the database.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchDrives();
  }, []);

  // Helper to format dates beautifully (e.g., "Oct 24, 2026")
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  return (
    <AdminLayout onLogout={onLogout}>
      
      {/* Page Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-10">
        <div>
          <h1 className="font-serif text-4xl text-white mb-2 tracking-tight">Placement Drives</h1>
          <p className="text-[#888888] text-sm">Manage all active and upcoming hiring drives.</p>
        </div>
        <button 
          onClick={() => navigate('/admin/drives/create')}
          className="bg-white text-black font-semibold rounded-xl px-6 py-3 hover:bg-gray-200 transition-colors flex items-center gap-2 text-sm shadow-lg shadow-white/10"
        >
          <Plus size={18} /> Initialize New Drive
        </button>
      </div>

      {/* Loading & Error States */}
      {isLoading ? (
        <div className="flex flex-col items-center justify-center py-20">
          <Loader2 className="w-8 h-8 animate-spin text-blue-500 mb-4" />
          <p className="text-[#888888]">Loading drives...</p>
        </div>
      ) : error ? (
        <div className="flex flex-col items-center justify-center py-16 bg-red-500/5 border border-red-500/10 rounded-[24px]">
          <AlertCircle className="w-10 h-10 text-red-500 mb-3" />
          <p className="text-white font-medium">{error}</p>
        </div>
      ) : drives.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 bg-[#0a0a0a]/50 border border-white/[0.04] border-dashed rounded-[24px]">
          <Briefcase className="w-12 h-12 text-[#444444] mb-4" />
          <p className="text-white font-medium mb-1">No drives found</p>
          <p className="text-[#888888] text-sm mb-6">You haven't created any placement drives yet.</p>
          <button 
            onClick={() => navigate('/admin/drives/create')}
            className="text-blue-400 hover:text-blue-300 font-medium text-sm transition-colors"
          >
            + Create your first drive
          </button>
        </div>
      ) : (
        /* The Real Data Table */
        <div className="bg-[#0a0a0a]/80 backdrop-blur-xl border border-white/[0.06] rounded-[24px] overflow-hidden">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-white/[0.06]">
                <th className="py-5 px-6 text-xs font-semibold tracking-wider text-[#666666] uppercase">Drive Name</th>
                <th className="py-5 px-6 text-xs font-semibold tracking-wider text-[#666666] uppercase">Time Window</th>
                <th className="py-5 px-6 text-xs font-semibold tracking-wider text-[#666666] uppercase">Status</th>
                <th className="py-5 px-6 text-xs font-semibold tracking-wider text-[#666666] uppercase text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/[0.06]">
              {drives.map((drive) => (
                <tr 
                  key={drive.id} 
                  onClick={() => navigate(`/admin/drives/${drive.id}`)}
                  className="group hover:bg-white/[0.02] transition-colors cursor-pointer"
                >
                  <td className="py-4 px-6">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-[#141414] border border-white/[0.06] flex items-center justify-center text-[#888888] group-hover:text-blue-400 transition-colors">
                        <Briefcase size={18} />
                      </div>
                      <div className="flex flex-col">
                        <span className="font-medium text-white group-hover:text-blue-400 transition-colors">{drive.title}</span>
                      </div>
                    </div>
                  </td>
                  <td className="py-4 px-6 text-sm text-[#888888]">
                    <div className="flex items-center gap-2">
                      <Calendar size={14} /> 
                      {formatDate(drive.start_time)} — {formatDate(drive.end_time)}
                    </div>
                  </td>
                  <td className="py-4 px-6">
                    {/* Fallback status if your DB doesn't provide one */}
                    <span className="inline-flex px-2 py-1 rounded text-[10px] font-bold tracking-wider border bg-emerald-500/10 text-emerald-400 border-emerald-500/20">
                      {drive.status || "ACTIVE"}
                    </span>
                  </td>
                  <td className="py-4 px-6 text-right">
                    <button className="text-[#666666] group-hover:text-white transition-colors">
                      <ChevronRight size={20} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

    </AdminLayout>
  );
}