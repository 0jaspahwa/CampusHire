const pool = require("../../config/db");

exports.requestReschedule = async (studentId, slotId, reason) => {

  const client = await pool.connect();

  try {

    const { rows: slotRows } = await client.query(
      `
      SELECT id, status
      FROM interview_slots
      WHERE id = $1
      AND student_id = $2
      `,
      [slotId, studentId]
    );

    if (slotRows.length === 0) {
      throw new Error("Slot not found for this student");
    }

    if (slotRows[0].status === "COMPLETED") {
      throw new Error("Cannot reschedule completed interview");
    }

    //already exists

    const { rows: existing } = await client.query(
      `
      SELECT id
      FROM reschedule_requests
      WHERE slot_id = $1
      AND student_id = $2
      AND status = 'PENDING'
      `,
      [slotId, studentId]
    );

    if (existing.length > 0) {
      throw new Error("Reschedule request already submitted");
    }

    //Create request

    const { rows } = await client.query(
      `
      INSERT INTO reschedule_requests
      (slot_id, student_id, reason)
      VALUES ($1,$2,$3)
      RETURNING *
      `,
      [slotId, studentId, reason]
    );

    return rows[0];

  } finally {
    client.release();
  }
};