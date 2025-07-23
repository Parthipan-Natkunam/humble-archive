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
      return this.extractBookData(html, url);
    } catch (error) {
      throw new Error(`Failed to scrape URL: ${error.message}`);
    }
  }

  async extractBookData(html, baseUrl) {
    const $ = cheerio.load(html);
    const books = [];

    // Common selectors for book information
    // This is a generic implementation - specific selectors would depend on the target website
    const bookSelectors = [
      '.book-item',
      '.product-item',
      '.book',
      '[data-book]',
      '.item',
      'article',
      '.card'
    ];

    let bookElements = null;
    for (const selector of bookSelectors) {
      bookElements = $(selector);
      if (bookElements.length > 0) break;
    }

    if (!bookElements || bookElements.length === 0) {
      // Fallback: try to find any elements that might contain book information
      bookElements = $('div, article, section').filter((i, el) => {
        const text = $(el).text().toLowerCase();
        return text.includes('book') || text.includes('title') || text.includes('edition');
      });
    }

    bookElements.each((i, element) => {
      const $el = $(element);
      
      // Extract title
      let title = this.extractTitle($el, $);
      
      // Extract edition
      let edition = this.extractEdition($el, $);
      
      // Extract image URL
      let imageUrl = this.extractImageUrl($el, $, baseUrl);
      
      // Extract source URL
      let sourceUrl = this.extractSourceUrl($el, $, baseUrl);

      if (title) {
        books.push({
          title,
          edition,
          imageUrl,
          sourceUrl
        });
      }
    });

    return books;
  }

  extractTitle($el, $) {
    const titleSelectors = [
      'h1', 'h2', 'h3', 'h4',
      '.title', '.book-title', '.product-title',
      '[data-title]', '[title]',
      'strong', 'b'
    ];

    for (const selector of titleSelectors) {
      const titleEl = $el.find(selector).first();
      if (titleEl.length > 0) {
        const title = titleEl.text().trim();
        if (title && title.length > 0 && title.length < 500) {
          return title;
        }
      }
    }

    // Fallback: look for text that might be a title
    const text = $el.text().trim();
    const lines = text.split('\n').map(line => line.trim()).filter(line => line.length > 0);
    return lines[0] || null;
  }

  extractEdition($el, $) {
    const editionSelectors = [
      '.edition', '.version', '.ed',
      '[data-edition]', '[data-version]'
    ];

    for (const selector of editionSelectors) {
      const editionEl = $el.find(selector).first();
      if (editionEl.length > 0) {
        const edition = editionEl.text().trim();
        if (edition && edition.length > 0) {
          return edition;
        }
      }
    }

    // Look for edition in text
    const text = $el.text().toLowerCase();
    const editionMatches = text.match(/(\d+)(st|nd|rd|th)\s*edition|edition\s*(\d+)/i);
    if (editionMatches) {
      return editionMatches[0];
    }

    return null;
  }

  extractImageUrl($el, $, baseUrl) {
    const imgSelectors = [
      'img[src]',
      'img[data-src]',
      'img[data-lazy]',
      '.image img',
      '.book-image img',
      '.product-image img'
    ];

    for (const selector of imgSelectors) {
      const imgEl = $el.find(selector).first();
      if (imgEl.length > 0) {
        let src = imgEl.attr('src') || imgEl.attr('data-src') || imgEl.attr('data-lazy');
        if (src) {
          // Convert relative URLs to absolute
          if (src.startsWith('/')) {
            const url = new URL(baseUrl);
            src = `${url.protocol}//${url.host}${src}`;
          } else if (!src.startsWith('http')) {
            src = new URL(src, baseUrl).href;
          }
          return src;
        }
      }
    }

    return null;
  }

  extractSourceUrl($el, $, baseUrl) {
    const linkSelectors = [
      'a[href]',
      '.link a',
      '.book-link a',
      '.product-link a'
    ];

    for (const selector of linkSelectors) {
      const linkEl = $el.find(selector).first();
      if (linkEl.length > 0) {
        const href = linkEl.attr('href');
        if (href) {
          // Convert relative URLs to absolute
          if (href.startsWith('/')) {
            const url = new URL(baseUrl);
            return `${url.protocol}//${url.host}${href}`;
          } else if (!href.startsWith('http')) {
            return new URL(href, baseUrl).href;
          }
          return href;
        }
      }
    }

    return baseUrl;
  }
}

module.exports = WebScrapingService; 