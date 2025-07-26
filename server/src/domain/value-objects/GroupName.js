const StringCleaner = require('../utils/StringCleaner');

class GroupName {
  constructor(value) {
    this.value = StringCleaner.clean(value)?.trim();
  }

  isValid(name) {
    return typeof name === 'string' && name.trim().length > 0;
  }

  toString() {
    return this.value;
  }

  getValue() {
    return this.value;
  }
}

module.exports = GroupName;