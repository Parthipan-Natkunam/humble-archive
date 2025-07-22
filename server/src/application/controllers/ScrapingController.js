const ScrapeDataRequest = require('../dto/ScrapeDataRequest');
const BookGroup = require('../../domain/entities/BookGroup');
const Book = require('../../domain/entities/Book');
const SqliteBookGroupRepository = require('../../infrastructure/database/SqliteBookGroupRepository');
const SqliteBookRepository = require('../../infrastructure/database/SqliteBookRepository');
const WebScrapingService = require('../../infrastructure/scrapers/WebScrapingService');

class ScrapingController {
  constructor() {
    this.bookGroupRepository = new SqliteBookGroupRepository();
    this.bookRepository = new SqliteBookRepository();
    this.scrapingService = new WebScrapingService();
  }

  async scrapeData(req, res, next) {
    try {
      // Validate request
      const request = ScrapeDataRequest.fromRequest(req);

      // Check if group already exists
      const existingGroup = await this.bookGroupRepository.findByName(request.groupName);
      if (existingGroup) {
        throw new Error(`Group "${request.groupName}" already exists`);
      }

      // Create new book group
      const bookGroup = BookGroup.create(request.groupName);
      const savedGroup = await this.bookGroupRepository.save(bookGroup);

      // Scrape books from URL
      const scrapedBooks = await this.scrapingService.scrapeBooks(request.url);

      // Save scraped books to database
      let booksSaved = 0;
      for (const bookData of scrapedBooks) {
        try {
          const book = Book.create(
            bookData.title,
            bookData.edition,
            bookData.imageUrl,
            bookData.sourceUrl,
            savedGroup.id
          );
          await this.bookRepository.save(book);
          booksSaved++;
        } catch (error) {
          console.error('Failed to save book:', error);
          // Continue with other books even if one fails
        }
      }

      // Update group with book count
      savedGroup.books = scrapedBooks;

      const response = {
        success: true,
        data: {
          groupId: savedGroup.id,
          groupName: savedGroup.name,
          booksScraped: booksSaved,
          message: `Successfully scraped ${booksSaved} books`
        }
      };

      res.status(201).json(response);
    } catch (error) {
      next(error);
    }
  }
}

module.exports = ScrapingController; 