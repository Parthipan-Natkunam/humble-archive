const Database = require('better-sqlite3');
const path = require('path');

class DatabaseConnection {
  constructor() {
    this.db = null;
  }

  connect() {
    const dbPath = path.join(__dirname, '../../../database/books.db');
    this.db = new Database(dbPath);
    
    // Enable foreign keys
    this.db.pragma('foreign_keys = ON');
    
    return this.db;
  }

  getConnection() {
    if (!this.db) {
      this.connect();
    }
    return this.db;
  }

  close() {
    if (this.db) {
      this.db.close();
      this.db = null;
    }
  }

  initDatabase() {
    const fs = require('fs');
    const schemaPath = path.join(__dirname, '../../../database/schema.sql');
    const schema = fs.readFileSync(schemaPath, 'utf8');
    
    this.db.exec(schema);
  }
}

// Singleton instance
const dbConnection = new DatabaseConnection();

module.exports = dbConnection; 