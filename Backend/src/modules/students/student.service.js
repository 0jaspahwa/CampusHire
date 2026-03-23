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
      SELECT
      s.id,
      s.panel_id,
      s.start_time,
      s.end_time,
      s.status,
      r.sequence_number,
      r.type AS round_type,
      d.title AS drive_title,
      COUNT(*) FILTER (
        WHERE s2.start_time < s.start_time
        AND s2.status IN ('SCHEDULED','IN_PROGRESS')
      ) AS queue_position
      FROM interview_slots s
      JOIN rounds r ON s.round_id = r.id
      JOIN drives d ON r.drive_id = d.id
      LEFT JOIN interview_slots s2
        ON s2.panel_id = s.panel_id
      WHERE s.student_id = $1
      AND s.status IN ('SCHEDULED', 'IN_PROGRESS')
      GROUP BY
      s.id, s.panel_id, s.start_time, s.end_time, s.status,
      r.sequence_number, r.type, d.title
      ORDER BY s.start_time
      LIMIT 1
      `,
      [studentId]
    );
    
    if (rows.length === 0) {
      return { server_time: now, slot: null, poll_interval_ms: 120000 };
    }

    const slot = rows[0];

    const queuePosition = Number(slot.queue_position);

    const startTime = new Date(slot.start_time);
    const endTime = new Date(slot.end_time);

    let liveStatus;

    if (slot.status === 'IN_PROGRESS') {
      liveStatus = 'LIVE';
    } else if (now < startTime) {
      liveStatus = 'UPCOMING';
    } else if (now >= startTime && now <= endTime) {
      liveStatus = 'LIVE';
    } else {
      liveStatus = 'MISSED';
    }


    let pollInterval = 60000; // default

    if (liveStatus === 'LIVE') {
      pollInterval = 5000;
    }
    else if(liveStatus === 'MISSED'){
      pollInterval = 0;
    }
    else if (queuePosition === 1) {
      pollInterval = 8000; // next student
    }
    else if (queuePosition <= 3) {
      pollInterval = 20000;
    }
    else {
      pollInterval = 60000;
    }

  const slotDuration = endTime.getTime() - startTime.getTime();

  const estimatedStart = new Date(
    startTime.getTime() + queuePosition * slotDuration
  );

    return {
      server_time: now,
      slot: {
        id: slot.id,
        start_time: slot.start_time,
        end_time: slot.end_time,
        status: slot.status,
        live_status: liveStatus,
        queue_position: queuePosition,
        drive_title: slot.drive_title,
        round_type: slot.round_type,
        sequence_number: slot.sequence_number,
        estimated_start_time: estimatedStart
      },
      poll_interval_ms: pollInterval
    };

  } catch (error) {
    console.error("Error fetching live slot:", error);
    throw error;
  } finally {
    client.release();
  }
};

exports.getAvailableDrives = async() =>{
  const result = await pool.query(
    `
    SELECT
      id,
      title,
      description,
      start_time,
      end_time,
      status
    FROM DRIVES
    WHERE status in('CREATED','ACTIVE') 
    ORDER BY start_time ASC 
    `
  );
  return result.rows;
}

exports.getMyResults = async (studentId) => {
  const query = `
    SELECT 
      d.title as company_name,
      r.type as round_type,
      r.sequence_number,
      s.start_time,
      s.status as slot_status,
      e.decision,
      e.technical_skill,
      e.communication,
      e.problem_solving,
      e.core_concepts
    FROM interview_slots s
    JOIN round_panels p ON s.panel_id = p.id
    JOIN rounds r ON p.round_id = r.id
    JOIN drives d ON r.drive_id = d.id
    LEFT JOIN evaluations e ON s.id = e.slot_id
    WHERE s.student_id = $1
    ORDER BY d.start_time DESC, r.sequence_number ASC;
  `;

  try {
    const result = await pool.query(query, [studentId]);
    return result.rows;
  } catch (err) {
    console.error("Database Error in getMyResults:", err);
    throw err;
  }
};