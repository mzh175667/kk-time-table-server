const Admin = require("../../models/admin/admin");

const adminController = {
  async me(req, res, next) {
    try {
      const user = await Admin.findOne({ _id: req.user._id }).select(
        "-password -updatedAt -__v"
      );
      if (!user) {
        return next(CustomErrorHandler.notFound());
      }

      res.json({
        data:user,
        success:true
      });
    } catch (err) {
      return next(err);
    }
  },
};

module.exports = adminController;
