const Joi = require('joi');

class ScrapeDataRequest {
  constructor(url, groupName) {
    this.url = url;
    this.groupName = groupName;
  }

  static validate(data) {
    const schema = Joi.object({
      url: Joi.string().uri().required().messages({
        'string.uri': 'URL must be a valid URL',
        'any.required': 'URL is required'
      }),
      groupName: Joi.string().min(1).max(255).required().messages({
        'string.min': 'Group name must be at least 1 character long',
        'string.max': 'Group name must be at most 255 characters long',
        'any.required': 'Group name is required'
      })
    });

    return schema.validate(data);
  }

  static fromRequest(req) {
    const { error, value } = this.validate(req.body);
    if (error) {
      throw new Error(error.details[0].message);
    }
    return new ScrapeDataRequest(value.url, value.groupName);
  }
}

module.exports = ScrapeDataRequest; 