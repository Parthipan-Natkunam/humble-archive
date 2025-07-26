const BaseValueObject = require('./BaseValueObject');

class GroupName extends BaseValueObject {
  constructor(value) {
    if (!BaseValueObject.isValidString(value)) {
      throw new Error('Invalid group name');
    }

    super(value);
  }
}

module.exports = GroupName;