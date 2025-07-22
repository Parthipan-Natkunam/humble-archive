const Joi = require('joi');

class PaginationRequest {
  constructor(page = 1, limit = 10) {
    this.page = page;
    this.limit = limit;
  }

  static validate(data) {
    const schema = Joi.object({
      page: Joi.number().integer().min(1).default(1).messages({
        'number.base': 'Page must be a number',
        'number.integer': 'Page must be an integer',
        'number.min': 'Page must be at least 1'
      }),
      limit: Joi.number().integer().min(1).max(100).default(10).messages({
        'number.base': 'Limit must be a number',
        'number.integer': 'Limit must be an integer',
        'number.min': 'Limit must be at least 1',
        'number.max': 'Limit must be at most 100'
      })
    });

    return schema.validate(data);
  }

  static fromRequest(req) {
    const { error, value } = this.validate(req.query);
    if (error) {
      throw new Error(error.details[0].message);
    }
    return new PaginationRequest(value.page, value.limit);
  }

  getOffset() {
    return (this.page - 1) * this.limit;
  }
}

module.exports = PaginationRequest; 