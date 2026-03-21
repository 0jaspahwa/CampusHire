import InterviewRow from "./InterviewRow"
import { UpcomingSlot } from "../../Types/Interview"

interface Props {
  slots: UpcomingSlot[];
}

export default function InterviewTable({ slots }: Props) {
  // Safety check: If there are no slots, we don't render the table wrapper at all
  if (!slots || slots.length === 0) {
    return null; 
  }

  return (
    <div className="bg-[#0a0a0a]/80 backdrop-blur-xl border border-white/[0.06] rounded-[24px] overflow-hidden">
      <div className="overflow-x-auto">
        
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b border-white/[0.06]">
              <th className="py-5 px-6 text-xs font-semibold tracking-wider text-[#666666] uppercase w-[45%]">
                Interview Drive
              </th>
              <th className="py-5 px-6 text-xs font-semibold tracking-wider text-[#666666] uppercase w-[30%]">
                Round Details
              </th>
              <th className="py-5 px-6 text-xs font-semibold tracking-wider text-[#666666] uppercase w-[25%]">
                Date
              </th>
            </tr>
          </thead>

          <tbody className="divide-y divide-white/[0.06]">
            {slots.map((slot) => (
              <InterviewRow key={slot.slot_id} slot={slot} />
            ))}
          </tbody>
        </table>

      </div>
    </div>
  );
}