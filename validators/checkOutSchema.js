const Joi = require("joi");

const checkOutSchema = Joi.object({
  checkOutTime: Joi.string().required(),
});

module.exports = checkOutSchema;
