const BookGroupRepository = require('../../domain/repositories/BookGroupRepository');
const BookGroup = require('../../domain/entities/BookGroup');
const dbConnection = require('./DatabaseConnection');

class SqliteBookGroupRepository extends BookGroupRepository {
  constructor() {
    super();
    this.db = dbConnection.getConnection();
  }

  async save(bookGroup) {
    const stmt = this.db.prepare(`
      INSERT INTO book_groups (name, created_at, updated_at)
      VALUES (?, ?, ?)
    `);

    const result = stmt.run(
      bookGroup.name.getValue(),
      bookGroup.createdAt.toISOString(),
      bookGroup.updatedAt.toISOString()
    );

    bookGroup.id = result.lastInsertRowid;
    return bookGroup;
  }

  async updateBooksCount(id, count) {

    const stmt = this.db.prepare(`
      UPDATE book_groups SET books_count = ? WHERE id = ?
    `);
    stmt.run(count, id);
  }
  
  async findById(id) {
    const stmt = this.db.prepare(`
      SELECT id, name, created_at, updated_at
      FROM book_groups
      WHERE id = ?
    `);

    const row = stmt.get(id);
    if (!row) return null;

    return new BookGroup(
      row.id,
      row.name,
      new Date(row.created_at),
      new Date(row.updated_at)
    );
  }

  async findByName(name) {
    const stmt = this.db.prepare(`
      SELECT id, name, created_at, updated_at
      FROM book_groups
      WHERE name = ?
    `);

    const row = stmt.get(name);
    if (!row) return null;

    return new BookGroup(
      row.id,
      row.name,
      new Date(row.created_at),
      new Date(row.updated_at)
    );
  }

  async findAll(page = 1, limit = 10) {
    const offset = (page - 1) * limit;
    
    const stmt = this.db.prepare(`
      SELECT 
        bg.id, 
        bg.name, 
        bg.created_at, 
        bg.updated_at,
        bg.books_count
      FROM book_groups bg
      ORDER BY bg.created_at DESC
      LIMIT ? OFFSET ?
    `);

    const rows = stmt.all(limit, offset);
    
    return rows.map(row => {
      const group = new BookGroup(
        row.id,
        row.name,
        new Date(row.created_at),
        new Date(row.updated_at),
        row.books_count
      );
      return group;
    });
  }

  async delete(id) {
    const stmt = this.db.prepare('DELETE FROM book_groups WHERE id = ?');
    const result = stmt.run(id);
    return result.changes > 0;
  }

  async getTotalCount() {
    const stmt = this.db.prepare('SELECT COUNT(*) as count FROM book_groups');
    const result = stmt.get();
    return result.count;
  }
}

module.exports = SqliteBookGroupRepository; 