const BaseValueObject = require('./BaseValueObject');

class ImageUrl extends BaseValueObject {
  constructor(value) {
    if (!!value && !BaseValueObject.isValidUrl(value)) { // the image url is optional, so validate only if it's truthy
      throw new Error('Invalid image URL');
    }

    super(value);
  }

  hasValue() {
    return this.value !== null && this.value !== undefined && this.value.length > 0;
  }
}

module.exports = ImageUrl; 