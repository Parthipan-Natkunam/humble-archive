class BookRepository {
  async save(book) {
    throw new Error('Method not implemented');
  }

  async findById(id) {
    throw new Error('Method not implemented');
  }

  async findByGroupId(groupId, page = 1, limit = 20) {
    throw new Error('Method not implemented');
  }

  async delete(id) {
    throw new Error('Method not implemented');
  }

  async getCountByGroupId(groupId) {
    throw new Error('Method not implemented');
  }
}

module.exports = BookRepository; 