-- Book Groups table
CREATE TABLE book_groups (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL UNIQUE,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- Books table
CREATE TABLE books (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    title TEXT NOT NULL,
    edition TEXT,
    image_url TEXT,
    source_url TEXT NOT NULL,
    group_id INTEGER NOT NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (group_id) REFERENCES book_groups(id) ON DELETE CASCADE
);

-- Indexes for performance
CREATE INDEX idx_books_group_id ON books(group_id);
CREATE INDEX idx_book_groups_created_at ON book_groups(created_at); 