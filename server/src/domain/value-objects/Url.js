const BaseValueObject = require('./BaseValueObject');

class Url extends BaseValueObject {
  constructor(value) {
    if (!BaseValueObject.isValidUrl(value)) {
      throw new Error('Invalid URL');
    }

    super(value);
  }
}

module.exports = Url; 