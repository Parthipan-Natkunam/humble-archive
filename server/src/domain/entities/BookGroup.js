const GroupName = require('../value-objects/GroupName');
class BookGroup {
  constructor(id, name, createdAt = new Date(), updatedAt = new Date(), booksCount = 0) {
    this.id = id;
    this.name = new GroupName(name);
    this.createdAt = createdAt;
    this.updatedAt = updatedAt;
    this.booksCount = booksCount;
  }

  updateBooksCount(count) {
    this.booksCount = count;
    this.updatedAt = new Date();
  }

  getBookCount() {
    return this.booksCount;
  }

  toJSON() {
    return {
      id: this.id,
      name: this.name.getValue(),
      bookCount: this.getBookCount(),
      createdAt: this.createdAt,
      updatedAt: this.updatedAt
    };
  }

  static create(name) {
    return new BookGroup(null, name);
  }
}

module.exports = BookGroup; 