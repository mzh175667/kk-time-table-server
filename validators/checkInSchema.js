const Joi = require("joi");

const checkInSchema = Joi.object({
  date: Joi.string().required(),
  checkInTime: Joi.string().required(),
});
module.exports = checkInSchema;
