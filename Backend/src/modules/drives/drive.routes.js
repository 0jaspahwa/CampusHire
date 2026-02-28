const express = require('express')
const router = express.Router()

const driveController = require('./drive.controller')

const authMiddleware = require('../../middleware/auth.middleware')
const permissionMiddleware = require('../../middleware/permission.middleware')

const PERMISSIONS = require('../../constants/permissions')

router.post(
  '/',
  authMiddleware,
  permissionMiddleware(PERMISSIONS.CREATE_DRIVE),
  driveController.createDrive
)

router.get(
  '/',
  authMiddleware,
  permissionMiddleware(PERMISSIONS.VIEW_DRIVES),
  driveController.getAllDrives
)

router.post(
  "/:driveId/shortlist",
  authMiddleware,
  permissionMiddleware(PERMISSIONS.UPLOAD_SHORTLIST),
  driveController.uploadShortlist
);

module.exports = router