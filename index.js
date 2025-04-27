const express = require("express");
const app = express();
const connectDB = require("./config/db");
require("dotenv").config();
const session = require("express-session");
const MongoStore = require("connect-mongo");
const PORT = process.env.PORT || 3000;

app.use(
  session({
    store: MongoStore.create({ mongoUrl: process.env.MONGODB_URL }),
    secret: process.env.sessionsecret,
    resave: false,
    saveUninitialized: false,
    cookie: { secure: false, maxAge: 1000 * 60 },
  })
);

const router = require("./router");

connectDB();
// localhost:4000
app.use(express.json());
app.use(router);

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
