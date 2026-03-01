const roundService = require("./round.service");

exports.createRound = async (req, res, next) => {
  try {
    const { driveId } = req.params;
    const {
      sequenceNumber,
      type,
      mode,
      slotDurationMins,
      startTime,
      endTime
    } = req.body;

    if (
      !sequenceNumber ||
      !type ||
      !mode ||
      !slotDurationMins ||
      !startTime ||
      !endTime
    ) {
      return res.status(400).json({
        message: "All fields are required"
      });
    }

    const round = await roundService.createRound(
      driveId,
      sequenceNumber,
      type,
      mode,
      slotDurationMins,
      startTime,
      endTime
    );

    res.status(201).json({
      message: "Round created successfully",
      round
    });

  } catch (err) {
    next(err);
  }
};

exports.mapPanels = async (req, res, next) => {
  try {
    const { roundId } = req.params;
    const { panels } = req.body;

    if (!panels || !Array.isArray(panels)) {
      return res.status(400).json({
        message: "Panels array is required"
      });
    }

    const result = await roundService.mapPanels(roundId, panels);

    res.status(201).json({
      message: "Panels mapped successfully",
      panels: result
    });

  } catch (err) {
    next(err);
  }
};