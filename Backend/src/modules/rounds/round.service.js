const pool = require("../../config/db");
const ROLES = require("../../constants/roles");

exports.createRound = async (
  driveId,
  sequenceNumber,
  type,
  mode,
  slotDurationMins,
  startTime,
  endTime
) => {


  const driveCheck = await pool.query(
    "SELECT id FROM drives WHERE id = $1",
    [driveId]
  );

  if (driveCheck.rowCount === 0) {
    throw new Error("Drive not found");
  }

  try {
    const result = await pool.query(
      `
      INSERT INTO rounds (
        drive_id,
        sequence_number,
        type,
        mode,
        slot_duration_mins,
        start_time,
        end_time
      )
      VALUES ($1, $2, $3, $4, $5, $6, $7)
      RETURNING *
      `,
      [
        driveId,
        sequenceNumber,
        type,
        mode,
        slotDurationMins,
        startTime,
        endTime
      ]
    );

    return result.rows[0];

  } catch (err) {


    if (err.code === "23505") {
      throw new Error("Round sequence already exists for this drive");
    }

    throw err;
  }
};


exports.mapPanels = async (roundId, panels) => {

  const allInterviewers = panels
    .filter(p => Array.isArray(p.interviewerIds))
    .flatMap(p => p.interviewerIds);

  if (new Set(allInterviewers).size !== allInterviewers.length) {
    throw new Error("An interviewer cannot be assigned to multiple panels simultaneously");
  }

  const client = await pool.connect();

  try {
    await client.query("BEGIN");

    const roundCheck = await client.query(
      "SELECT id FROM rounds WHERE id = $1",
      [roundId]
    );

    if (roundCheck.rowCount === 0) {
      throw new Error("Round not found");
    }

    if (allInterviewers.length > 0) {
      const interviewerCheck = await client.query(
        `SELECT id FROM users 
         WHERE id = ANY($1) AND role = $2`,
        [allInterviewers, ROLES.INTERVIEWER]
      );

      if (interviewerCheck.rowCount !== allInterviewers.length) {
        throw new Error("One or more users are invalid or not INTERVIEWER");
      }
    }

    await client.query(
      `DELETE FROM panel_interviewers
       WHERE panel_id IN (
         SELECT id FROM round_panels WHERE round_id = $1
       )`,
      [roundId]
    );

    await client.query(
      `DELETE FROM round_panels WHERE round_id = $1`,
      [roundId]
    );

    
    const createdPanels = [];

    for (const panel of panels) {

      const panelInsert = await client.query(
        `INSERT INTO round_panels (round_id, panel_number, location_or_link)
         VALUES ($1, $2, $3)
         RETURNING id, panel_number`,
        [roundId, panel.panelNumber, panel.locationOrLink || null]
      );

      const panelId = panelInsert.rows[0].id;
      createdPanels.push(panelInsert.rows[0]);

      if (Array.isArray(panel.interviewerIds) && panel.interviewerIds.length > 0) {

        for (const interviewerId of panel.interviewerIds) {
          await client.query(
            `INSERT INTO panel_interviewers (panel_id, interviewer_id)
             VALUES ($1, $2)`,
            [panelId, interviewerId]
          );
        }

      }
    }

    await client.query("COMMIT");

    return createdPanels;

  } catch (err) {
    await client.query("ROLLBACK");
    throw err;
  } finally {
    client.release();
  }
};