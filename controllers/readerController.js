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
      Opinion.find({ reader: req.params.id }, "comments").populate('book').exec(),
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

exports.reader_delete_get = asyncHandler(async (req, res, next) => {
    const [reader, allOpinionsByReader] = await Promise.all([
      Reader.findById(req.params.id).exec(),
      Opinion.find({ reader: req.params.id }, "comments").populate('book').exec(),
    ]);
  
    if (reader === null) {
      res.redirect("/catalog/readers");
    }
  
    res.render("reader_delete", {
      title: "Delete Reader",
      reader: reader,
      reader_opinions: allOpinionsByReader,
    });
  
  });

exports.reader_delete_post = asyncHandler(async (req, res, next) => {
    const [reader, allOpinionsByReader] = await Promise.all([
      Reader.findById(req.params.id).exec(),
      Opinion.find({ reader: req.params.id }, "comments").exec(),
    ]);
  
    if (allOpinionsByReader.length > 0) {
      res.render("reader_delete", {
        title: "Delete Reader",
        reader: reader,
        reader_opinions: allOpinionsByReader,
      });
      return;
    } else {
      await Reader.findByIdAndDelete(req.body.readerid);
      res.redirect("/catalog/readers");
    }
    
  });

exports.reader_create_get = (req, res, next) => {
    res.render("reader_form", { title: "Create Reader" });
  };

exports.reader_create_post = [
    body("surname")
      .trim()
      .isLength({ min: 1 })
      .escape()
      .withMessage("Surname must be specified.")
      .isAlphanumeric()
      .withMessage("Surname has non-alphanumeric characters."),
    body("number")
      .trim()
      .isLength({ min: 1 })
      .escape()
      .withMessage("Number must be specified.")
      .isAlphanumeric()
      .withMessage("Number has non-alphanumeric characters."), 
    asyncHandler(async (req, res, next) => {
      const errors = validationResult(req);
  
      const reader = new Reader({
        surname: req.body.surname,
        number: req.body.number,
      });
  
      if (!errors.isEmpty()) {
        res.render("reader_form", {
          title: "Create Reader",
          reader: reader,
          errors: errors.array(),
        });
        return;
      } else {
        await reader.save();
        res.redirect(reader.url);
      }
    }),
  ];

exports.reader_update_get = asyncHandler(async (req, res, next) => {
    const [reader] = await Promise.all([
      Reader.findById(req.params.id).exec(),
    ])
  
    if (reader === null) {
      const err = new Error("Reader not found");
      err.status = 404;
      return next(err);
    }
  
    res.render("reader_form", {
      title: "Update Reader",
      reader: reader,
    });
  
  });

exports.reader_update_post = [
    body("surname")
    .trim()
    .isLength({ min: 1 })
    .escape()
    .withMessage("Surname must be specified.")
    .isAlphanumeric()
    .withMessage("Surname has non-alphanumeric characters."),
  body("number")
    .trim()
    .isLength({ min: 1 })
    .escape()
    .withMessage("Number must be specified.")
    .isAlphanumeric()
    .withMessage("Number has non-alphanumeric characters."),

    asyncHandler(async (req, res, next) => {
      const errors = validationResult(req);
  
      const reader = new Reader({
        surname: req.body.surname,
        number: req.body.number,
        _id: req.params.id, 
      });
  
      if (!errors.isEmpty()) {
        res.render("reader_form", {
          title: "Update Reader",
          reader: reader,
          errors: errors.array(),
        });
        return;
      } else {
        const updatedReader = await Reader.findByIdAndUpdate(req.params.id, reader, {});
        res.redirect(updatedReader.url);
      }
      
    }),
  ];