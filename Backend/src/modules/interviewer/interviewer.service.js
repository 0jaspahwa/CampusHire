const pool = require("../../config/db");

exports.getMySchedule = async (interviewerId) => {

  const result = await pool.query(
    `
    SELECT
      s.id AS slot_id,
      s.start_time,
      s.end_time,
      s.status,
      s.decision,
      u.name AS student_name,
      u.email AS student_email,
      r.sequence_number,
      r.type AS round_type,
      d.title AS drive_title,
      rp.panel_number,
      rp.location_or_link
    FROM panel_interviewers pi
    JOIN round_panels rp ON pi.panel_id = rp.id
    JOIN interview_slots s ON s.panel_id = rp.id
    JOIN users u ON s.student_id = u.id
    JOIN rounds r ON s.round_id = r.id
    JOIN drives d ON r.drive_id = d.id
    WHERE pi.interviewer_id = $1
      AND s.start_time >= NOW()
    ORDER BY s.start_time ASC
    `,
    [interviewerId]
  );

  return result.rows;
};