var express = require("express");
const path = require("path");
var router = express.Router();
const sanphamModel = require("../schemas/sanpham");
const cloudinary = require("cloudinary").v2;
const { CloudinaryStorage } = require("multer-storage-cloudinary");
var responseReturn = require("../helper/ResponseHandle");
const CategoryModel = require("../schemas/category");
const os = require("os");
const multer = require("multer");

// Cấu hình Cloudinary
cloudinary.config({
  cloud_name: "dgi6g4fux",
  api_key: "969431646287836",
  api_secret: "MPiu4DDf6VVHEHUKFRwR0F-mySs",
});

const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    format: async (req, file) => "png",
    public_id: (req, file) => `${file.fieldname}_${Date.now()}`,
  },
});

const upload = multer({ storage: storage });

router.get("/", async function (req, res, next) {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const category = req.query.category;
    const sortBy = req.query.sortBy;

    const skip = (page - 1) * limit;

    let query = {};
    if (category) {
      const categoryObject = await CategoryModel.findOne({ name: category });
      if (categoryObject) {
        query.category = categoryObject._id;
      }
    }

    // Handle sort options
    let sortOption = {};
    if (sortBy === "price") {
      sortOption = { price: 1 };
    } else if (sortBy === "name") {
      sortOption = { title: 1 }; // 'title' thay vì 'name'
    }

    const total = await sanphamModel.countDocuments(query);

    const products = await sanphamModel
      .find(query)
      .skip(skip)
      .limit(limit)
      .sort(sortOption)
      .populate("category", "name");

    responseReturn.ResponseSend(res, true, 200, {
      data: products,
      pagination: {
        total,
        page,
        limit,
      },
    });
  } catch (error) {
    console.error(error);
    res.status(500).send("Server Error");
  }
});

router.get("/:id", async function (req, res, next) {
  const productId = req.params.id; // Lấy id từ request params
  try {
    const product = await sanphamModel
      .findById(productId)
      .populate("category", "name");

    if (!product) {
      // Kiểm tra nếu không tìm thấy sản phẩm
      return res.status(404).json({ message: "Product not found" });
    }
    responseReturn.ResponseSend(res, true, 200, product);
  } catch (error) {
    console.error(error); // Log lỗi nếu có
    res.status(500).send("Server Error"); // Trả về lỗi 500 nếu có lỗi xảy ra
  }
});
router.post("/add", async function (req, res) {
  try {
    const { title, description, price, categoryName, linkImg } = req.body;

    if (!linkImg) {
      return res.status(400).send("No image link provided");
    }

    let category = await CategoryModel.findOne({ name: categoryName });
    if (!category) {
      category = new CategoryModel({ name: categoryName });
      await category.save();
    }

    const newProduct = new sanphamModel({
      title,
      description,
      price,
      linkImg,
      category: category._id,
    });

    const savedProduct = await newProduct.save();
    res.status(201).json(savedProduct);
  } catch (error) {
    console.error("Error adding product:", error);
    res.status(500).send("Server Error: " + error.message);
  }
});

// Cập nhật dữ liệu
router.put("/:id", async function (req, res, next) {
  try {
    const { id } = req.params;
    const { title, description, price, linkImg, categoryName } = req.body;

    // Create the update object properly
    const updateData = {
      title,
      description,
      price,
      linkImg,
    };

    const category = await CategoryModel.findOne({ name: categoryName });
    if (category) {
      updateData.category = category._id;
    }

    const updatedProduct = await sanphamModel.findByIdAndUpdate(
      id,
      updateData,
      { new: true }
    );

    if (!updatedProduct) {
      return res.status(404).json({ message: "Product not found" });
    }
    res.json(updatedProduct);
  } catch (error) {
    console.error(error);
    res.status(500).send("Server Error");
  }
});

// Xóa dữ liệu
router.delete("/", async function (req, res, next) {
  try {
    const { id } = req.body;
    const deletedProduct = await sanphamModel.findByIdAndDelete(id);
    if (!deletedProduct) {
      return res.status(404).json({ message: "Product not found" });
    }
    res.json({ message: "Product deleted successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).send("Server Error");
  }
});

module.exports = router;
