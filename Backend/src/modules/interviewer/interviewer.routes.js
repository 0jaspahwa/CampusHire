const express = require("express");
const router = express.Router();

const interviewerController = require("./interviewer.controller");
const authMiddleware = require("../../middleware/auth.middleware");
const permissionMiddleware = require("../../middleware/permission.middleware");
const PERMISSIONS = require("../../constants/permissions");

router.get(
  "/me/schedule",
  authMiddleware,
  permissionMiddleware(PERMISSIONS.VIEW_ASSIGNED_SLOTS),
  interviewerController.getMySchedule
);

module.exports = router;