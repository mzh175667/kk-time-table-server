const Joi = require("joi");

const checkInSchema = Joi.object({
  checkInTime: Joi.string().required(),
});
module.exports = checkInSchema;
