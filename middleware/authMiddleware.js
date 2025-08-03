async function authMiddleware(req, res, next) {
  if (req.session.user) {
    req.user = req.session.user;
    next();
  } else {
    return res.status(400).json({ success: false, message: "Unauthorized" });
  }
}
module.exports = authMiddleware;
