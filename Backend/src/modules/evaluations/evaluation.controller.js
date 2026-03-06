const evaluationService = require("./evaluation.service");

exports.submitEvaluation = async (req, res, next) => {
  try {

    const interviewerId = req.user.id;

    const {
      slotId,
      technical,
      communication,
      problemSolving,
      coreConcepts,
      decision
    } = req.body;

    if (
      slotId === undefined ||
      technical === undefined ||
      communication === undefined ||
      problemSolving === undefined ||
      coreConcepts === undefined ||
      decision === undefined
    ) {
      return res.status(400).json({
        message: "All fields are required"
      });
    }

    const result = await evaluationService.submitEvaluation(
      slotId,
      interviewerId,
      technical,
      communication,
      problemSolving,
      coreConcepts,
      decision
    );

    res.status(201).json(result);

  } catch (err) {
    next(err);
  }
};