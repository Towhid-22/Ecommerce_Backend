require("dotenv").config();

const express = require("express");
const cors = require("cors");
const session = require("express-session");
const MongoStore = require("connect-mongo");

const connectDB = require("./config/db");
const router = require("./router");
const adminMiddleware = require("./middleware/adminMiddleware");

const app = express();
const PORT = process.env.PORT || 4000;

// Database Connection
connectDB();

// Trust Proxy (Render/Heroku)
app.set("trust proxy", 1);

// Middlewares
app.use(
  cors({
    origin: [
      "http://localhost:3000",
      "https://sandbox.sslcommerz.com",
      "https://clicon-ecommerce-1.onrender.com",
    ],
    credentials: true,
  }),
);

app.use(express.json());

app.use(express.static("uploads"));

app.use(
  session({
    store: MongoStore.create({
      mongoUrl: process.env.MONGODB_URL,
    }),
    secret: process.env.sessionsecret,
    resave: false,
    saveUninitialized: false,
    name: "ecommerce",
    cookie: {
      secure: process.env.NODE_ENV === "production",
      httpOnly: true,
      sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
      maxAge: 24 * 60 * 60 * 1000,
    },
  }),
);

// Routes
app.get("/test", adminMiddleware, (req, res) => {
  res.send(req.session.user);
});

app.use(router);

// Server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
