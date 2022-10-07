const bcrypt = require("bcrypt");
const CustomErrorHandler = require("../../../services/CustomErrorHandler");
const Admin = require("../../../models/admin/admin");
const registerSchema = require("../../../validators/admin/registerSchema");

const registerController = {
  async register(req, res, next) {
    var regex = /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]+/;
    if (!regex.test(req.body.password)) {
      return next(
        CustomErrorHandler.validation(
          "Password must be at least one special character"
        )
      );
    }
    // validation
    const { error } = registerSchema.validate(req.body);

    if (error) {
      return next(error);
    }
    try {
      const exist = await Admin.exists({ email: req.body.email });
      if (exist) {
        return next(
          CustomErrorHandler.alreadyExist(
            "Already Have An Account, Please SignIn!"
          )
        );
      }
    } catch (err) {
      return next(err);
    }

    const { email, password, role } = req.body;

    // Hash Password
    const hashedPassword = await bcrypt.hash(password, 10); // 10 is salt rounds

    const admin = new Admin({
      email,
      password: hashedPassword,
      role,
      register: true,
    });

    let data;

    try {
      data = await admin.save();

      // // Token
      // access_token = JwtServices.sign({ _id: data._id, role: data.role }); 
    } catch (err) {
      return next(err);
    }
    const result = {
      message: "success",
      register: true,
      data: data,
    };

    res.json(result);
  },
};

module.exports = registerController;
