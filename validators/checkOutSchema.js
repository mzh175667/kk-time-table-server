const Joi = require("joi");

const checkOutSchema = Joi.object({
  checkOutTime: Joi.string().required(),
  totalTime: Joi.string().required(),
  reason: Joi.string(),
});

module.exports = checkOutSchema;
