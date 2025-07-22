# Book Scraper Application Specification

## Overview

A web application that scrapes book information from URLs, extracts book titles, edition numbers, and image URLs, then stores the data in a SQLite database. The application follows Domain-Driven Design principles with separate client and server components.

## Architecture

### Project Structure

```
hb_scrapper/
├── server/                 # Backend API server
│   ├── src/
│   │   ├── domain/         # Domain layer (DDD)
│   │   │   ├── entities/
│   │   │   ├── repositories/
│   │   │   ├── services/
│   │   │   └── value-objects/
│   │   ├── infrastructure/ # Infrastructure layer
│   │   │   ├── database/
│   │   │   ├── scrapers/
│   │   │   └── web/
│   │   ├── application/    # Application layer
│   │   │   ├── controllers/
│   │   │   ├── dto/
│   │   │   └── middleware/
│   │   └── main.js
│   ├── package.json
│   └── database/
│       └── schema.sql
├── client/                 # Frontend Vue application
│   ├── src/
│   │   ├── components/
│   │   ├── views/
│   │   ├── router/
│   │   ├── store/
│   │   └── services/
│   ├── package.json
│   └── public/
└── README.md
```

## Domain Model

### Core Entities

#### BookGroup

- **ID**: Unique identifier
- **Name**: Human-readable name for grouping scraped data
- **CreatedAt**: Timestamp of creation
- **UpdatedAt**: Timestamp of last update
- **Books**: Collection of Book entities

#### Book

- **ID**: Unique identifier
- **Title**: Book title
- **Edition**: Edition number/information (optional)
- **ImageUrl**: URL to book cover image
- **SourceUrl**: Original URL where book was scraped from
- **GroupId**: Reference to BookGroup
- **CreatedAt**: Timestamp of creation

### Value Objects

- **Url**: Validated URL structure
- **BookTitle**: Non-empty string with validation
- **ImageUrl**: Validated image URL
- **EditionInfo**: Optional edition information

## Database Schema

### SQLite Tables

```sql
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
```

## Server API Endpoints

### 1. Scrape Data Endpoint

**POST** `/api/scrape-data`

**Request Body:**

```json
{
  "url": "https://example.com/books",
  "groupName": "Computer Science Books"
}
```

**Response:**

```json
{
  "success": true,
  "data": {
    "groupId": 1,
    "groupName": "Computer Science Books",
    "booksScraped": 15,
    "message": "Successfully scraped 15 books"
  }
}
```

**Error Response:**

```json
{
  "success": false,
  "error": "Invalid URL or scraping failed",
  "details": "Unable to access the provided URL"
}
```

### 2. View All Groups Endpoint

**GET** `/api/groups?page=1&limit=10`

**Query Parameters:**

- `page`: Page number (default: 1)
- `limit`: Items per page (default: 10, max: 50)

**Response:**

```json
{
  "success": true,
  "data": {
    "groups": [
      {
        "id": 1,
        "name": "Computer Science Books",
        "bookCount": 15,
        "createdAt": "2024-01-15T10:30:00Z",
        "updatedAt": "2024-01-15T10:30:00Z"
      }
    ],
    "pagination": {
      "currentPage": 1,
      "totalPages": 5,
      "totalItems": 48,
      "itemsPerPage": 10
    }
  }
}
```

### 3. View By Group ID Endpoint

**GET** `/api/groups/{groupId}/books?page=1&limit=20`

**Path Parameters:**

- `groupId`: ID of the book group

**Query Parameters:**

- `page`: Page number (default: 1)
- `limit`: Items per page (default: 20, max: 100)

**Response:**

```json
{
  "success": true,
  "data": {
    "group": {
      "id": 1,
      "name": "Computer Science Books",
      "createdAt": "2024-01-15T10:30:00Z"
    },
    "books": [
      {
        "id": 1,
        "title": "Clean Code",
        "edition": "1st Edition",
        "imageUrl": "https://example.com/clean-code.jpg",
        "sourceUrl": "https://example.com/books/clean-code",
        "createdAt": "2024-01-15T10:30:00Z"
      }
    ],
    "pagination": {
      "currentPage": 1,
      "totalPages": 2,
      "totalItems": 15,
      "itemsPerPage": 20
    }
  }
}
```

