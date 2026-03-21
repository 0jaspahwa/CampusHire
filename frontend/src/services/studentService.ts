import api from "./api";

export const getUpcomingSlots = async () => {
  const res = await api.get("/students/me/slots");
  return res.data;
};

export const getLiveSlot = async () => {
  const res = await api.get("/api/students/me/slots/liveSlot");
  return res.data;
};

export const getStudentDrives = async () => {
  const res = await api.get("api/students/me/drives");
  return res.data;
};

export const requestReschedule = async (slotId: string, reason: string) => {
  const res = await api.post(
    `/students/me/slots/${slotId}/reschedule`,
    { reason }
  );
  return res.data;
};

export const getStudentEvaluations = async () => {
  const res = await api.get("/students/me/evaluations");
  return res.data;
};