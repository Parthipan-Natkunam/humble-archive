const BaseValueObject = require('./BaseValueObject');

class BookTitle extends BaseValueObject {
  constructor(value) {
    if (!BaseValueObject.isValidString(value)) {
      throw new Error('Invalid book title');
    }

    super(value);
  }
}

module.exports = BookTitle; 