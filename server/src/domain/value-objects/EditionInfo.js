const StringCleaner = require('../utils/StringCleaner');
class EditionInfo {
  constructor(value) {
    this.value = StringCleaner.clean(value)?.trim();
  }

  toString() {
    return this.value;
  }

  getValue() {
    return this.value;
  }

  hasValue() {
    return this.value !== null && this.value !== undefined && this.value.length > 0;
  }
}

module.exports = EditionInfo; 