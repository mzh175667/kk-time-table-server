const Joi = require("joi");

const employeeSchema = Joi.object({
  name: Joi.string().required(),
  email: Joi.string().email().required(),
  designation: Joi.string().required(),
});

module.exports = employeeSchema;
