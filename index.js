const express = require("express");
const app = express();
const connectDB = require("./config/db");
const cors = require("cors");
require("dotenv").config();
const session = require("express-session");
const MongoStore = require("connect-mongo");
const PORT = process.env.PORT || 3000;

app.use(
  cors({
    origin: ["http://localhost:3000", "https://sandbox.sslcommerz.com"],
    credentials: true,
  })
);

app.use(
  session({
    store: MongoStore.create({ mongoUrl: process.env.MONGODB_URL }),
    secret: process.env.sessionsecret,
    resave: false,
    saveUninitialized: false,
    cookie: { secure: false, maxAge: 24 * 60 * 60 * 1000 },
    name: "ecommerce",
  })
);

const router = require("./router");
const adminMiddleware = require("./middleware/adminMiddleware");

app.get("/test", adminMiddleware, (req, res) => {
  res.send(req.session.user);
});

connectDB();
// localhost:4000
app.use(express.json());
app.use(express.static("uploads"));
app.use(router);

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
