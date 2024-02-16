import express from "express";
import bodyParser from "body-parser";
import pg from "pg";

const app = express();
const port = 3000;

const db = new pg.Client({
  user: "postgres",
  host: "localhost",
  database: "permalist",
  password: "Abhi@123",
  port: 5432,
});
db.connect();

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));


async function present_items(){
  const result = await db.query("SELECT * FROM items");
  return result.rows;
}
present_items();

app.get("/", async (req, res) => {
  const items = await present_items();
  res.render("index.ejs", {
    listTitle: "Today",
    listItems: items,
  });
});

app.post("/add", async (req, res) => {
  const item = req.body.newItem;
  try {
    await db.query("INSERT INTO items (title) VALUES ($1);",[item]);
    res.redirect("/");
  } catch (err) {
    console.log(err);
  }
  
});

app.post("/edit", async (req, res) => {
  const item_id = req.body.updatedItemId;
  const item_title = req.body.updatedItemTitle;
  try {
    await db.query("UPDATE items SET title = ($1) WHERE id = $2;",[item_title, item_id]);
    res.redirect("/");
  } catch (error) {
    console.log(error);
    
  }
});

app.post("/delete", async (req, res) => {
  const id = req.body.deleteItemId;
  try {
    await db.query("DELETE FROM items WHERE id = $1;",[id]);
    res.redirect("/");
  } catch (error) {
    console.log(error);
  }
});

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
