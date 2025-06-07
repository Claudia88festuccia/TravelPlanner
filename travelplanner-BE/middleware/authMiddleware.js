import jwt from "jsonwebtoken";
import dotenv from "dotenv";
dotenv.config();

const authenticateToken = (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (authHeader) {
    const token = authHeader.split(" ")[1]; 
    jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
      if (err) return res.status(403).json({ error: "Token non valido" });
      req.user = user;
      next();
    });
  } else {
    res.status(401).json({ error: "Token mancante" });
  }
};

export default authenticateToken;

