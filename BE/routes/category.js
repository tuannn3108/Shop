var express = require("express");
var router = express.Router();
var responseReturn = require("../helper/ResponseHandle");
const CateModel = require("../schemas/category");

//localhost:3000/users
/* GET users listing. */
router.get("/", async function (req, res, next) {
  try {
    const userdata = await CateModel.find().lean();
    responseReturn.ResponseSend(res, true, 200, userdata);
  } catch (error) {
    console.error(error); // Log lỗi nếu có
    res.status(500).send("Server Error"); // Trả về lỗi 500 nếu có lỗi xảy ra
  }
});

router.post("/add", async (req, res, next) => {
  try {
    const { name } = req.body;
    const newCategory = new CateModel({ name });
    await newCategory.save();
    responseReturn.ResponseSend(res, true, 201, newCategory);
  } catch (error) {
    console.error(error);
    responseReturn.ResponseSend(res, false, 500, "Server Error");
  }
});

router.get("/:id", async (req, res, next) => {
  try {
    const category = await CateModel.findById(req.params.id).lean();
    if (!category) {
      return responseReturn.ResponseSend(res, false, 404, "Category not found");
    }
    responseReturn.ResponseSend(res, true, 200, category);
  } catch (error) {
    console.error(error);
    responseReturn.ResponseSend(res, false, 500, "Server Error");
  }
});

router.put("/:id", async (req, res, next) => {
  try {
    const { name } = req.body;
    const updatedCategory = await CateModel.findByIdAndUpdate(
      req.params.id,
      { name },
      { new: true }
    ).lean();

    if (!updatedCategory) {
      return responseReturn.ResponseSend(res, false, 404, "Category not found");
    }
    responseReturn.ResponseSend(res, true, 200, updatedCategory);
  } catch (error) {
    console.error(error);
    responseReturn.ResponseSend(res, false, 500, "Server Error");
  }
});

router.delete("/:id", async (req, res, next) => {
  try {
    const deletedCategory = await CateModel.findByIdAndDelete(req.params.id);
    if (!deletedCategory) {
      return responseReturn.ResponseSend(res, false, 404, "Category not found");
    }
    responseReturn.ResponseSend(res, true, 200, deletedCategory);
  } catch (error) {
    console.error(error);
    responseReturn.ResponseSend(res, false, 500, "Server Error");
  }
});

module.exports = router;
