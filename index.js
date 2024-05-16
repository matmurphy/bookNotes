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

const userIndex = 1;

app.get("/", async (req, res) => {
    const result = await db.query("SELECT first_name, last_name, title, isbn, rating, review_description FROM users JOIN books ON users.id = books.user_id JOIN reviews ON reviews.book_id = books.id");
    
    const first_name = result.rows[0].first_name;
    const last_name = result.rows[0].last_name;
    const isbn_api = "https://covers.openlibrary.org/b/isbn/" + result.rows[0].isbn + "-L.jpg";
    const book_title = result.rows[0].title;
    const rating = result.rows[0].rating;
    const rating_description = result.rows[0].review_description;

    res.render("index.ejs", { 
        first_name: first_name, 
        last_name: last_name,
        isbn_api: isbn_api,
        book_title: book_title,
        rating: rating,
        review_description: rating_description,
    });
});

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});