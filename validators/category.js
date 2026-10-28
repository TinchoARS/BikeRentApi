const Joi = require('joi');

const schema = Joi.object({
  name: Joi.string().min(3).max(50).required(),
});

function validateCategory(category) {
  return schema.validate(category ?? {});
}

module.exports = validateCategory;