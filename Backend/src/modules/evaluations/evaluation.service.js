const pool = require("../../config/db");

exports.submitEvaluation = async (
  slotId,
  interviewerId,
  technical,
  communication,
  problemSolving,
  coreConcepts,
  decision
) => {

  const client = await pool.connect();

  try {
    await client.query("BEGIN");

    // 1️⃣ Verify interviewer owns slot
    const check = await client.query(
      `
      SELECT s.id
      FROM interview_slots s
      JOIN panel_interviewers pi
        ON s.panel_id = pi.panel_id
      WHERE s.id = $1
        AND pi.interviewer_id = $2
      `,
      [slotId, interviewerId]
    );

    if (check.rowCount === 0) {
      throw new Error("Unauthorized or slot not found");
    }

    // 2️⃣ Insert evaluation
    await client.query(
      `
      INSERT INTO evaluations
      (
        slot_id,
        interviewer_id,
        technical_skill,
        communication,
        problem_solving,
        core_concepts,
        decision
      )
      VALUES ($1,$2,$3,$4,$5,$6,$7)
      `,
      [
        slotId,
        interviewerId,
        technical,
        communication,
        problemSolving,
        coreConcepts,
        decision
      ]
    );

    // 3️⃣ Mark slot completed
    await client.query(
      `
      UPDATE interview_slots
      SET status = 'COMPLETED'
      WHERE id = $1
      `,
      [slotId]
    );

    await client.query("COMMIT");

    return { success: true };

  } catch (err) {
    await client.query("ROLLBACK");
    throw err;
  } finally {
    client.release();
  }
};