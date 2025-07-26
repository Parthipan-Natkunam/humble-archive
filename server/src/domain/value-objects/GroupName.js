const BaseValueObject = require('./BaseValueObject');

class GroupName extends BaseValueObject {
  constructor(value) {
    super(value);
    if (!this.isValid(value)) {
      throw new Error('Invalid group name');
    }
  }

  isValid(name) {
    return typeof name === 'string' && name.trim().length > 0;
  }
}

module.exports = GroupName;