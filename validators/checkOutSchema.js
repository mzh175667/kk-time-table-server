const Joi = require("joi");

const checkOutSchema = Joi.object({
  checkOutTime: Joi.string().required(),
  totalTime: Joi.string().optional(),
  reason: Joi.string(),
});

module.exports = checkOutSchema;
