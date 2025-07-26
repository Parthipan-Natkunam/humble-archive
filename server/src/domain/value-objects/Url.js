const BaseValueObject = require('./BaseValueObject');

class Url extends BaseValueObject {
  constructor(value) {
    super(value);
    if (!this.isValid(value)) {
      throw new Error('Invalid URL');
    }
  }

  isValid(url) {
    try {
      new URL(url);
      return true;
    } catch {
      return false;
    }
  }
}

module.exports = Url; 