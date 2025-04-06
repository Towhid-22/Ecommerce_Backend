const express = require("express");
const router = express.Router();
const routerApi = require("./api");
// localhost:4000/api/v1
// api route
router.use("/api/v1", routerApi);

// route not found middleware
router.use((req, res) => {
  return res.status(404).json({
    success: false,
    message: "Route not found",
  });
});

module.exports = router;
