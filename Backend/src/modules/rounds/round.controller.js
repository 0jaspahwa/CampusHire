const roundService = require("./round.service");

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