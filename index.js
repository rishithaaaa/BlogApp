const express = require("express");
const path = require("path");
const mongoose = require("mongoose");
const userRoute = require("./routes/user");
const cookieParser = require("cookie-parser");
const checkForAuthenticationCookie = require("./middlewares/authentication");

const app = express();
const PORT = 8000;

app.use(cookieParser());
mongoose.connect("mongodb://localhost:27017/BlogApp").then(() => {
  console.log("connected to database");
});

app.set("view engine", "ejs");
app.set("views", path.resolve("./views"));

app.use(express.json());
app.use(express.urlencoded({extended: false}));
app.use(checkForAuthenticationCookie("token"));

app.get("/", (req, res) => {
  res.render("home", {
    user: req.user,
  });
});

app.use("/user", userRoute);

app.listen(PORT, () =>
  console.log(`listening on port http://localhost:${PORT}`)
);
