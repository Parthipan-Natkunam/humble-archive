const BaseValueObject = require('./BaseValueObject');

class ImageUrl extends BaseValueObject {
  constructor(value) {
    super(value);
  }

  isValid(url) {
    try {
      const urlObj = new URL(url);
      return urlObj.protocol === 'http:' || urlObj.protocol === 'https:';
    } catch {
      return false;
    }
  }

  hasValue() {
    return this.value !== null && this.value !== undefined && this.value.length > 0;
  }
}

module.exports = ImageUrl; 