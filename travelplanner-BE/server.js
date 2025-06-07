import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import connectDB from "./db.js";
import loginRouter from "./routes/login.js";
import usersRouter from "./routes/users.js";
import tripsRouter from "./routes/trips.js";



dotenv.config();
const app = express();

const corsOptions = {
  origin: [
    "http://localhost:3000",
    "https://travel-planner-fe-silk.vercel.app"
  ],
  methods: "GET,POST,PUT,DELETE,PATCH",
  allowedHeaders: "Content-Type, Authorization",
};

app.use(cors(corsOptions));

app.use(express.json());
app.use("/login", loginRouter);
app.use("/users", usersRouter);
app.use("/trips", tripsRouter);



connectDB().then(() => {
  app.listen(process.env.PORT || 3001, () => {
    console.log("Server avviato sulla porta", process.env.PORT || 3001);
    });
  });
