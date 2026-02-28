const driveService = require('./drive.service')

exports.createDrive = async (req, res) => {
  try {
    const drive = await driveService.createDrive(req.body)
    res.status(201).json(drive)
  } catch (err) {
    res.status(400).json({ error: err.message })
  }
}

exports.getAllDrives = async (req, res) => {
  try {
    const drives = await driveService.getAllDrives()
    res.json(drives)
  } catch (err) {
    res.status(400).json({ error: err.message })
  }
}

exports.uploadShortlist = async (req, res, next) => {
  try {
    const { driveId } = req.params;
    const { studentIds } = req.body;

    if (!studentIds || !Array.isArray(studentIds) || studentIds.length === 0) {
      return res.status(400).json({ message: "Student IDs required" });
    }

    const result = await driveService.uploadShortlist(driveId, studentIds);

    res.status(201).json({
      message: "Shortlist uploaded successfully",
      data: result
    });
  } catch (err) {
    next(err);
  }
};