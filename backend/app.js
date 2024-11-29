import express from "express";
import dotenv from "dotenv";
import connectDB from "./conn/conn.js";
import userRoutes from "./routes/user.js";
import bookRoutes from "./routes/book.js"

const app = express();
app.use(express.json());
dotenv.config();
connectDB();

app.use("/api/users", userRoutes);
app.use("/api/books", bookRoutes);
app.listen(process.env.Port, () => {
  console.log(`Server has started listening on port ${process.env.Port}`);
});
