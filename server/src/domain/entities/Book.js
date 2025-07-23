const BookTitle = require('../value-objects/BookTitle');
const ImageUrl = require('../value-objects/ImageUrl');
const EditionInfo = require('../value-objects/EditionInfo');
const Url = require('../value-objects/Url');
const StringCleaner = require('../utils/StringCleaner');

class Book {
  constructor(id, title, edition, imageUrl, sourceUrl, groupId, createdAt = new Date()) {
    this.id = id;
    this.title = new BookTitle(StringCleaner.clean(title));
    this.edition = new EditionInfo(StringCleaner.clean(edition));
    this.imageUrl = new ImageUrl(imageUrl); // URLs don't need HTML cleaning
    this.sourceUrl = new Url(sourceUrl); // URLs don't need HTML cleaning
    this.groupId = groupId;
    this.createdAt = createdAt;
  }

  toJSON() {
    return {
      id: this.id,
      title: this.title.getValue(),
      edition: this.edition.getValue(),
      imageUrl: this.imageUrl.getValue(),
      sourceUrl: this.sourceUrl.getValue(),
      groupId: this.groupId,
      createdAt: this.createdAt
    };
  }

  static create(title, edition, imageUrl, sourceUrl, groupId) {
    return new Book(null, title, edition, imageUrl, sourceUrl, groupId);
  }
}

module.exports = Book; 