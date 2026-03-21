
import { useState, useEffect, useRef } from "react";
import { Loader2, AlertCircle, Clock, Play } from "lucide-react";
import DashboardLayout from "../../components/layout/Dashboard"
import { LiveSlotResponse } from "../../Types/Interview";
import { getLiveSlot } from "../../services/studentService"; 

export default function StudentLiveSlotsPage({ onLogout }: { onLogout: () => void }) {
  const [data, setData] = useState<LiveSlotResponse | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const pollingTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    const loadData = async () => {
      try {
       
        const response = await getLiveSlot(); 
        
        setData(response);
        setError(null);

        if (pollingTimerRef.current) {
          clearTimeout(pollingTimerRef.current);
        }

        // Set up the next poll based on the dynamic interval from your backend
        if (response.poll_interval_ms > 0) {
          pollingTimerRef.current = setTimeout(loadData, response.poll_interval_ms);
        }

      } catch (err) {
        setError("Unable to connect to the live server. Retrying...");
        
        if (pollingTimerRef.current) {
          clearTimeout(pollingTimerRef.current);
        }
        pollingTimerRef.current = setTimeout(loadData, 10000); //Fallback retry
      } finally {
        setIsLoading(false);
      }
    };

    // Initial load
    loadData();

    // Cleanup function: stop polling on unmount
    return () => {
      if (pollingTimerRef.current) {
        clearTimeout(pollingTimerRef.current);
      }
    };
  }, []);

  // Format timestamp (e.g., "10:00 AM")
  const formatTime = (dateString: string) => {
    return new Date(dateString).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  return (
    <DashboardLayout onLogout={onLogout}>
      
      <div className="mb-10">
        <div className="flex items-center gap-2 mb-4">
          <div className={`w-1.5 h-1.5 rounded-full animate-pulse ${error ? 'bg-red-500' : 'bg-emerald-500'}`} />
          <span className={`text-xs font-semibold tracking-wider uppercase ${error ? 'text-red-500' : 'text-emerald-500'}`}>
            System Status: {error ? 'Reconnecting...' : 'Active (Polling)'}
          </span>
        </div>
        <h1 className="font-serif text-4xl md:text-5xl text-white mb-4 tracking-tight">Active Interview</h1>
        <p className="text-[#888888] max-w-xl text-sm leading-relaxed">
          Monitor your position in the queue. Do not close this page if your interview is approaching.
        </p>
      </div>

      {isLoading && !data ? (
        <div className="flex flex-col items-center justify-center py-20 text-[#888888]">
          <Loader2 className="w-8 h-8 animate-spin mb-4 text-blue-500" />
          <p className="text-sm">Connecting to queue server...</p>
        </div>
      ) : error && !data ? (
        <div className="flex flex-col items-center justify-center py-16 bg-red-500/5 border border-red-500/10 rounded-[24px]">
          <AlertCircle className="w-10 h-10 text-red-500 mb-3" />
          <p className="text-white font-medium mb-1">Connection Lost</p>
          <p className="text-sm text-[#888888]">{error}</p>
        </div>
      ) : !data?.slot ? (
         <div className="flex flex-col items-center justify-center py-20 bg-[#0a0a0a]/80 backdrop-blur-xl border border-white/[0.06] rounded-[24px]">
          <p className="text-white font-medium mb-1">No Active Queue</p>
          <p className="text-sm text-[#888888]">You have no immediate upcoming interviews.</p>
        </div>
      ) : (
        <div className="bg-[#0a0a0a]/80 backdrop-blur-xl border border-white/[0.06] rounded-[24px] overflow-hidden p-8 relative">
          
          {data.slot.live_status === 'LIVE' && (
            <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-500/10 blur-3xl pointer-events-none rounded-full transform translate-x-1/2 -translate-y-1/2" />
          )}

          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 relative z-10">
            
            <div>
              <div className="flex items-center gap-3 mb-2">
                <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded text-xs font-bold tracking-wide border ${
                  data.slot.live_status === 'LIVE' ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' :
                  data.slot.live_status === 'MISSED' ? 'bg-red-500/10 text-red-400 border-red-500/20' :
                  'bg-blue-500/10 text-blue-400 border-blue-500/20'
                }`}>
                  {data.slot.live_status === 'LIVE' && <div className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />}
                  {data.slot.live_status}
                </span>
                <span className="text-sm text-[#888888]">
                  Round {data.slot.sequence_number}: {data.slot.round_type}
                </span>
              </div>
              
              <h2 className="text-2xl font-bold text-white mb-1">
                {data.slot.drive_title}
              </h2>
              
              <div className="text-[#888888] flex items-center gap-2 mt-4">
                <Clock size={16} />
                <span>Scheduled: {formatTime(data.slot.start_time)} - {formatTime(data.slot.end_time)}</span>
              </div>
            </div>

            <div className="bg-black/50 border border-white/[0.06] rounded-2xl p-6 min-w-[280px]">
              {data.slot.live_status === 'LIVE' ? (
                <div className="text-center">
                  <p className="text-emerald-400 font-bold mb-3">Your interview is ready!</p>
                  <button className="w-full bg-emerald-500 hover:bg-emerald-600 text-black font-bold py-3 px-4 rounded-xl transition-colors flex items-center justify-center gap-2">
                    <Play size={18} fill="currentColor" />
                    Join Now
                  </button>
                </div>
              ) : (
                <div className="space-y-4">
                   <div>
                    <p className="text-xs text-[#666666] uppercase tracking-wider font-semibold mb-1">Queue Position</p>
                    <p className="text-3xl font-serif text-white">{data.slot.queue_position}</p>
                   </div>
                   <div>
                    <p className="text-xs text-[#666666] uppercase tracking-wider font-semibold mb-1">Estimated Start</p>
                    <p className="text-white font-medium">{formatTime(data.slot.estimated_start_time)}</p>
                   </div>
                </div>
              )}
            </div>

          </div>
        </div>
      )}
    </DashboardLayout>
  );
}