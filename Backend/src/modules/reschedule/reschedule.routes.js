const express = require("express");
const router = express.Router();

const controller = require("./reschedule.controller");
const authMiddleware = require("../../middleware/auth.middleware");
const permissionMiddleware = require("../../middleware/permission.middleware");
const PERMISSIONS = require("../../constants/permissions");

/* student requests */

router.post(
  "/students/me/slots/:slotId/reschedule",
  authMiddleware,
  permissionMiddleware(PERMISSIONS.REQUEST_RESCHEDULE),
  controller.requestReschedule
);

/* admin views requests */

router.get(
  "/admin/reschedule-requests",
  authMiddleware,
  permissionMiddleware(PERMISSIONS.MANAGE_SLOTS),
  controller.getRequests
);

/* admin approve/reject */

router.patch(
  "/admin/reschedule-requests/:id",
  authMiddleware,
  permissionMiddleware(PERMISSIONS.MANAGE_SLOTS),
  controller.updateRequestStatus
);

/* admin adjusts slot */

router.patch(
  "/admin/slots/:slotId/reschedule",
  authMiddleware,
  permissionMiddleware(PERMISSIONS.MANAGE_SLOTS),
  controller.adjustSlot
);

module.exports = router;