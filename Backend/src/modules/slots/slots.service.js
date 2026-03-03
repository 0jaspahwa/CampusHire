const pool = require("../../config/db");

function generateSeedFromString(str) {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash = (hash << 5) - hash + str.charCodeAt(i);
    hash |= 0;
  }
  return Math.abs(hash);
}

function seededRandom(seed) {
  let value = seed % 2147483647;
  return function () {
    value = (value * 16807) % 2147483647;
    return (value - 1) / 2147483646;
  };
}

function shuffleWithSeed(array, seed) {
  const random = seededRandom(seed);
  const arr = [...array];

  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }

  return arr;
}

exports.generateSlots = async (roundId, force = false) => {

  const roundRes = await pool.query(
    `SELECT id, drive_id, start_time, end_time, slot_duration_mins
     FROM rounds WHERE id = $1`,
    [roundId]
  );

  if (roundRes.rowCount === 0) {
    throw new Error("Round not found");
  }

  const round = roundRes.rows[0];

  const panelRes = await pool.query(
    `SELECT id FROM round_panels
     WHERE round_id = $1
     ORDER BY panel_number`,
    [roundId]
  );

  if (panelRes.rowCount === 0) {
    throw new Error("No panels mapped to this round");
  }

  const panels = panelRes.rows;

  const shortlistRes = await pool.query(
    `SELECT student_id
     FROM drive_shortlists
     WHERE drive_id = $1`,
    [round.drive_id]
  );

  if (shortlistRes.rowCount === 0) {
    throw new Error("No shortlisted students found");
  }

  const students = shortlistRes.rows.map(r => r.student_id);

  //capacity
  const totalMinutes =
    (new Date(round.end_time) - new Date(round.start_time)) / (1000 * 60);

  const slotsPerPanel = Math.floor(
    totalMinutes / round.slot_duration_mins
  );

  const totalCapacity = slotsPerPanel * panels.length;

  if (students.length > totalCapacity) {
    throw new Error(
      `Insufficient capacity. Capacity: ${totalCapacity}, Students: ${students.length}`
    );
  }

  const existingSlots = await pool.query(
    `SELECT 1 FROM interview_slots
     WHERE round_id = $1
     LIMIT 1`,
    [roundId]
  );

  if (existingSlots.rowCount > 0 && !force) {
    return {
      warning: true,
      message:
        "Slots already exist. Regenerate with ?force=true to overwrite."
    };
  }
}  