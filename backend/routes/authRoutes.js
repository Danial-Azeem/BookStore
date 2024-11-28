import jwt from "jsonwebtoken";

const authenticateToken = (req, res, next) => {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];

  if (token == null) {
    res.status(401).json({
      message: "Authentication token is required.",
    });
  }

  jwt.verify(token, "BookstoreKey", (err, user) => {
    if (err) {
      return res.status(401).json({
        message:
          "Your JWT token is expired. Please sign in again to regenerate a new token.",
      });
    }
    req.user = user;
    next();
  });
};

export default authenticateToken;
