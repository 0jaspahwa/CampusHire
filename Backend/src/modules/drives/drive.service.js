const pool = require("../../config/db");
const ROLES = require("../../constants/roles");

exports.createDrive = async ({
  title,
  description,
  start_time,
  end_time,
  slot_duration_minutes,
  panel_count
}) => {

  if (!title || !start_time || !end_time || !slot_duration_minutes || !panel_count) {
    throw new Error('All required fields must be provided')
  }

  const result = await pool.query(
    `INSERT INTO drives
     (title, description, start_time, end_time, slot_duration_minutes, panel_count)
     VALUES ($1,$2,$3,$4,$5,$6)
     RETURNING *`,
    [title, description, start_time, end_time, slot_duration_minutes, panel_count]
  )

  return result.rows[0]
}

exports.getAllDrives = async () => {
  const result = await pool.query(
    `SELECT * FROM drives ORDER BY created_at DESC`
  )

  return result.rows
}



exports.uploadShortlist = async (driveId, studentIds) => {
  const client = await pool.connect();

  try {
    await client.query("BEGIN");

    const driveCheck = await client.query(
      "SELECT id FROM drives WHERE id = $1",
      [driveId]
    );

    if (driveCheck.rowCount === 0) {
      throw new Error("Drive not found");
    }

    const studentCheck = await client.query(
      `SELECT id FROM users 
       WHERE id = ANY($1) AND role = $2`,
      [studentIds, ROLES.STUDENT]
    );

    if (studentCheck.rowCount !== studentIds.length) {
      throw new Error("One or more users are invalid or not STUDENT");
    }

    const insertQuery = `
      INSERT INTO drive_shortlists (drive_id, student_id)
      SELECT $1, unnest($2::uuid[])
      ON CONFLICT (drive_id, student_id) DO NOTHING
      RETURNING *;
    `;

    const result = await client.query(insertQuery, [driveId, studentIds]);

    await client.query("COMMIT");

    return result.rows;
  } catch (err) {
    await client.query("ROLLBACK");
    throw err;
  } finally {
    client.release();
  }
};