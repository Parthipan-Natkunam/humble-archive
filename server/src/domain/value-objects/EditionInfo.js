const BaseValueObject = require('./BaseValueObject');

class EditionInfo extends BaseValueObject {
  constructor(value) {
    if (!!value && !BaseValueObject.isValidString(value)) { // the edition info is optional, so validate only if it's truthy
      throw new Error('Invalid edition info');
    }

    super(value);
  }
  
  hasValue() {
    return this.value !== null && this.value !== undefined && this.value.length > 0;
  }
}

module.exports = EditionInfo; 