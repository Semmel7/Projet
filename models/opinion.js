const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const OpinionSchema = new Schema({
  reader: { type: Schema.Types.ObjectId, ref: "Reader", required: true },
  comments: { type: String, required: true },
  book:{ type: Schema.Types.ObjectId, ref: "Book", required: true }
});

module.exports = mongoose.model("Opinion", OpinionSchema);
