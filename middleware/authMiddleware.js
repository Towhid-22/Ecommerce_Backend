function authMiddleware(req, res, next) {
  if (req.session.user) {
    next();
  } else {
    return res.status(400).json({
      success: false,
      message: "Unauthorized",
    });
  }
  // console.log("Auth middleware", req.session.user)
}

exports.authMiddleware = authMiddleware;
