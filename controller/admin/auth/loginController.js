const bcrypt = require("bcrypt");
const CustomErrorHandler = require( "../../../services/CustomErrorHandler");
const JwtServices = require( "../../../services/JwtService");
const Admin = require("../../../models/admin/admin");
const loginSchema = require("../../../validators/admin/loginSchema");

const loginController = {
  async login(req, res, next) {
    // Validation
    const { error } = loginSchema.validate(req.body);

    if (error) {
      return next(error);
    }
    // check if admin exist in database already
    let admin, result;

    try {
      admin = await Admin.findOne({ email: req.body.email }).select(
        "-updatedAt -__v"
      );
      if (!admin) {
        return next(CustomErrorHandler.wrongCredentials());
      }
    } catch (err) {
      return next(err);
    }

    // compare password
    const match = await bcrypt.compare(req.body.password, admin.password);

    if (!match) {
      return next(CustomErrorHandler.wrongCredentials());
    }
  
      // tokens
      const access_token = JwtServices.sign({ _id: admin._id, role: admin.role });

      // database whitlist
      result = {
        message: "success",
        access_token,
        data: admin,
        success: true,
      };
    res.status(200).json(result);
  },

  async logout(req, res, next) {
    // validations
    const refreshSchema = Joi.object({
      refresh_token: Joi.string().required(),
    });
    const { error } = refreshSchema.validate(req.body);

    if (error) {
      return next(error);
    }

    try {
      await RefreshToken.deleteOne({ token: req.body.refresh_token });
    } catch (err) {
      return next(new Error("Something went wrong in the database"));
    }
    res.json({ status: 1 });
  },
};

module.exports = loginController;
