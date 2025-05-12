const DatabaseError = require('../../errors/DatabaseError');
const NotFoundError = require('../../errors/NotFoundError');
const ValidationError = require('../../errors/ValidationError');
const { v4: uuidv4 } = require('uuid');

require('dotenv').config();

class RoleService {
  constructor(prisma) {
    this.prisma = prisma;
  }

  async getAllRoles() {
    try {
      return await this.prisma.role.findMany();
    } catch (error) {
      throw new DatabaseError('Error retrieving roles.', error);
    }
  }

  async getRoleById(id) {
    try {
      const role = await this.prisma.role.findUnique({
        where: { id },
      });

      if (!role) {
        throw new NotFoundError(`Role with id ${id} not found.`);
      }

      return role;
    } catch (error) {
      throw new DatabaseError('Error retrieving role.', error);
    }
  }

  async createRole(name) {
    try {
      const timestamp = Date.now();
      const uniqueId = uuidv4();
      const globalId = `${process.env.LOCAL_DB_ID}-${name}-${uniqueId}-${timestamp}`;
      return await this.prisma.role.create({
        data: {
          name,
          globalId: globalId,

          deleted: false,
        },
      });
    } catch (error) {
      if (error.code === 'P2002') {
        throw new ValidationError(`A role with the name '${name}' already exists.`);
      } else {
        throw new DatabaseError('Error creating new role.', error);
      }
    }
  }

  async updateRole(id, name, deleted) {
    try {
      const existingRole = await this.prisma.role.findUnique({ where: { id } });

      if (!existingRole) {
        throw new NotFoundError(`Role with id ${id} not found.`);
      }

      return await this.prisma.role.update({
        where: { id },
        data: {
          name,
          deleted,
          version: { increment: 1 }, // Increment version for conflict resolution
        },
      });
    } catch (error) {
      throw new DatabaseError('Error updating role.', error);
    }
  }

  async deleteRole(id) {
    try {
      const role = await this.prisma.role.findUnique({ where: { id } });
      if (!role) {
        throw new NotFoundError(`Role with id ${id} not found.`);
      }
      await this.prisma.role.update({
        where: { id },
        data: {
          deleted: true,
          version: { increment: 1 }, // Increment version for conflict resolution
        },
      });
      return role.name; // Assuming you want to return the name of the soft-deleted role
    } catch (error) {
      throw new DatabaseError('Error deleting (soft-delete) role.', error);
    }
  }
}

module.exports = RoleService;