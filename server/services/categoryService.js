const { Console } = require('console');
const DatabaseError = require('../errors/DatabaseError');
const NotFoundError = require('../errors/NotFoundError');
const ValidationError = require('../errors/ValidationError');
const { v4: uuidv4 } = require('uuid');

class CategoryService {
  constructor(prisma) {
    this.prisma = prisma;
  }

  async getAllCategories() {
    try {
      return await this.prisma.category.findMany({ where: { deleted: false } });
    } catch (error) {
      throw new DatabaseError('Error retrieving categories.', error);
    }
  }

  async getCategoryById(id) {
    try {
      const category = await this.prisma.category.findUnique({
        where: { globalId: id },
      });

      if (!category) {
        throw new NotFoundError(`Category with id ${id} not found.`);
      }

      return category;
    } catch (error) {
      throw new DatabaseError('Error retrieving category.', error);
    }
  }

  async createCategory(name, SupportRatio, description) {
    try {
      const timestamp = Date.now();
      const uniqueId = uuidv4();
      const globalId = `${process.env.LOCAL_DB_ID}-${name}-${uniqueId}-${timestamp}`;
      const existingCategory = await this.prisma.category.findFirst({
        where: { name },
      })
      if(existingCategory) {
        throw new NotFoundError(`A category with the name '${name}' already exists.`);
      }
      return await this.prisma.category.create({
        data: {
          name,
          SupportRatio,
          description,
          globalId: globalId
        },
      });
    } catch (error) {
      if (error.code === 'P2002') {

        throw new ValidationError(`A category with the name '${name}' already exists.`);
      }
      else if (error instanceof NotFoundError) {
        throw error

      }
      else {
        throw new DatabaseError('Error creating new category.', error);
      }
    }
  }

  async updateCategory(id, data) {
    try {
      const existingCategory = await this.prisma.category.findUnique({ where: { globalId: id } });

      if (!existingCategory) {
        throw new NotFoundError(`Category with id ${id} not found.`);
      }
      const existingCategoryName = await this.prisma.category.findFirst({ where: { name: data.name } })

      if (existingCategoryName) {
        throw new NotFoundError(`A category with the name '${data.name}' already exists.`);
      }


      return await this.prisma.category.update({
        where: { globalId: id },
        data: {
          ...data,
          version: { increment: 1 },
        },
      });
    } catch (error) {
      if( error instanceof NotFoundError) {
        throw error
      }
      throw new DatabaseError('Error updating category.', error);
    }
  }

  async deleteCategory(id) {
    try {
      const category = await this.prisma.category.findUnique({ where: { globalId: id } });

      if (!category) {
        throw new NotFoundError(`Category with id ${id} not found.`);
      }

      const categoryName = category.name;

      await this.prisma.category.update({
        where: { globalId: id },
        data: {
          deleted: true,
          version: { increment: 1 },

        },
      });
      return categoryName;
    } catch (error) {
      throw new DatabaseError('Error deleting category.', error);
    }
  }
}

module.exports = CategoryService;
