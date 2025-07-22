class BookTitle {
  constructor(value) {
    if (!this.isValid(value)) {
      throw new Error('Book title cannot be empty');
    }
    this.value = value.trim();
  }

  isValid(title) {
    return typeof title === 'string' && title.trim().length > 0;
  }

  toString() {
    return this.value;
  }

  getValue() {
    return this.value;
  }
}

module.exports = BookTitle; 