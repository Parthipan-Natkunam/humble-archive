const BaseValueObject = require('./BaseValueObject');

class EditionInfo extends BaseValueObject {
  constructor(value) {
    super(value);
  }

  isValid(edition) {
    return typeof edition === 'string' && edition.trim().length > 0;
  }

  hasValue() {
    return this.value !== null && this.value !== undefined && this.value.length > 0;
  }
}

module.exports = EditionInfo; 