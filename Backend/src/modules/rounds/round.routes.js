const express = require("express");
const router = express.Router();

const roundController = require("./round.controller");
const authMiddleware = require("../../middleware/auth.middleware");
const permissionMiddleware = require("../../middleware/permission.middleware");
const PERMISSIONS = require("../../constants/permissions");

router.post(
  "/drives/:driveId/rounds",
  authMiddleware,
  permissionMiddleware(PERMISSIONS.CREATE_ROUND),
  roundController.createRound
);


router.post(
  "/:roundId/panels",
  authMiddleware,
  permissionMiddleware(PERMISSIONS.MAP_PANELS),
  roundController.mapPanels
);

module.exports = router;