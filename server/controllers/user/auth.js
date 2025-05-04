const { databaseService } = require('../../../server/database')
const ApiError = require('../../errors/ApiError')
const DatabaseError = require('../../errors/DatabaseError')

class AuthController {
  async signup(req, res,next) {
    try {
      const { name, email, password, roleGlobalId, phone, address, synchronized } = req.body
      const authService = databaseService.getAuthService()
      const profileImage = req.file.local ? req.file.local : req.file.s3.Location

      const newUser = await authService.signup(
        name,
        email,
        password,
        roleGlobalId,
        phone,
        address,
        profileImage,
        synchronized
      )
      res.status(201).json(newUser)
    } catch (error) {
      if (error instanceof Error) {
        if (error.message === 'User already exists') {
          res.status(401).json({ message: error.message })
        } else {
          res.status(500).json({ message: 'Internal Server Error' })
        }
      } else {
        console.error('Caught an unknown error:', error)
        next(new ApiError(500, 'InternalServer', 'Internal Server Error'))
      }
    }
  }

  async login(req, res, next) {
    try {
      const { email, password } = req.body
      const authService = databaseService.getAuthService()

      const user = await authService.login(email, password)
      req.user = user
      res.status(201).json(user)
      next()
    } catch (error) {
      if (error instanceof Error) {
        if (error.message === 'Invalid email' || error.message === 'Invalid email or password') {
          res.status(401).json({ message: error.message })
        } else {
          res.status(500).json({ message: 'Internal Server Error' })
        }
      } else {
        next(new ApiError(500, 'InternalServer', 'Internal Server Error'))
      }
    }
  }
  async getAllSearchUsers(req, res, next) {
    const authService = databaseService.getAuthService()

    const userfilter = req.query
    try {
      const applicants = await authService.getAllUser(userfilter)

      res.status(200).json(applicants)
    } catch (error) {
      console.error(error)
      next(new ApiError(500, 'InternalServer', 'Internal Server Error'))
    }
  }

  async updateUser(req, res,next) {
    try {
      const userId = req.params.id
      const updateData = req.body
      const authService = databaseService.getAuthService()

      const updatedUser = await authService.updateUser(userId, updateData)
      res.status(200).json(updatedUser)
    } catch (error) {
      next(new ApiError(500, 'InternalServer', 'Internal Server Error'))
    }
  }

  async deleteUser(req, res,next) {
    try {
      const userId = req.params.id
      const authService = databaseService.getAuthService()

      await authService.deleteUser(userId)
      res.status(204).json({ message: 'dlete scssful' }) // No content
    } catch (error) {
      next(new ApiError(500, 'InternalServer', 'Internal Server Error'))
    }
  }

  async getUserById(req, res,next) {
    try {
      const userId = req.params.id
      const authService = databaseService.getAuthService()

      const user = await authService.getUserById(userId)
      res.status(200).json(user)
    } catch (error) {
      next(new ApiError(500, 'InternalServer', 'Internal Server Error'))
    }
  }

  async forgotPassword(req, res,next) {
    try {
      const { email } = req.body
      const authService = databaseService.getAuthService()

      const response = await authService.forgotPassword(email)
      res.status(200).json(response)
    } catch (error) {
      next(new ApiError(500, 'InternalServer', 'Internal Server Error'))
    }
  }

  async resetPassword(req, res,next) {
    try {
      const { resetToken, newPassword } = req.body
      if (!resetToken || !newPassword) {
        return res.status(400).json({ message: 'Missing resetToken or newPassword in request' })
      }
      const authService = databaseService.getAuthService()

      const user = await authService.resetPassword(resetToken, newPassword)
      res.status(200).json({ message: 'Password successfully reset', user })
    } catch (error) {
      console.error(error)
      next(new ApiError(500, 'InternalServer', 'Internal Server Error'))
    }
  }
}

module.exports = new AuthController()
