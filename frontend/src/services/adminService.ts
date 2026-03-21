// src/services/adminService.ts
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
    // Assuming your Express route looks like POST /api/admin/drives/:driveId/rounds
    const res = await api.post(`/api/drives/${driveId}/rounds`, roundData);
    return res.data;
  } catch (error: any) {
    console.error("Failed to create round:", error);
    // Extract the specific 23505 unique constraint error message if it exists
    throw new Error(error.response?.data?.error || "Failed to create round.");
  }
};


export interface Drive {
  id: string;
  title: string;
  description: string;
  start_time: string;
  end_time: string;
  // If your DB has a status column, add it here. Otherwise, we'll calculate it!
  status?: string; 
}

export const getDrives = async (): Promise<Drive[]> => {
  try {
    const res = await api.get('/api/drives'); // Ensure this matches your backend route
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

// Add this fetch function
export const getDriveDetails = async (driveId: string): Promise<DriveDetails> => {
  try {
    const res = await api.get(`/api/drives/${driveId}`);
    return res.data;
  } catch (error) {
    console.error("Failed to fetch drive details:", error);
    throw error;
  }
};