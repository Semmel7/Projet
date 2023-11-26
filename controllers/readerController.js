const Reader = require("../models/reader");
const Opinion = require("../models/opinion");

const { body, validationResult } = require("express-validator");
const asyncHandler = require("express-async-handler");

exports.reader_list = asyncHandler(async (req, res, next) => {

    const allReaders = await Reader.find().sort({ surname: 1 }).exec();
  
    res.render("reader_list", {
      title: "Reader List",
      reader_list: allReaders,
    });
  
  });

  exports.reader_detail = asyncHandler(async (req, res, next) => {

    const [reader, allOpinionsByReader] = await Promise.all([
      Reader.findById(req.params.id).exec(),
      Opinion.find({ reader: req.params.id }, "comments").exec(),
    ]);
  
    if (reader === null) {
      const err = new Error("Reader not found");
      err.status = 404;
      return next(err);
    }
  
    res.render("reader_detail", {
      title: "Reader Detail",
      reader: reader,
      reader_opinions: allOpinionsByReader,
    });
    
  });