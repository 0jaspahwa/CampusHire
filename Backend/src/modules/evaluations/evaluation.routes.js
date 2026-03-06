const express = require("express");
const router = express.Router();

const evaluationController = require("./evaluation.controller");
const authMiddleware = require("../../middleware/auth.middleware");
const permissionMiddleware = require("../../middleware/permission.middleware");
const PERMISSIONS = require("../../constants/permissions");

router.post(
  "/",
  authMiddleware,
  permissionMiddleware(PERMISSIONS.SUBMIT_EVALUATION),
  evaluationController.submitEvaluation
);

module.exports = router;