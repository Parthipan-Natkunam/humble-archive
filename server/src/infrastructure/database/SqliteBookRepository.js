const BookRepository = require('../../domain/repositories/BookRepository');
const Book = require('../../domain/entities/Book');
const dbConnection = require('./DatabaseConnection');

class SqliteBookRepository extends BookRepository {
  constructor() {
    super();
    this.db = dbConnection.getConnection();
  }

  async save(book) {
    const stmt = this.db.prepare(`
      INSERT INTO books (title, edition, image_url, source_url, group_id, created_at)
      VALUES (?, ?, ?, ?, ?, ?)
    `);

    const result = stmt.run(
      book.title.getValue(),
      book.edition.getValue(),
      book.imageUrl.getValue(),
      book.sourceUrl.getValue(),
      book.groupId,
      book.createdAt.toISOString()
    );

    book.id = result.lastInsertRowid;
    return book;
  }

  async findById(id) {
    const stmt = this.db.prepare(`
      SELECT id, title, edition, image_url, source_url, group_id, created_at
      FROM books
      WHERE id = ?
    `);

    const row = stmt.get(id);
    if (!row) return null;

    return new Book(
      row.id,
      row.title,
      row.edition,
      row.image_url,
      row.source_url,
      row.group_id,
      new Date(row.created_at)
    );
  }

  async findByGroupId(groupId, page = 1, limit = 20) {
    const offset = (page - 1) * limit;
    
    const stmt = this.db.prepare(`
      SELECT id, title, edition, image_url, source_url, group_id, created_at
      FROM books
      WHERE group_id = ?
      ORDER BY created_at DESC
      LIMIT ? OFFSET ?
    `);

    const rows = stmt.all(groupId, limit, offset);
    
    return rows.map(row => new Book(
      row.id,
      row.title,
      row.edition,
      row.image_url,
      row.source_url,
      row.group_id,
      new Date(row.created_at)
    ));
  }

  async delete(id) {
    const stmt = this.db.prepare('DELETE FROM books WHERE id = ?');
    const result = stmt.run(id);
    return result.changes > 0;
  }

  async getCountByGroupId(groupId) {
    const stmt = this.db.prepare('SELECT COUNT(*) as count FROM books WHERE group_id = ?');
    const result = stmt.get(groupId);
    return result.count;
  }
}

module.exports = SqliteBookRepository; 