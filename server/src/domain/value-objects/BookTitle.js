const BaseValueObject = require('./BaseValueObject');

class BookTitle extends BaseValueObject {
  constructor(value) {
    super(value);
    if (!this.isValid(value)) {
      throw new Error('Invalid book title');
    }
  }

  isValid(title) {
    return typeof title === 'string' && title.trim().length > 0;
  }
}

module.exports = BookTitle; 