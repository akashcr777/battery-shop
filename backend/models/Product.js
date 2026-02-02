const mongoose = require("mongoose");

const productSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  price: {
    type: Number,
    required: true,
  },
  category: {
    type: String,
    enum: ["battery", "ups"],
    required: true,
  },
  subCategory: {
    type: String,
    enum: [
      "vehicle",
      "home",
      "two-wheeler",
      "three-wheeler",
      "four-wheeler",
      "truck-series",
      "ups-type1",
      "ups-type2",
      "ups-type3",
    ],
    required: true,
  },
  description: {
    type: String,
    default: "",
  },
  image: {
    type: String,
    default: "",
  },
  stock: {
    type: Number,
    default: 0,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model("Product", productSchema);

