const { hash, compare } = require('bcryptjs')
const jwt = require('jsonwebtoken')
const { JWT_SECRET } = require('../secrets')
const crypto = require('crypto')
const DatabaseError = require('../errors/DatabaseError')
require('dotenv').config()
const { v4: uuidv4 } = require('uuid')

class AuthService {
  constructor(prisma) {
    this.prisma = prisma
  }

  async signup(name, email, password, roleGlobalId, phone, address, profileImage) {
    try {
      // const emailIsExist = this.prisma.user.first({ where: { email: email } });
      // if (emailIsExist) {
      // 	throw new DatabaseError('Email already exist');
      // }
      const timestamp = Date.now()
      const uniqueId = uuidv4()
      const globalId = `${process.env.LOCAL_DB_ID}-${name}-${uniqueId}-${timestamp}`
      const hashedPassword = await hash(password, 10)
      const newUser = await this.prisma.user.create({
        data: {
          name,
          email,
          password: hashedPassword,
          roleGlobalId: roleGlobalId,
          phone,
          address,
          profileImage: profileImage,
          globalId: globalId,
          deleted: false
        }
      })
      return newUser
    } catch (error) {
      if (error instanceof DatabaseError) {
        throw error
      }
      console.error(error)
      throw new DatabaseError('Error deleting accreditation.', error)
    }
  }

  async login(email, password) {
    try {
      const existingUser = await this.prisma.user.findUnique({
        where: { email },
        include: { role: true }
      })
      if (!existingUser) {
        throw new Error('Invalid email')
      }

      const passwordValid = await compare(password, existingUser.password)
      if (!passwordValid) {
        throw new Error('Invalid email or password')
      }

      const token = jwt.sign({ userId: existingUser.id, name: existingUser.name }, JWT_SECRET)

      return {
        token,
        user: {
          role: existingUser.role.name,
          name: existingUser.name,
          email: existingUser.email,
          profileImage: existingUser.profileImage
        }
      }
    } catch (error) {
      console.error(error)
      throw new DatabaseError('Error deleting accreditation.', error)
    }
  }

  async getAllUser(userfilter) {
    try {
      const allUser = await this.prisma.User.findMany({
        where: { ...userfilter, deleted: false },

        include: {
          role: true
        }
      })
      return allUser
    } catch (error) {
      console.error(error)
      throw new DatabaseError('Error deleting accreditation.', error)
    }
  }

  async searchUser(searchTerm) {
    try {
      const Users = await this.prisma.User.findMany({
        where: {
          OR: [{ name: { contains: searchTerm } }]
        }
      })
      return Users
    } catch (error) {
      throw new DatabaseError('Error searching Users.', error)
    }
  }

  async updateUser(globalId, updateData) {
    try {
      const updatedUser = await this.prisma.user.update({
        where: { globalId: globalId },
        data: {
          ...updateData,
          version: { increment: 1 } // Increment version for conflict resolution
        }
      })
      return updatedUser
    } catch (error) {
      console.error(error)
      throw new DatabaseError('Error deleting accreditation.', error)
    }
  }
  async deleteUser(globalId) {
    try {
      // Mark the user as deleted instead of removing the record
      await this.prisma.user.update({
        where: { globalId: globalId },
        data: {
          deleted: true,
          version: { increment: 1 } // Increment version for conflict resolution
        }
      })
      return true
    } catch (error) {
      console.error(error)
      throw new DatabaseError('Error deleting accreditation.', error)
    }
  }

  async getUserById(globalId) {
    try {
      const user = await this.prisma.user.findUnique({
        where: { globalId: globalId }
      })
      if (!user) {
        throw new Error('User not found')
      }
      return user
    } catch (error) {
      console.error(error)
      throw new DatabaseError('Error deleting accreditation.', error)
    }
  }

  async forgotPassword(email) {
    try {
      const user = await this.prisma.user.findUnique({ where: { email } })
      if (!user) {
        return {
          message: 'If a user with that email exists, we have sent a reset link to your email.'
        }
      }

      // Usage example
      const resetToken = crypto.randomBytes(32).toString('hex')
      // Optionally hash the reset token before storing
      const resetTokenHash = crypto.createHash('sha256').update(resetToken).digest('hex')

      await this.prisma.user.update({
        where: { email },
        data: {
          resetToken: resetTokenHash, // Store the hashed token
          resetTokenExpiry: new Date(Date.now() + 3600000) // 1 hour from now
        }
      })
      return {
        message: `http://localhost:3000/api/auth/reset-password?resetToken=${encodeURIComponent(resetToken)}&newPassword`
      }
    } catch (error) {
      throw new DatabaseError('Error deleting accreditation.', error)
    }
  }

  async resetPassword(token, newPassword) {
    try {
      // Optionally hash the provided token to match the stored hash
      const resetTokenHash = crypto.createHash('sha256').update(token).digest('hex')
      const user = await this.prisma.user.findFirst({
        where: {
          resetToken: resetTokenHash,
          resetTokenExpiry: {
            gt: new Date()
          }
        }
      })

      if (!user) {
        throw new Error('Token is invalid or has expired.')
      }

      const hashedPassword = await hash(newPassword, 10)

      await this.prisma.user.update({
        where: { globalId: user.globalId },
        data: {
          password: hashedPassword,
          resetToken: null,
          resetTokenExpiry: null
        }
      })
      return { message: 'Your password has been reset successfully.' }
    } catch (error) {
      throw new DatabaseError('Error deleting accreditation.', error)
    }
  }
}
module.exports = AuthService
