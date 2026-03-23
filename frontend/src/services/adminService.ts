
import api from "./api";

export interface CreateDrivePayload {
  title: string;
  description: string;
  start_time: string;
  end_time: string;
}

export const createDrive = async (driveData: CreateDrivePayload) => {
  try {
    // Make sure this matches your Express route! (e.g., /api/admin/drives)
    const res = await api.post('/api/drives', driveData); 
    return res.data;
  } catch (error) {
    console.error("Failed to create drive:", error);
    throw error;
  }
};

export interface CreateRoundPayload {
  sequenceNumber: number;
  type: string;
  mode: string;
  slotDurationMins: number;
  startTime: string;
  endTime: string;
}

export const createRound = async (driveId: string, roundData: CreateRoundPayload) => {
  try {
    const res = await api.post(`/api/drives/${driveId}/rounds`, roundData);
    return res.data;
  } catch (error: any) {
    console.error("Failed to create round:", error);
    throw new Error(error.response?.data?.error || "Failed to create round.");
  }
};


export interface Drive {
  id: string;
  title: string;
  description: string;
  start_time: string;
  end_time: string;
  status?: string; 
}

export const getDrives = async (): Promise<Drive[]> => {
  try {
    const res = await api.get('/api/drives'); 
    return res.data;
  } catch (error) {
    console.error("Failed to fetch drives:", error);
    throw error;
  }
};


export interface Round {
  id: string;
  sequence_number: number;
  type: string;
  mode: string;
  slot_duration_mins: number;
  start_time: string;
  end_time: string;
}

export interface DriveDetails extends Drive {
  rounds: Round[];
}

export const getDriveDetails = async (driveId: string): Promise<DriveDetails> => {
  try {
    const res = await api.get(`/api/drives/${driveId}`);
    return res.data;
  } catch (error) {
    console.error("Failed to fetch drive details:", error);
    throw error;
  }
};



export interface PanelConfig {
  panelNumber: number;
  locationOrLink: string;
  interviewerIds: string[]; 
}

// 1. Map Panels
export const mapPanels = async (roundId: string, panels: PanelConfig[]) => {
  try {
    const res = await api.post(`/api/rounds/${roundId}/panels`, { panels });
    return res.data;
  } catch (error: any) {
    throw new Error(error.response?.data?.error || "Failed to map panels.");
  }
};

// 2. Generate Slots
export const generateSlots = async (roundId: string, force: boolean = false) => {
  try {
    const res = await api.post(`/api/rounds/${roundId}/generate?force=${force}`);
    return res.data;
  } catch (error: any) {
    throw new Error(error.response?.data?.error || "Failed to generate slots.");
  }
};


export const getInterviewers = async () => {
  try {
    const res = await api.get('/api/users/interviewers'); 
    return res.data;
  } catch (error) {
    console.error("Failed to fetch interviewers", error);
    return [];
  }
};

export interface ScheduleSlot {
  slot_id: string;
  student_id: string;
  student_name: string;
  student_email: string;
  panel_number: number;
  location_or_link: string;
  start_time: string;
  end_time: string;
  status: string; 
}

export const getRoundSchedule = async (roundId: string): Promise<ScheduleSlot[]> => {
  try {
    const res = await api.get(`/api/rounds/${roundId}/schedule`);
    return res.data;
  } catch (error) {
    console.error("Failed to fetch schedule", error);
    throw error;
  }
};