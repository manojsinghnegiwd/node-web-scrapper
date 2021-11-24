const mongoose = require("mongoose");

const ImageSchema = new mongoose.Schema({
  url: {
    type: String,
    required: true
  },
  alt: {
    type: String,
  },
  title: {
    type: String,
  },
  src: {
    type: String,
    required: true
  }
});

ImageSchema.index({
  url: 'text',
  alt: 'text',
  title: 'text',
  src: 'text',
});

const ImageModel = mongoose.model(
  'image',
  ImageSchema
);

module.exports = ImageModel;