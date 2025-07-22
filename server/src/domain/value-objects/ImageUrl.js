class ImageUrl {
  constructor(value) {
    if (value && !this.isValid(value)) {
      throw new Error('Invalid image URL format');
    }
    this.value = value;
  }

  isValid(url) {
    try {
      const urlObj = new URL(url);
      return urlObj.protocol === 'http:' || urlObj.protocol === 'https:';
    } catch {
      return false;
    }
  }

  toString() {
    return this.value;
  }

  getValue() {
    return this.value;
  }

  hasValue() {
    return this.value !== null && this.value !== undefined;
  }
}

module.exports = ImageUrl; 