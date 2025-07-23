/**
 * Utility class for cleaning strings by removing HTML tags and decoding entities
 */
class StringCleaner {
  /**
   * Clean string by removing HTML tags and extracting plain text
   * @param {string} str - The string to clean
   * @returns {string|null} - Cleaned string or null if input is falsy
   */
  static clean(str) {
    if (!str || typeof str !== 'string') {
      return null;
    }

    // Remove HTML tags and decode HTML entities
    let cleaned = str
      .replace(/<[^>]*>/g, '') // Remove all HTML tags
      .replace(/&amp;/g, '&') // Decode common HTML entities
      .replace(/&lt;/g, '<')
      .replace(/&gt;/g, '>')
      .replace(/&quot;/g, '"')
      .replace(/&#39;/g, "'")
      .replace(/&nbsp;/g, ' ')
      .replace(/&copy;/g, '©')
      .replace(/&reg;/g, '®')
      .replace(/&trade;/g, '™')
      .trim();

    // Remove extra whitespace (multiple spaces, tabs, newlines)
    cleaned = cleaned.replace(/\s+/g, ' ');

    return cleaned.length > 0 ? cleaned : null;
  }

  /**
   * Clean multiple strings at once
   * @param {...string} strings - Variable number of strings to clean
   * @returns {Array} - Array of cleaned strings (null for invalid inputs)
   */
  static cleanMultiple(...strings) {
    return strings.map(str => this.clean(str));
  }

  /**
   * Clean an object's string properties
   * @param {Object} obj - Object containing string properties to clean
   * @param {Array} properties - Array of property names to clean
   * @returns {Object} - New object with cleaned properties
   */
  static cleanObject(obj, properties) {
    const cleaned = { ...obj };
    properties.forEach(prop => {
      if (obj.hasOwnProperty(prop)) {
        cleaned[prop] = this.clean(obj[prop]);
      }
    });
    return cleaned;
  }
}

module.exports = StringCleaner; 