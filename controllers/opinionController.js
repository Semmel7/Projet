const Reader = require("../models/reader");
const Opinion = require("../models/opinion");
const Book = require("../models/book");

const { body, validationResult } = require("express-validator");
const asyncHandler = require("express-async-handler");

  exports.opinion_detail = asyncHandler(async (req, res, next) => {

    const [opinion, reader, book] = await Promise.all([
      Opinion.findById(req.params.id).populate('book').populate('reader').exec(),
    ]);
  
    if (opinion === null) {
      const err = new Error("Opinion not found");
      err.status = 404;
      return next(err);
    }
  
    res.render("opinion_detail", {
      title: "Opinion Detail",
      opinion: opinion,
    });
    
  });

  exports.opinion_delete_get = asyncHandler(async (req, res, next) => {
    const [opinion] = await Promise.all([
      Opinion.findById(req.params.id).populate('reader').populate('book').exec(),
    ]);
  
    if (opinion === null) {
      res.redirect("/catalog/readers");
    }
  
    res.render("opinion_delete", {
      title: "Delete Opinion",
      opinion: opinion,
    });
  
  });

  exports.opinion_delete_post = asyncHandler(async (req, res, next) => {
    const [opinion] = await Promise.all([
      Opinion.findById(req.params.id).exec(),
    ]);
      await Opinion.findByIdAndDelete(req.body.opinionid);
      res.redirect("/catalog/reader/"+opinion.reader._id);
    
  });

  exports.opinion_create_get = asyncHandler(async (req, res, next) => {
    const [allBooks, allReaders] = await Promise.all([
      Book.find().exec(),
      Reader.find().exec(),
    ]);
  
    res.render("opinion_form", {
      title: "Give Opinion",
      readers: allReaders,
      books: allBooks,
    });
  
  });

  exports.opinion_create_post = [
    body("reader", "Reader must not be empty.")
      .trim()
      .isLength({ min: 1 })
      .escape(),
    body("book", "Book must not be empty.")
      .trim()
      .isLength({ min: 1 })
      .escape(),
    body("comments", "Comments must not be empty.")
      .trim()
      .isLength({ min: 1 })
      .escape(),
    asyncHandler(async (req, res, next) => {
      const errors = validationResult(req);
      const opinion = new Opinion({
        reader: req.body.reader,
        book: req.body.book,
        comments: req.body.comments,
      });
  
      if (!errors.isEmpty()) {
        const [allBooks, allReaders] = await Promise.all([
          Book.find().exec(),
          Reader.find().exec(),
        ]);
  
        res.render("opinion_form", {
          title: "Give your Opinion",
          readers: allReaders,
          books: allBooks,
          opinion: opinion,
          errors: errors.array(),
        });
      } else {
        await opinion.save();
        res.redirect(opinion.url);
      }
    }),
  ];

  exports.opinion_update_get = asyncHandler(async (req, res, next) => {
    const [opinion, allReaders, allBooks] = await Promise.all([
      Opinion.findById(req.params.id).populate('reader').populate('book').exec(),
      Reader.find().exec(),
      Book.find().exec(),
    ]);
  
    if (opinion === null) {
      const err = new Error("Opinion not found");
      err.status = 404;
      return next(err);
    }
  
    res.render("opinion_form", {
      title: "Change Opinion",
      readers: allReaders,
      books: allBooks,
      opinion: opinion,
    });
  
  });

  exports.opinion_update_post = [
    body("reader", "Reader must not be empty.")
      .trim()
      .isLength({ min: 1 })
      .escape(),
    body("book", "Book must not be empty.")
      .trim()
      .isLength({ min: 1 })
      .escape(),
    body("comments", "Comments must not be empty.")
      .trim()
      .isLength({ min: 1 })
      .escape(),
    asyncHandler(async (req, res, next) => {
      const errors = validationResult(req);
      const opinion = new Opinion({
        reader: req.body.reader,
        book: req.body.book,
        comments: req.body.comments,
        _id: req.params.id,
      });
  
      if (!errors.isEmpty()) {
        const [allBooks, allReaders] = await Promise.all([
          Book.find().exec(),
          Reader.find().exec(),
        ]);
  
        res.render("opinion_form", {
          title: "Change your Opinion",
          readers: allReaders,
          books: allBooks,
          opinion: opinion,
          errors: errors.array(),
        });
        return;
      } else {
        const updatedOpinion = await Opinion.findByIdAndUpdate(req.params.id, opinion, {});
        res.redirect(updatedOpinion.url);
      }
      
    }),
  ];