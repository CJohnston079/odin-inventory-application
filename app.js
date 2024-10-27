require("dotenv").config();

const express = require("express");
const methodOverride = require("method-override");
const path = require("node:path");
const indexRouter = require("./routes/indexRouter");
const booksRouter = require("./routes/booksRouter");
const authorsRouter = require("./routes/authorsRouter");
const genresRouter = require("./routes/genresRouter");
const decadesRouter = require("./routes/decadesRouter");
const countriesRouter = require("./routes/countriesRouter");
const { title } = require("node:process");
const app = express();

app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");

app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, "public")));
app.use(methodOverride("_method"));

app.use("/", indexRouter);
app.use("/books", booksRouter);
app.use("/authors", authorsRouter);
app.use("/genres", genresRouter);
app.use("/decades", decadesRouter);
app.use("/countries", countriesRouter);

app.use((req, res, next) => res.render("pageNotFound", { title: "Page Not Found" }));

const port = process.env.PORT || 3000;
app.listen(port, () => console.log(`server listening on port ${port}`));
