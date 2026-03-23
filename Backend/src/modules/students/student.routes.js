const express = require("express");
const router = express.Router();

const studentController = require("./student.controller");
const authMiddleware = require("../../middleware/auth.middleware");
const permissionMiddleware = require("../../middleware/permission.middleware");
const PERMISSIONS = require("../../constants/permissions");

router.get(
  "/me/slots",
  authMiddleware,
  permissionMiddleware(PERMISSIONS.VIEW_OWN_SLOTS),
  studentController.getMyUpcomingSlots
);

router.get(
  "/me/slots/liveSlot",authMiddleware,
  studentController.getliveSlot
);

router.get(
  "/me/drives",
  authMiddleware,
  permissionMiddleware(PERMISSIONS.VIEW_DRIVES),
  studentController.getDrives
);

module.exports = router;