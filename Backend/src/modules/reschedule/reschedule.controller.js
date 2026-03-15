const service = require("./reschedule.service");

exports.requestReschedule = async (req, res, next) => {
  try {
    const studentId = req.user.id;
    const slotId = req.params.slotId;
    const { reason } = req.body;

    const result = await service.requestReschedule(
      studentId,
      slotId,
      reason
    );

    res.json(result);
  } catch (err) {
    next(err);
  }
};


exports.getRequests = async (req, res, next) => {
  try {
    const requests = await service.getRequests();
    res.json(requests);
  } catch (err) {
    next(err);
  }
};

/* admin approve/reject */

exports.updateRequestStatus = async (req, res, next) => {
  try {
    const requestId = req.params.id;
    const { status } = req.body;

    const result = await service.updateRequestStatus(requestId, status);

    res.json(result);
  } catch (err) {
    next(err);
  }
};

/* admin adjust slot */

exports.adjustSlot = async (req, res, next) => {
  try {
    const slotId = req.params.slotId;
    const { newTime } = req.body;

    const result = await service.adjustSlot(slotId, newTime);

    res.json(result);
  } catch (err) {
    next(err);
  }
};