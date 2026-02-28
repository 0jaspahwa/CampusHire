const rolePermissions = require('../constants/rolePermissions')

module.exports = (...requiredPermissions) => {
  return (req, res, next) => {

    
    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: 'Authentication required'
      })
    }

    
    const userRole = req.user.role

    const userPermissions = rolePermissions[userRole] || []

    
    const hasPermission = requiredPermissions.every(permission =>
      userPermissions.includes(permission)
    )

    if (!hasPermission) {
      return res.status(403).json({
        success: false,
        message: 'Insufficient permissions'
      })
    }

    next()
  }
}