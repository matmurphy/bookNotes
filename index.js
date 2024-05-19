import express from "express";
import bodyParser from "body-parser";
import pg from "pg";

const app = express();
const port = 3000;
const db = new pg.Client({
    user: 'postgres',
    database: 'books',
    port: 5432,
    password: '#databaseMonarch94',
});

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));

db.connect();

let output;

let nextReviewIndex;

let currentReviewIndex;
let first_name;
let last_name;
let isbn_api;
let book_title;
let rating;
let rating_description;
let lastReviewIndex; 

const userIndex = 1;
nextReviewIndex = 0;

async function getBookResults(currentReviewIndex = 0) {
    
    try {

        //query all three tables joined together
        const result = await db.query("SELECT first_name, last_name, title, isbn, rating, review_description FROM users JOIN books ON users.id = books.user_id JOIN reviews ON reviews.book_id = books.id ORDER BY books.id");
        
        output = result.rows;
        //saved required results into variables
        first_name = result.rows[currentReviewIndex].first_name;
        // // last_name = result.rows[currentReviewIndex].last_name;
        // isbn_api = "https://covers.openlibrary.org/b/isbn/" + result.rows[currentReviewIndex].isbn + "-L.jpg";
        // book_title = result.rows[currentReviewIndex].title;
        // rating = result.rows[currentReviewIndex].rating;
        // rating_description = result.rows[currentReviewIndex].review_description;
        // currentReviewIndex = currentReviewIndex;
        // lastReviewIndex = result.rowCount - 1;


    } catch (err) {
        console.log(err);
    }

};


app.get("/", async (req, res) => {

    await getBookResults(nextReviewIndex);

    console.log(output);

    res.render("index.ejs", { 
        first_name: first_name, 
        reviews: output,
        // last_name: last_name,
        // isbn_api: isbn_api,
        // book_title: book_title,
        // rating: rating,
        // review_description: rating_description,
        // currentReviewIndex: nextReviewIndex,
        // lastReviewIndex: lastReviewIndex,
    });
});

app.get("/select-user", async (req, res) => {
    const result = await db.query("SELECT first_name, last_name FROM users")

    res.render("users.ejs", {
        users: result.rows,
    })
});

app.post("/last", async (req, res) => {
    nextReviewIndex = parseInt(req.body.currentReviewIndex) - 1;

    await getBookResults(nextReviewIndex)
    res.redirect("/");
});

app.post("/next", async (req, res) => {
    nextReviewIndex = parseInt(req.body.currentReviewIndex) + 1;

    await getBookResults(nextReviewIndex)
    res.redirect("/");
});


app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});