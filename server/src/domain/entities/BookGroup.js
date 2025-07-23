const StringCleaner = require('../utils/StringCleaner');

class BookGroup {
  constructor(id, name, createdAt = new Date(), updatedAt = new Date()) {
    this.id = id;
    this.name = StringCleaner.clean(name);
    this.createdAt = createdAt;
    this.updatedAt = updatedAt;
    this.books = [];
  }

  addBook(book) {
    this.books.push(book);
    this.updatedAt = new Date();
  }

  getBookCount() {
    return this.books.length;
  }

  toJSON() {
    return {
      id: this.id,
      name: this.name,
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