## Frontend Vue Application

### Route Structure

#### 1. Home/Scrape Route (`/`)

- **Component**: `ScrapeView`
- **Purpose**: Main interface for URL input and scraping
- **Features**:
  - URL input field with validation
  - Group name input field
  - Scrape button with loading state
  - Success/error notifications
  - Recent scraping history

#### 2. Groups List Route (`/groups`)

- **Component**: `GroupsView`
- **Purpose**: Display paginated list of all book groups
- **Features**:
  - Paginated table of groups
  - Group name, book count, creation date
  - Click to view group details
  - Search/filter functionality
  - Delete group option

#### 3. Group Details Route (`/groups/:id`)

- **Component**: `GroupDetailsView`
- **Purpose**: Display all books in a specific group
- **Features**:
  - Group information header
  - Paginated grid/list of books
  - Book cover images, titles, editions
  - Book details modal
  - Export functionality
  - Back to groups list

### Component Architecture

#### Core Components

- `UrlInput`: Validated URL input with error handling
- `BookCard`: Individual book display with image, title, edition
- `Pagination`: Reusable pagination component
- `LoadingSpinner`: Loading state indicator
- `Notification`: Success/error message display
- `BookGrid`: Responsive grid layout for books
- `GroupTable`: Table display for groups list

#### Services

- `ApiService`: HTTP client for API communication
- `ValidationService`: Input validation utilities
- `NotificationService`: Toast/alert management

## Technical Requirements

### Backend (Node.js/Express)

- **Runtime**: Node.js 18+
- **Framework**: Express.js
- **Database**: SQLite3 with better-sqlite3
- **Scraping**: Puppeteer or Cheerio
- **Validation**: Joi or Yup
- **CORS**: Enabled for frontend communication

### Frontend (Vue 3)

- **Framework**: Vue 3 with Composition API
- **Router**: Vue Router 4
- **HTTP Client**: Axios
- **UI Framework**: Tailwind CSS or Vuetify
- **State Management**: Pinia (optional)

### Scraping Strategy

1. **URL Validation**: Validate input URL format
2. **HTML Fetching**: Use Puppeteer for JavaScript-heavy sites
3. **Content Parsing**: Extract book information using selectors
4. **Image Handling**: Validate and store image URLs
5. **Error Handling**: Graceful failure with detailed error messages

### Security Considerations

- Input sanitization and validation
- Rate limiting for scraping endpoints
- CORS configuration
- SQL injection prevention
- XSS protection

## Development Phases

### Phase 1: Core Backend

1. Set up Express server with basic structure
2. Implement database schema and migrations
3. Create domain entities and repositories
4. Implement scraping service
5. Build API endpoints with validation

### Phase 2: Frontend Foundation

1. Set up Vue 3 project with router
2. Create basic components and layouts
3. Implement API service layer
4. Build URL input and scraping interface

### Phase 3: Complete Features

1. Implement groups listing with pagination
2. Build group details view
3. Add error handling and notifications
4. Implement responsive design
5. Add search and filtering

### Phase 4: Polish & Testing

1. Add comprehensive error handling
2. Implement loading states
3. Add unit and integration tests
4. Performance optimization
5. Documentation and deployment setup

## API Error Handling

### Standard Error Response Format

```json
{
  "success": false,
  "error": "Error message",
  "code": "ERROR_CODE",
  "details": "Additional error details"
}
```

### Common Error Codes

- `INVALID_URL`: Malformed or inaccessible URL
- `SCRAPING_FAILED`: Failed to scrape the provided URL
- `GROUP_EXISTS`: Group name already exists
- `GROUP_NOT_FOUND`: Requested group doesn't exist
- `VALIDATION_ERROR`: Request validation failed
- `DATABASE_ERROR`: Database operation failed

## Performance Considerations

### Database Optimization

- Proper indexing on frequently queried columns
- Pagination for large datasets
- Connection pooling

### Scraping Optimization

- Concurrent scraping for multiple books
- Caching of scraped content
- Timeout handling for slow sites

### Frontend Performance

- Lazy loading of images
- Virtual scrolling for large lists
- Debounced search inputs
- Component code splitting

This specification provides a comprehensive foundation for building a robust book scraping application with clean architecture and modern web technologies.
