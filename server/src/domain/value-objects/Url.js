class Url {
  constructor(value) {
    if (!this.isValid(value)) {
      throw new Error('Invalid URL format');
    }
    this.value = value;
  }

  isValid(url) {
    try {
      new URL(url);
      return true;
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
}

module.exports = Url; 