import api from "./api";

export interface InterviewerSlot {
  slot_id: string;
  start_time: string;
  end_time: string;
  status: string | null;
  decision: string | null;
  student_name: string;
  student_email: string;
  sequence_number: number;
  round_type: string;
  drive_title: string;      
  panel_number: number;      
  location_or_link: string;
}

export const getMySchedule = async (): Promise<InterviewerSlot[]> => {
  try {
    const res = await api.get('/api/interviewer/my-schedule');
    return res.data;
  } catch (error) {
    console.error("Failed to fetch interviewer schedule", error);
    throw error;
  }
};