
import { useState, useEffect } from "react";
import { Clock, Video, User, Briefcase, Calendar, MapPin } from "lucide-react";
import { getMySchedule, InterviewerSlot } from "../../services/interviewerService";
import InterviewerLayout from "../../components/layout/InterviewerLayout";


interface DashboardProps {
  onLogout: () => void;
}

export default function InterviewerDashboard({ onLogout }: DashboardProps) {
  const [schedule, setSchedule] = useState<InterviewerSlot[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Fetch data on mount
  useEffect(() => {
    const fetchSchedule = async () => {
      try {
        const data = await getMySchedule();
        setSchedule(data);
      } catch (error) {
        console.error("Error fetching schedule:", error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchSchedule();
  }, []);

  // Format helpers
  const formatTimeWindow = (start: string, end: string) => {
    const startTime = new Date(start).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    const endTime = new Date(end).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    return `${startTime} - ${endTime}`;
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString([], { weekday: 'long', month: 'short', day: 'numeric' });
  };

  return (
    
    <InterviewerLayout onLogout={onLogout}>
      
     
      <div className="max-w-4xl mx-auto space-y-8">
        
        <div>
          <h1 className="text-3xl font-serif">My Upcoming Interviews</h1>
          <p className="text-[#888888] mt-2">Your schedule for the day.</p>
        </div>

        {isLoading ? (
          <div className="animate-pulse space-y-4">
            {[1, 2, 3].map(i => (
              <div key={i} className="h-32 bg-[#141414] rounded-xl border border-white/[0.04]" />
            ))}
          </div>
        ) 
        
        : schedule.length === 0 ? (
          <div className="text-center py-20 bg-[#141414] border border-white/[0.04] rounded-2xl border-dashed">
            <Calendar className="w-12 h-12 text-[#444] mx-auto mb-4" />
            <h3 className="text-lg font-medium">No Upcoming Interviews</h3>
            <p className="text-[#888] text-sm mt-1">Your schedule is completely clear!</p>
          </div>
        ) 
        
        : (
          <div className="space-y-4">
            {schedule.map((slot) => (
              <div 
                key={slot.slot_id} 
                className="bg-[#141414] border border-white/[0.06] rounded-xl p-6 hover:border-white/[0.1] transition-colors flex flex-col md:flex-row md:items-center justify-between gap-6"
              >
                
                {/* Card Left: Candidate Info */}
                <div className="space-y-4">
                  <div className="flex items-center gap-3 flex-wrap">
                    <span className="bg-blue-500/10 text-blue-400 px-3 py-1 rounded-full text-xs font-bold tracking-wider border border-blue-500/20 uppercase">
                      Round {slot.sequence_number}: {slot.round_type}
                    </span>
                    <span className="text-sm text-[#888] flex items-center gap-1.5">
                      <Briefcase size={14} /> {slot.drive_title}
                    </span>
                    <span className="text-sm text-[#888] flex items-center gap-1.5 ml-2">
                      <MapPin size={14} /> Panel {slot.panel_number}
                    </span>
                    
                    {slot.status && (
                       <span className="bg-white/10 text-white px-2 py-1 rounded text-[10px] font-bold tracking-wider uppercase">
                         {slot.status}
                       </span>
                    )}
                  </div>

                  <div>
                    <h2 className="text-xl font-medium flex items-center gap-2">
                      <User size={18} className="text-[#666]" /> {slot.student_name}
                    </h2>
                    <p className="text-sm text-[#888] ml-6">{slot.student_email}</p>
                  </div>

                  <div className="flex items-center gap-2 text-sm text-emerald-400 font-medium ml-6">
                    <Clock size={16} />
                    {formatDate(slot.start_time)} • {formatTimeWindow(slot.start_time, slot.end_time)}
                  </div>
                </div>

                {/* Card Right: Actions & Status */}
                <div className="flex-shrink-0 flex flex-col items-end gap-3">
                  {slot.location_or_link?.startsWith('http') ? (
                    <a 
                      href={slot.location_or_link} 
                      target="_blank" 
                      rel="noreferrer"
                      className="w-full md:w-auto flex items-center justify-center gap-2 bg-white text-black px-6 py-3 rounded-xl font-medium hover:bg-gray-200 transition-colors"
                    >
                      <Video size={18} /> Join Meeting
                    </a>
                  ) : (
                    <div className="px-6 py-3 bg-white/5 border border-white/10 rounded-xl text-center">
                      <p className="text-xs text-[#888] uppercase tracking-wider font-bold mb-1">Room</p>
                      <p className="text-white font-medium">{slot.location_or_link || "TBD"}</p>
                    </div>
                  )}

                  {slot.decision && (
                     <p className="text-xs font-bold uppercase tracking-wider text-[#888]">
                       Decision: <span className={slot.decision === 'SELECTED' ? 'text-emerald-400' : 'text-red-400'}>{slot.decision}</span>
                     </p>
                  )}
                </div>

              </div>
            ))}
          </div>
        )}

      </div>
    </InterviewerLayout>
  );
}