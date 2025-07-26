const StringCleaner = require('../utils/StringCleaner');

class BaseValueObject {
  constructor(value) {
    this.value = StringCleaner.clean(value)?.trim();
  }

  isValid(value) {
    throw new Error('Method not implemented');
  }

  toString() {
    return this.value;
  }

  getValue() {
    return this.value;
  }
}

module.exports = BaseValueObject;