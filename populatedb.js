#! /usr/bin/env node

console.log(
    'This script populates some test books and authors to your database. Specified database as argument - e.g.: node populatedb "mongodb+srv://semmel:MongoPassworld@mydb.irxoqhp.mongodb.net/LocalLibraryProject?retryWrites=true&w=majority"'
  );
    const userArgs = process.argv.slice(2);
  
  const Book = require("./models/book");
  const Author = require("./models/author");
  const Reader = require("./models/reader");
  const Opinion = require("./models/opinion");

  const authors = [];
  const books = [];
  const readers = [];
  const opinions = [];

  const mongoose = require("mongoose");
  mongoose.set("strictQuery", false);
  
  const mongoDB = userArgs[0];
  
  main().catch((err) => console.log(err));
  
  async function main() {
    console.log("Debug: About to connect");
    await mongoose.connect(mongoDB);
    console.log("Debug: Should be connected?");
    await createAuthors();
    await createBooks();
    await createReaders();
    await createOpinions();
    console.log("Debug: Closing mongoose");
    mongoose.connection.close();
  }
  
  async function authorCreate(index, first_name, family_name, d_birth, d_death) {
    const authordetail = { first_name: first_name, family_name: family_name };
    if (d_birth != false) authordetail.date_of_birth = d_birth;
    if (d_death != false) authordetail.date_of_death = d_death;
  
    const author = new Author(authordetail);
  
    await author.save();
    authors[index] = author;
    console.log(`Added author: ${first_name} ${family_name}`);
  }
  
  async function bookCreate(index, title, summary, isbn, author) {
    const bookdetail = {
      title: title,
      summary: summary,
      author: author,
      isbn: isbn,
    };
  
    const book = new Book(bookdetail);
    await book.save();
    books[index] = book;
    console.log(`Added book: ${title}`);
  }

  async function readerCreate(index, surname, number) {
    const readerdetail = { surname: surname, number: number };
    const reader = new Reader(readerdetail);
  
    await reader.save();
    readers[index] = reader;
    console.log(`Added reader: ${surname} ${number}`);
  }

  async function opinionCreate(index, reader, comments, book) {
    const opiniondetail = { reader: reader, comments: comments, book: book };
    const opinion = new Opinion(opiniondetail);
  
    await opinion.save();
    opinions[index] = opinion;
    console.log(`Added opinion: ${comments}`);
  }
  
  async function createAuthors() {
    console.log("Adding authors");
    await Promise.all([
      authorCreate(0, "Jean", "Bonbeur", "1874-02-28", false),
      authorCreate(1, "Peter", "Parker", "1996-01-06", false),
      authorCreate(2, "Manuel", "Macaron", "1977-07-22", "2020-03-16"),
    ]);
  }
  
  async function createBooks() {
    console.log("Adding Books");
    await Promise.all([
      bookCreate(0,
        "La meilleur recette du Jambon-Beurre",
        "Apprenez à faire les meilleurs sandwichs pour les piques-niques de vos enfants",
        "0123456789",
        authors[0],
      ),
      bookCreate(1,
        "Spider-Man",
        "Vivez les nouvelles avetures de Spider-Man le meilleur de tous les super-héros !",
        "9876543210",
        authors[1],
      ),
      bookCreate(2,
        "Président et Patissier",
        "Découvrez les secrets d'un président qui était à la fois patissier et president de la republique",
        "0918273645",
        authors[2],
      ),
      bookCreate(3,
        "Man-Spider",
        "Vivez les nouvelles avetures de Man-Spider le meilleur de tous les super-héros !",
        "9081726354",
        authors[1],
      )
    ]);
  }

  async function createOpinions() {
    console.log("Adding opinions");
    await Promise.all([
      opinionCreate(0, readers[1], "Très bon livre je me suis régalé avec les recettes", books[0]),
      opinionCreate(1, readers[0], "ça me rappelle quelqu'un...", books[2]),
      opinionCreate(2, readers[1], "Bof", books[2]),

    ]);
  }

  async function createReaders() {
    console.log("Adding readers");
    await Promise.all([
      readerCreate(0, "Anonymous", "0102030405"),
      readerCreate(1, "Inconnu", "0908070605"),
      readerCreate(2, "Random", "0123456798"),
    ]);
  }
  
  