class EditionInfo {
  constructor(value) {
    this.value = value ? value.trim() : null;
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