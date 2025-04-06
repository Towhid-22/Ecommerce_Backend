const express = require("express");
const app = express();
require("dotenv").config();
const PORT = process.env.PORT || 3000;
const router = require("./router");
// localhost:4000
app.use(router)

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
