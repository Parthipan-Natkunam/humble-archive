const PaginationRequest = require('../dto/PaginationRequest');
const SqliteBookGroupRepository = require('../../infrastructure/database/SqliteBookGroupRepository');
const SqliteBookRepository = require('../../infrastructure/database/SqliteBookRepository');

class GroupsController {
  constructor() {
    this.bookGroupRepository = new SqliteBookGroupRepository();
    this.bookRepository = new SqliteBookRepository();
  }

  async getAllGroups(req, res, next) {
    try {
      // Validate pagination parameters
      const pagination = PaginationRequest.fromRequest(req);

      // Get groups with pagination
      const groups = await this.bookGroupRepository.findAll(pagination.page, pagination.limit);
      const totalCount = await this.bookGroupRepository.getTotalCount();

      // Calculate pagination info
      const totalPages = Math.ceil(totalCount / pagination.limit);

      const response = {
        success: true,
        data: {
          groups: groups.map(group => group.toJSON()),
          pagination: {
            currentPage: pagination.page,
            totalPages,
            totalItems: totalCount,
            itemsPerPage: pagination.limit
          }
        }
      };

      res.json(response);
    } catch (error) {
      next(error);
    }
  }

  async getGroupById(req, res, next) {
    try {
      const groupId = parseInt(req.params.id);
      if (isNaN(groupId)) {
        throw new Error('Invalid group ID');
      }

      // Validate pagination parameters
      const pagination = PaginationRequest.fromRequest(req);

      // Get group
      const group = await this.bookGroupRepository.findById(groupId);
      if (!group) {
        throw new Error('Group not found');
      }

      // Get books for this group
      const books = await this.bookRepository.findByGroupId(groupId, pagination.page, pagination.limit);
      const totalBooks = await this.bookRepository.getCountByGroupId(groupId);

      // Calculate pagination info
      const totalPages = Math.ceil(totalBooks / pagination.limit);

      const response = {
        success: true,
        data: {
          group: {
            id: group.id,
            name: group.name,
            createdAt: group.createdAt
          },
          books: books.map(book => book.toJSON()),
          pagination: {
            currentPage: pagination.page,
            totalPages,
            totalItems: totalBooks,
            itemsPerPage: pagination.limit
          }
        }
      };

      res.json(response);
    } catch (error) {
      next(error);
    }
  }
}

module.exports = GroupsController; 