const DatabaseError = require('../errors/DatabaseError');
const NotFoundError = require('../errors/NotFoundError');
const ValidationError = require('../errors/ValidationError');
const { v4: uuidv4 } = require('uuid');

class SquareService {
  constructor(prisma) {
    this.prisma = prisma;
  }

  async getAllSquares() {
    try {
      return await this.prisma.square.findMany({ where: { deleted: false } });
    } catch (error) {
      throw new DatabaseError('Error retrieving squares.', error);
    }
  }

  async getSquareById(id) {
    try {
      const square = await this.prisma.square.findUnique({
        where: { globalId: id },
      });

      if (!square) {
        throw new NotFoundError(`Square with id ${id} not found.`);
      }

      return square;
    } catch (error) {
      throw new DatabaseError('Error retrieving square.', error);
    }
  }

  async createSquare(name) {
    try {
      const timestamp = Date.now();
      const uniqueId = uuidv4();
      const globalId = `${process.env.LOCAL_DB_ID}-${uniqueId}-${timestamp}`; //remove name artib
      const existingSquare = await this.prisma.square.findFirst({
        where: { name: name },
      })
      if(existingSquare) {
        throw new ValidationError(`هذي المربع ${name} موجودة بالفعل `);
      }
      return await this.prisma.square.create({
        data: {
          name,
          globalId: globalId
        },
      });
    } catch (error) {
      if (error.code === 'P2002') {
        throw new ValidationError(`A square with the name '${name}' already exists.`);
      }
      else if (error instanceof ValidationError) {
        throw error
      }
       else {
        throw new DatabaseError('Error creating new square.', error);
      }
    }
  }

  async updateSquare(id, data) {
    try {
      const existingSquare = await this.prisma.square.findUnique({ where: { globalId: id } });

      if (!existingSquare) {
        throw new NotFoundError(`Square with id ${id} not found.`);
      }
      const existingSquareName = await this.prisma.square.findFirst({ where: { name: data.name } })

      if (existingSquareName) {
        throw new ValidationError(`هذي المربع ${name} موجودة بالفعل `);
      }

      return await this.prisma.square.update({
        where: { globalId: id },
        data: {
          ...data,
          version: { increment: 1 },
        },
      });
    } catch (error) {
      if( error instanceof ValidationError) {
        throw error
      }
      else{

        throw new DatabaseError('Error updating square.', error);
      }

    }
  }

  async deleteSquare(id) {
    try {
      const square = await this.prisma.square.findUnique({ where: { globalId: id } });

      if (!square) {
        throw new NotFoundError(`Square with id ${id} not found.`);
      }

      const squareName = square.name;

      await this.prisma.square.update({
        where: { globalId: id },
        data: {
          deleted: true,
          version: { increment: 1 },
        },
      });

      return squareName;
    } catch (error) {
      throw new DatabaseError('Error deleting square.', error);
    }
  }
}

module.exports = SquareService;
