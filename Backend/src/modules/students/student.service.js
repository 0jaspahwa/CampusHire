const pool = require('../../config/db');

exports.getUpcomingSlots = async(studentId) =>{
    const result = await pool.query(
        `
        SELECT
        s.id AS slot_id,
        s.start_time,
        s.end_time,
        s.status,
        r.sequence_number,
        r.type AS round_type,
        d.title AS drive_title,
        rp.panel_number,
        rp.location_or_link
        FROM interview_slots s
        JOIN rounds r ON s.round_id = r.id
        JOIN drives d ON r.drive_id = d.id
        JOIN round_panels rp ON s.panel_id = rp.id
        WHERE s.student_id = $1
        AND s.start_time >= NOW()
        ORDER BY s.start_time ASC
        `,
        [studentId]
    );
  
  return result.rows;
}