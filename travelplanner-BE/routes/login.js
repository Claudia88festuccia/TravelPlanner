import express from "express";
import jwt from "jsonwebtoken";
import User from "../models/User.js";
import dotenv from "dotenv";
dotenv.config();

const router = express.Router();

router.post("/", async (req, res, next) => {
  try {
    const { email, password } = req.body;
    const user = await Author.checkCredentials(email, password);

    if (user) {
      const payload = { _id: user._id, email: user.email };
      const accessToken = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: "1d" });

      res.send({
        accessToken, 
        nome: user.nome,
        email: user.email
      });
    } else {
      res.status(401).send({ error: "Credenziali non valide" });
    }
  } catch (err) {
    next(err);
  }
});


export default router;