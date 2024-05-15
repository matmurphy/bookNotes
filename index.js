import express from "express";
import bodyParser from "body-parser";
import pg from "pg";

const app = express();
const port = 3000;

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));

const db= new pg.Client({
  user: "postgres",
  host: "localhost",
  database: "permalist",
  password: "#databaseMonarch94",
  port: 5432,
});

db.connect();

app.get("/", async (req, res) => {
  const items = await db.query("SELECT * FROM items ORDER BY id ASC");
  res.render("index.ejs", {
    listTitle: "Today",
    listItems: items.rows,
  });
});

app.post("/add", async (req, res) => {

  const newItem = req.body.newItem;
  await db.query("INSERT INTO items (title) VALUES (($1))", [newItem]);
  res.redirect("/");

});

app.post("/edit", async (req, res) => {

  const itemID = req.body.updatedItemId;
  const updatedTitle = req.body.updatedItemTitle;

  db.query("UPDATE items SET title = ($1) WHERE id = ($2);", [updatedTitle, itemID]);
  res.redirect("/");

});

app.post("/delete", async (req, res) => {

  const deleteItemId = req.body.deleteItemId;

  db.query("DELETE FROM items WHERE id = ($1);", [deleteItemId]);
  res.redirect("/");
});

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});