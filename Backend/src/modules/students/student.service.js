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

exports.getLiveSlot = async (studentId) => {
  const client = await pool.connect();

  try {
    const now = new Date();

    const { rows } = await client.query(
      `
      SELECT *
      FROM interview_slots
      WHERE student_id = $1
      AND status IN ('SCHEDULED', 'IN_PROGRESS')
      ORDER BY start_time
      LIMIT 1
      `,
      [studentId]
    );

    if (rows.length === 0) {
      return {
        server_time: now,
        slot: null,
        poll_interval_ms: 120000
      };
    }

    const slot = rows[0];

    return {
      server_time: now,
      slot
    };

  } catch (error) {
    console.error("Error fetching live slot:", error);
    throw error;
  } finally {
    client.release();
  }
};