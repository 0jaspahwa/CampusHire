const express = require("express");
const router = express.Router();

const slotsController = require("./slots.controller");
const authMiddleware = require("../../middleware/auth.middleware");
const permissionMiddleware = require("../../middleware/permission.middleware");
const PERMISSIONS = require("../../constants/permissions");

router.post(
  "/rounds/:roundId/generate-slots",
  authMiddleware,
  permissionMiddleware(PERMISSIONS.GENERATE_SLOTS),
  slotsController.generateSlots
);

module.exports = router;