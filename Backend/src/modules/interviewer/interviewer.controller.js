const interviewerService = require("./interviewer.service");

exports.getMySchedule = async (req, res, next) => {
  try {

    const interviewerId = req.user.id;

    const schedule = await interviewerService.getMySchedule(interviewerId);

    res.status(200).json({
      count: schedule.length,
      schedule
    });

  } catch (err) {
    next(err);
  }
};