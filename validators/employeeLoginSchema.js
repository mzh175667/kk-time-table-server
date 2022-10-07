const Joi = require("joi");

const employeeLoginSchema = Joi.object({
  pin: Joi.string().required(),
});
module.exports = employeeLoginSchema;
