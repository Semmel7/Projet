const express = require("express");
const router = express.Router();

const book_controller = require("../controllers/bookController");
const author_controller = require("../controllers/authorController");
const reader_controller = require("../controllers/readerController");
const opinion_controller = require("../controllers/opinionController");

router.get("/", book_controller.index);

router.get("/book/create", book_controller.book_create_get);

router.post("/book/create", book_controller.book_create_post);

router.get("/book/:id/delete", book_controller.book_delete_get);

router.post("/book/:id/delete", book_controller.book_delete_post);

router.get("/book/:id/update", book_controller.book_update_get);

router.post("/book/:id/update", book_controller.book_update_post);

router.get("/book/:id", book_controller.book_detail);

router.get("/books", book_controller.book_list);

router.get("/author/create", author_controller.author_create_get);

router.post("/author/create", author_controller.author_create_post);

router.get("/author/:id/delete", author_controller.author_delete_get);

router.post("/author/:id/delete", author_controller.author_delete_post);

router.get("/author/:id/update", author_controller.author_update_get);

router.post("/author/:id/update", author_controller.author_update_post);

router.get("/author/:id", author_controller.author_detail);

router.get("/authors", author_controller.author_list);

router.get("/reader/create", reader_controller.reader_create_get);

router.post("/reader/create", reader_controller.reader_create_post);

router.get("/reader/:id/delete", reader_controller.reader_delete_get);

router.post("/reader/:id/delete", reader_controller.reader_delete_post);

router.get("/reader/:id/update", reader_controller.reader_update_get);

router.post("/reader/:id/update", reader_controller.reader_update_post);

router.get("/reader/:id", reader_controller.reader_detail);

router.get("/readers", reader_controller.reader_list);

router.get("/opinion/create", opinion_controller.opinion_create_get);

router.post("/opinion/create", opinion_controller.opinion_create_post);

router.get("/opinion/:id/delete", opinion_controller.opinion_delete_get);

router.post("/opinion/:id/delete", opinion_controller.opinion_delete_post);

router.get("/opinion/:id/update", opinion_controller.opinion_update_get);

router.post("/opinion/:id/update", opinion_controller.opinion_update_post);

router.get("/opinion/:id", opinion_controller.opinion_detail);

module.exports = router;
