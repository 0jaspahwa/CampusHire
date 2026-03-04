const slotsService = require("./slots.service");

exports.generateSlots = async (req, res, next) => {
  try {
    const { roundId } = req.params;
    const force = req.query.force === "true";

    const result = await slotsService.generateSlots(roundId, force);

    if (result.warning) {
      return res.status(409).json(result);
    }

    res.status(201).json({
      message: "Slots generated successfully",
      ...result
    });

  } catch (err) {
    next(err);
  }
};