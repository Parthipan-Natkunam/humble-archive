const StringCleaner = require('../utils/StringCleaner');

class BaseValueObject {
  static isValidString(value) {
    return typeof value === 'string' && value.trim().length > 0;
  }

  static isValidUrl(url) {
    try {
      const urlObj = new URL(url);
      return urlObj.protocol === 'http:' || urlObj.protocol === 'https:';
    } catch {
      return false;
    }
  }
  
  constructor(value) {
    this.value = StringCleaner.clean(value)?.trim();
  }

  toString() {
    return this.value;
  }

  getValue() {
    return this.value;
  }
}

module.exports = BaseValueObject;