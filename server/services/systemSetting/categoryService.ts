import { PrismaClient, Category } from '@prisma/client';
import { v4 as uuidv4 } from 'uuid';
import DatabaseError from "../../errors/DatabaseError";
import {ValidationError} from "../../errors/ValidationError"
import NotFoundError from "../../errors/NotFoundError";



interface CategoryUpdateInput {
  name: string;
  SupportRatio: number;
  description: string;
}

export class CategoryService {
  private prisma: PrismaClient;

  constructor(prisma: PrismaClient) {
    this.prisma = prisma;
  }

  async getAllCategories(): Promise<Category[]> {
    try {
      return await this.prisma.category.findMany({ where: { deleted: false } });
    } catch (error) {
      throw new DatabaseError('Error retrieving categories.', error);
    }
  }

  async getCategoryById(id: string): Promise<Category> {
    try {
      const category = await this.prisma.category.findUnique({
        where: { globalId: id }
      });

      if (!category) {
        throw new NotFoundError(`Category with id ${id} not found.`);
      }

      return category;
    } catch (error) {
      throw new DatabaseError('Error retrieving category.', error);
    }
  }

  async createCategory(name: string, SupportRatio: number, description?: string): Promise<Category> {
    try {
      const timestamp = Date.now();
      const uniqueId = uuidv4();
      const globalId = `${process.env.LOCAL_DB_ID}-${name}-${uniqueId}-${timestamp}`;

      const existingCategory = await this.prisma.category.findFirst({
        where: { name }
      });

      if (existingCategory) {
        throw new ValidationError(`هذي الفئة  ${name}  موجودة بالفعل `);
      }

      return await this.prisma.category.create({
        data: {
          name,
          SupportRatio,
          description: description ?? '',
          globalId
        }
      });
    } catch (error: any) {
      if (error.code === 'P2002') {
        throw new ValidationError(`هذي الفئة  ${name}  موجودة بالفعل `);
      } else if (error instanceof ValidationError) {
        throw error;
      } else {
        throw new DatabaseError('Error creating new category.', error);
      }
    }
  }

  async updateCategory(id: string, data: CategoryUpdateInput): Promise<Category> {
    try {
      const existingCategory = await this.prisma.category.findUnique({ where: { globalId: id } });

      if (!existingCategory) {
        throw new NotFoundError(`Category with id ${id} not found.`);
      }

      const categoryWithSameName = await this.prisma.category.findFirst({
        where: { name: data.name }
      });

      if (categoryWithSameName && categoryWithSameName.globalId !== existingCategory.globalId) {
        throw new ValidationError(`هذي الفئة  ${data.name}  موجودة بالفعل `);
      }

      return await this.prisma.category.update({
        where: { globalId: id },
        data: {
          ...data,
          version: { increment: 1 }
        }
      });
    } catch (error) {
      if (error instanceof ValidationError) {
        throw error;
      }
      throw new DatabaseError('Error updating category.', error);
    }
  }

  async deleteCategory(id: string): Promise<string> {
    try {
      const category = await this.prisma.category.findUnique({ where: { globalId: id } });

      if (!category) {
        throw new NotFoundError(`Category with id ${id} not found.`);
      }

      await this.prisma.category.update({
        where: { globalId: id },
        data: {
          deleted: true,
          version: { increment: 1 }
        }
      });

      return category.name;
    } catch (error) {
      throw new DatabaseError('Error deleting category.', error);
    }
  }
}
