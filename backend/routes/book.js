import express from "express";
import User from "../models/User.js";
import Book from "../models/Book.js";
import authenticateToken from "./authRoutes.js";

const router = express.Router();

const checkAdmin = async (req, res, next) => {
  try {
    const { id } = req.headers;
    const user = await User.findById(id);

    if (!user) {
      return res.status(404).json({ message: "User not found." });
    }

    if (user.role !== "admin") {
      return res.status(401).json({ message: "Request unauthorized." });
    }

    next();
  } catch (error) {
    res.status(500).json({ message: "Internal Server Error" });
  }
};

// Add a book
router.post("/add-book", authenticateToken, checkAdmin, async (req, res) => {
  try {
    const newBook = new Book({
      url: req.body.url,
      title: req.body.title,
      author: req.body.author,
      price: req.body.price,
      description: req.body.description,
    });
    await newBook.save();
    res.status(200).json({ message: "Book was added successfully." });
  } catch (error) {
    res.status(500).json({ message: "Internal Server Error" });
  }
});

// Update a book
router.put("/update-book", authenticateToken, checkAdmin, async (req, res) => {
  try {
    const { bookid } = req.headers;
    await Book.findByIdAndUpdate(bookid, {
      url: req.body.url,
      title: req.body.title,
      author: req.body.author,
      price: req.body.price,
      description: req.body.description,
    });
    res.status(200).json({ message: "Book was updated successfully." });
  } catch (error) {
    res.status(500).json({ message: "Internal Server Error" });
  }
});

// Delete a book
router.delete(
  "/delete-book",
  authenticateToken,
  checkAdmin,
  async (req, res) => {
    try {
      const { bookid } = req.headers;
      await Book.findByIdAndDelete(bookid);
      res.status(200).json({ message: "Book deleted successfully." });
    } catch (error) {
      res.status(500).json({ message: "Internal Server Error" });
    }
  }
);

export default router;
