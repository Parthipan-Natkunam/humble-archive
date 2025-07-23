const {writeFileSync} = require('node:fs')

const ScrapingService = require('../../domain/services/ScrapingService');
const axios = require('axios');
const cheerio = require('cheerio');

class WebScrapingService extends ScrapingService {
  constructor() {
    super();
  }

  async scrapeBooks(url) {
    try {
      // Fetch HTML content using axios
      const response = await axios.get(url, {
        timeout: 30000,
        headers: {
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
        }
      });
      
      const html = response.data;
      return this.extractBookData(html);
    } catch (error) {
      throw new Error(`Failed to scrape URL: ${error.message}`);
    }
  }

  async extractBookData(html) {
    const $ = cheerio.load(html);
    const books = [];

    // Extract JSON data from script tag
    const scriptTag = $('#webpack-bundle-page-data');
    
    if (scriptTag.length === 0) {
      console.log('No script tag with id="webpack-bundle-page-data" found');
      return books;
    }

    try {
      const jsonData = JSON.parse(scriptTag.html());
      console.log('Successfully parsed JSON data from script tag');
      
      // Extract books from the JSON data
      const extractedBooks = this.extractBooksFromJson(jsonData);
      books.push(...extractedBooks);
      
      console.log(`Total books extracted from JSON: ${books.length}`);
      
    } catch (error) {
      console.error('Failed to parse JSON data:', error.message);
      return books;
    }

    return books;
  }

  extractBooksFromJson(jsonData) {
    const books = [];

    try {
      const bookKeys = Object.keys(jsonData?.bundleData?.tier_item_data);
      bookKeys.forEach(key => {
        const book = jsonData?.bundleData?.tier_item_data[key];
        if(book && book.item_content_type === 'ebook'){
          books.push({
            title: book.human_name,
            edition: book.callout,
            imageUrl: book.resolved_paths?.preview_image,
            sourceUrl: book.publishers?.[0]?.['publisher-url'],
          });
        }
      });
    } catch (error) {
      console.error('Error processing JSON book data:', error.message);
    }

    return books;
  }
}

module.exports = WebScrapingService; 