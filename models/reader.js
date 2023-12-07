const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const ReaderSchema = new Schema({
  surname: { type: String, required: true, maxLength: 20 },
  number: { type: String, required: true },
});

ReaderSchema.virtual("url").get(function () {
  return `/catalog/reader/${this._id}`;
});

module.exports = mongoose.model("Reader", ReaderSchema);
