const DatabaseError = require('../errors/DatabaseError');
const NotFoundError = require('../errors/NotFoundError');
const ValidationError = require('../errors/ValidationError');

const convertEqualsToInt = require('../utilty/convertToInt');
const convertTopLevelStringBooleans = require('../utilty/convertTopLevelStringBooleans');
const { v4: uuidv4 } = require('uuid');
class AttachmentService {
	constructor(prisma) {
		this.prisma = prisma;
	}

	async getAllAttachments(dataFillter) {
		try {
			const page = dataFillter?.page;
			const pageSize = dataFillter?.pageSize;
			delete dataFillter?.page;
			delete dataFillter?.pageSize;
			let include = dataFillter?.include;
			let orderBy = dataFillter?.orderBy
			delete dataFillter?.include;
			delete dataFillter?.orderBy
			if (include) {
				const convertTopLevel = convertTopLevelStringBooleans(include)
				include = convertTopLevel;
			} else {
				include = {};
			}
			if (dataFillter) {
				dataFillter = convertEqualsToInt(dataFillter);
			} else {
				dataFillter = {};
			}
			if (page && pageSize) {
				const skip = (+page - 1) * +pageSize;
				const take = +pageSize;
				const attachment = await this.prisma.attachment.findMany({
					where: dataFillter,
					include,
					skip: +skip,
					take: +take,
					orderBy
				});
				const total = await this.prisma.attachment.count({
					where: dataFillter,
				});
				return {
					info: attachment,
					total,
					page,
					pageSize,
				};
			}
			return await this.prisma.attachment.findMany({
				where: dataFillter, include, orderBy
			});
		} catch (error) {
			throw new DatabaseError('Error retrieving attachments.', error);
		}
	}

	async getAttachmentById(id) {
		try {
			const attachment = await this.prisma.attachment.findUnique({
				where: { globalId: id },
			});

			if (!attachment) {
				throw new NotFoundError(`Attachment with id ${id} not found.`);
			}

			return attachment;
		} catch (error) {
			throw new DatabaseError('Error retrieving attachment.', error);
		}
	}
	async getAttachmentByAccreditedId(id) {
		try {
			const attachment = await this.prisma.attachment.findFirst({
				where: { accreditedGlobalId: id },
			});

			if (!attachment) {
				throw new NotFoundError(`Attachment with id ${id} not found.`);
			}

			return attachment;
		} catch (error) {
			throw new DatabaseError('Error retrieving attachment.', error);
		}
	}

	async createAttachment(attachmentData, filePath) {
		try {
			const { type, accreditedGlobalId } = attachmentData; // use destructuring directly
			const timestamp = Date.now();
			const uniqueId = uuidv4(); // ensure uuidv4 is imported or defined
			const globalId = `${process.env.LOCAL_DB_ID}-${uniqueId}-${timestamp}`; // Good use of template literals
			return await this.prisma.attachment.create({
				data: {
					type, // Use shorthand property names
					accreditedGlobalId: accreditedGlobalId, // Use shorthand property names
					attachmentFile: filePath,
					globalId,
				},
			});
		} catch (error) {
			console.error('Error creating new attachment:', error); // Improved error logging
			throw new DatabaseError('Error creating new attachment.', error); // Ensure DatabaseError is defined
		}
	}

	async updateAttachment(id, attachmentData) {
		try {
			return await this.prisma.attachment.update({
				where: { globalId: id },
				data: {
					...attachmentData,
					version: { increment: 1 }, // Increment version for conflict resolution
				},
			});
		} catch (error) {
			throw new DatabaseError('Error updating attachment.', error);
		}
	}

	async deleteAttachment(id) {
		try {
			return await this.prisma.attachment.update({
				where: { globalId: id },
				data: {
					deleted: true,
					version: { increment: 1 }, // Increment version for conflict resolution
				},
			});
		} catch (error) {
			throw new DatabaseError('Error deleting attachment.', error);
		}
	}
}

module.exports = AttachmentService;
