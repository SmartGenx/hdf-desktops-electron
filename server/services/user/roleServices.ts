import { PrismaClient, Role as RoleModel } from '@prisma/client';
import { v4 as uuidv4 } from 'uuid';
import dotenv from 'dotenv';
import DatabaseError from '../../errors/DatabaseError';
import NotFoundError from '../../errors/NotFoundError';
import { ValidationError } from '../../errors/ValidationError';

dotenv.config();

export default class RoleService {
  private prisma: PrismaClient;

  constructor(prisma: PrismaClient) {
    this.prisma = prisma;
  }

  async getAllRoles(): Promise<RoleModel[]> {
    try {
      return await this.prisma.role.findMany();
    } catch (error) {
      throw new DatabaseError('Error retrieving roles.', error);
    }
  }

  async getRoleById(id: number): Promise<RoleModel> {
    try {
      const role = await this.prisma.role.findUnique({ where: { id } });

      if (!role) {
        throw new NotFoundError(`Role with id ${id} not found.`);
      }

      return role;
    } catch (error) {
      throw new DatabaseError('Error retrieving role.', error);
    }
  }

  async createRole(name: string): Promise<RoleModel> {
    try {
      const timestamp = Date.now();
      const uniqueId = uuidv4();
      const globalId = `${process.env.LOCAL_DB_ID}-${name}-${uniqueId}-${timestamp}`;

      return await this.prisma.role.create({
        data: {
          name,
          globalId,
          deleted: false,
        },
      });
    } catch (error: any) {
      if (error.code === 'P2002') {
        throw new ValidationError(`A role with the name '${name}' already exists.`);
      } else {
        throw new DatabaseError('Error creating new role.', error);
      }
    }
  }

  async updateRole(id: number, name: string, deleted: boolean): Promise<RoleModel> {
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
          version: { increment: 1 },
        },
      });
    } catch (error) {
      throw new DatabaseError('Error updating role.', error);
    }
  }

  async deleteRole(id: number): Promise<string> {
    try {
      const role = await this.prisma.role.findUnique({ where: { id } });

      if (!role) {
        throw new NotFoundError(`Role with id ${id} not found.`);
      }

      await this.prisma.role.update({
        where: { id },
        data: {
          deleted: true,
          version: { increment: 1 },
        },
      });

      return role.name;
    } catch (error) {
      throw new DatabaseError('Error deleting (soft-delete) role.', error);
    }
  }
}
