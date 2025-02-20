const path = require("path");
const express = require("express");
const app = express();
const port = 3002;
const client = require("./redisClient");
const mongoose = require("mongoose");

mongoose
  .connect(
    "mongodb+srv://node_cms:nodeprojectcms999@nodecluster9.y9rvn.mongodb.net/cms"
  )
  .then(() => console.log("Mongoose Connected"))
  .catch((err) => console.log("Monog Error", err));

// set the view engine to ejs
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
const contentRoute = require("./routes/contentRoute");
const fetchData = require("./routes/contents");
app.use(express.static(__dirname + "/public"));

// Redirect all requests from news.pinga.us to pinga.us
// app.use((req, res, next) => {
//   if (req.hostname === "news.pinga.us") {
//     return res.redirect(301, "https://pinga.us" + req.originalUrl);
//   }
//   next();
// });

app.get("/home", (req, rest) => {
  rest.render("index");
});

app.get("/privacy-policy", (req, res) => {
  res.render("privacy");
});

app.use("/", contentRoute);
app.use("/database", fetchData);

app.listen(port, () => {
  console.log(`App listening on port ${port}`);
});
