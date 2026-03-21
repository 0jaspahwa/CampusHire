import { Clock } from 'lucide-react';
import { UpcomingSlot } from "../../Types/Interview";

interface Props {
  slot: UpcomingSlot; // Changed from 'interview' to 'slot' to match your backend data
}

export default function InterviewRow({ slot }: Props) {
  
  // 1. Format the ISO Date from Postgres to "Oct 24, 2023"
  const formattedDate = new Date(slot.start_time).toLocaleDateString('en-US', { 
    month: 'short', day: 'numeric', year: 'numeric' 
  });
  
  // 2. Format the Start and End times to "10:00 AM — 11:30 AM"
  const formatTime = (dateString: string) => {
    return new Date(dateString).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });
  };
  const timeRange = `${formatTime(slot.start_time)} — ${formatTime(slot.end_time)}`;

  // 3. Auto-generate a styled logo based on the first letter of the Company/Drive title
  const logoLetter = slot.drive_title ? slot.drive_title.charAt(0).toUpperCase() : '?';
  
  // Pick a consistent premium color based on the length of the title
  const colorIndex = slot.drive_title ? slot.drive_title.length % 4 : 0;
  const logoColors = [
    'bg-[#00a4ef] text-white', // Microsoft Blue
    'bg-white text-black',     // Classic White
    'bg-[#635bff] text-white', // Stripe Purple
    'bg-[#ff0000] text-white'  // Adobe Red
  ];
  const activeLogoColor = logoColors[colorIndex];

  return (
    <tr className="group hover:bg-white/[0.02] transition-colors">
      
      {/* Company, Time & Status Column */}
      <td className="py-4 px-6">
        <div className="flex items-center gap-4">
          
          <div className={`w-10 h-10 rounded-xl flex items-center justify-center font-bold text-lg shrink-0 ${activeLogoColor}`}>
            {logoLetter}
          </div>

          <div className="flex flex-col gap-1.5">
            <span className="font-medium text-white">{slot.drive_title}</span>
            <div className="flex items-center gap-2">
              <span className="text-xs text-[#888888]">{timeRange}</span>
              
              {/* Dynamic Status Badge matching Postgres statuses */}
              <span className={`inline-flex items-center gap-1 px-1.5 py-0.5 rounded text-[10px] font-semibold tracking-wide border ${
                slot.status === 'SCHEDULED' 
                  ? 'bg-blue-500/10 text-blue-400 border-blue-500/20'
                  : slot.status === 'COMPLETED'
                  ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20'
                  : 'bg-amber-500/10 text-amber-400 border-amber-500/20'
              }`}>
                {slot.status === 'DELAYED' && <Clock size={10} />}
                {slot.status}
              </span>

            </div>
          </div>
        </div>
      </td>

      {/* Role & Round Column */}
      <td className="py-4 px-6 text-[#888888] text-sm group-hover:text-white/90 transition-colors">
        <div className="flex flex-col">
          <span>Round {slot.sequence_number}: {slot.round_type}</span>
          {slot.panel_number && (
            <span className="text-xs text-[#666666] mt-0.5">Panel {slot.panel_number}</span>
          )}
        </div>
      </td>

      {/* Date Column */}
      <td className="py-4 px-6">
        <div className="text-sm text-white">{formattedDate}</div>
      </td>

    </tr>
  )
}