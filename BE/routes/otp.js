var express = require("express");
var router = express.Router();
var responseReturn = require("../helper/ResponseHandle");
const OtpModel = require("../schemas/otp");

//localhost:3000/users
/* GET users listing. */
router.get("/", async function (req, res, next) {
  try {
    const userdata = await OtpModel.find().lean();
    responseReturn.ResponseSend(res, true, 200, userdata);
  } catch (error) {
    console.error(error); // Log lỗi nếu có
    res.status(500).send("Server Error"); // Trả về lỗi 500 nếu có lỗi xảy ra
  }
});

module.exports = router;
