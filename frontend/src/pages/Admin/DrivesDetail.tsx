import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Plus, Layers, ArrowLeft, Settings, Users, Loader2, AlertCircle } from "lucide-react";
import AdminLayout from "../../components/layout/AdminLayout";
import { getDriveDetails, DriveDetails } from "../../services/adminService";

export default function DriveDetailsPage({ onLogout }: { onLogout: () => void }) {
  const { driveId } = useParams<{ driveId: string }>();
  const navigate = useNavigate();

  const [driveData, setDriveData] = useState<DriveDetails | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchDetails = async () => {
      if (!driveId) return;
      try {
        const data = await getDriveDetails(driveId);
        setDriveData(data);
      } catch (err) {
        setError("Failed to load drive details.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchDetails();
  }, [driveId]);

  if (isLoading) {
    return (
      <AdminLayout onLogout={onLogout}>
        <div className="flex flex-col items-center justify-center py-32">
          <Loader2 className="w-8 h-8 animate-spin text-blue-500 mb-4" />
          <p className="text-[#888888]">Loading drive command center...</p>
        </div>
      </AdminLayout>
    );
  }

  if (error || !driveData) {
    return (
      <AdminLayout onLogout={onLogout}>
        <div className="flex flex-col items-center justify-center py-32">
          <AlertCircle className="w-12 h-12 text-red-500 mb-4" />
          <h2 className="text-xl font-bold text-white mb-2">Drive Not Found</h2>
          <p className="text-[#888888] mb-6">{error || "The requested drive does not exist."}</p>
          <button onClick={() => navigate('/admin/drives')} className="text-blue-400 hover:underline">
            Return to Drives
          </button>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout onLogout={onLogout}>
      
      {/* Back Button & Header */}
      <button 
        onClick={() => navigate('/admin/drives')}
        className="flex items-center gap-2 text-[#888888] hover:text-white transition-colors text-sm mb-6 w-fit"
      >
        <ArrowLeft size={16} /> Back to Drives
      </button>

      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-10 pb-6 border-b border-white/[0.06]">
        <div>
          <div className="flex items-center gap-3 mb-2">
            <span className="px-2 py-1 rounded text-[10px] font-bold tracking-wider bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
              {driveData.status || "ACTIVE"}
            </span>
            <span className="text-xs text-[#666] font-mono">ID: {driveId}</span>
          </div>
          <h1 className="font-serif text-3xl md:text-4xl text-white tracking-tight">{driveData.title}</h1>
        </div>
        <div className="flex gap-3">
          <button className="p-3 bg-[#141414] border border-white/[0.06] rounded-xl hover:bg-white/[0.04] text-[#888] transition-colors">
            <Settings size={20} />
          </button>
        </div>
      </div>

      {/* Grid Layout for Drive Management */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Left Column: Rounds Manager */}
        <div className="lg:col-span-2 space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-serif text-white flex items-center gap-2">
              <Layers className="text-[#888888]" size={20} /> Interview Rounds
            </h2>
            <button 
              onClick={() => navigate(`/admin/drives/${driveId}/rounds/create`)}
              className="bg-[#141414] border border-white/[0.06] text-white font-semibold rounded-lg px-4 py-2 hover:bg-white/[0.04] transition-colors text-xs flex items-center gap-2"
            >
              <Plus size={14} /> Add Round
            </button>
          </div>

          {!driveData.rounds || driveData.rounds.length === 0 ? (
            <div className="bg-[#0a0a0a]/50 border border-white/[0.04] border-dashed rounded-2xl p-10 flex flex-col items-center text-center">
              <p className="text-[#888888] text-sm mb-4">No rounds configured for this drive yet.</p>
              <button 
                onClick={() => navigate(`/admin/drives/${driveId}/rounds/create`)}
                className="text-blue-400 hover:text-blue-300 font-medium text-sm transition-colors"
              >
                + Create the first round
              </button>
            </div>
          ) : (
            <div className="space-y-3">
              {driveData.rounds.map((round) => (
                <div key={round.id} className="bg-[#141414] border border-white/[0.04] rounded-xl p-5 flex items-center justify-between group hover:border-white/[0.1] transition-colors">
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center font-serif text-white font-bold">
                      {round.sequence_number}
                    </div>
                    <div>
                      <h3 className="text-white font-medium">{round.type}</h3>
                      <p className="text-xs text-[#888888] mt-1">{round.slot_duration_mins} mins • {round.mode}</p>
                    </div>
                  </div>
                  <button className="text-sm text-blue-400 hover:text-blue-300 transition-colors px-3 py-1.5 rounded-lg hover:bg-blue-500/10">
                    Manage Panels
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Right Column: Quick Stats */}
        <div className="space-y-6">
          <h2 className="text-xl font-serif text-white flex items-center gap-2">
            <Users className="text-[#888888]" size={20} /> Drive Stats
          </h2>
          <div className="bg-[#0a0a0a]/80 backdrop-blur-xl border border-white/[0.06] rounded-[24px] p-6 space-y-4">
            <div>
              <p className="text-xs text-[#666666] uppercase tracking-wider font-semibold mb-1">Total Rounds</p>
              <p className="text-3xl font-serif text-white">{driveData.rounds?.length || 0}</p>
            </div>
            <div className="pt-4 border-t border-white/[0.06]">
              <p className="text-xs text-[#666666] uppercase tracking-wider font-semibold mb-1">Description</p>
              <p className="text-sm text-[#888888] line-clamp-3">{driveData.description || "No description provided."}</p>
            </div>
          </div>
        </div>

      </div>

    </AdminLayout>
  );
}