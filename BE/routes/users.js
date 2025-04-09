var express = require("express");
var router = express.Router();
var userModel = require("../schemas/user");
var ResHelper = require("../helper/ResponseHandle");
var Validator = require("../validators/user");
const { validationResult } = require("express-validator");

const config = require("../config/config");
const protect = require("../middleware/protect");

router.get("/", async function (req, res, next) {
  try {
    let users = await userModel.find({}).exec();
    ResHelper.ResponseSend(res, true, 200, users);
  } catch (error) {
    ResHelper.ResponseSend(res, false, 500, error);
  }
});

router.get("/:id", protect.verifyToken, async function (req, res, next) {
  try {
    let user = await userModel.find({ _id: req.params.id }).exec();
    ResHelper.RenderRes(res, true, 200, user);
  } catch (error) {
    ResHelper.ResponseSend(res, false, 404, error);
  }
});

router.post("/", Validator.UserValidate(), async function (req, res, next) {
  var errors = validationResult(req).errors;
  if (errors.length > 0) {
    ResHelper.ResponseSend(res, false, 404, errors);
    return;
  }
  try {
    var newUser = new userModel({
      username: req.body.username,
      password: req.body.password,
      email: req.body.email,
    });
    await newUser.save();
    ResHelper.ResponseSend(res, true, 200, newUser);
  } catch (error) {
    ResHelper.ResponseSend(res, false, 404, error);
  }
});
router.put("/:id", async function (req, res, next) {
  try {
    let user = await userModel.findById(req.params.id).exec();
    user.email = req.body.email;
    await user.save();
    ResHelper.ResponseSend(res, true, 200, user);
  } catch (error) {
    ResHelper.ResponseSend(res, false, 404, error);
  }
});

router.delete("/:id", async function (req, res, next) {
  try {
    let user = await userModel.findByIdAndDelete(req.params.id).exec();
    if (!user) {
      return ResHelper.ResponseSend(res, false, 404, "User not found");
    }
    ResHelper.ResponseSend(res, true, 200, {
      message: "User deleted successfully",
    });
  } catch (error) {
    ResHelper.ResponseSend(res, false, 500, error);
  }
});
module.exports = router;
