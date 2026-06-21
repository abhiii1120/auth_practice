import express from "express";
import UserModel from "./models/user.model.js";
import noteModel from "./models/note.model.js";
import cookies from "cookie-parser";
import jwt from "jsonwebtoken";
let app = express();
app.use(express.json());
app.use(cookies());

/**
 * @route POST /api/auth/register
 * @description Register a new user by taking name, email and password in the request body
 * @access Public
 */
app.post("/api/auth/register", async (req, res) => {
  let { name, email, password } = req.body;

  if (!name || !email || !password) {
    res.status(400).json({
      error: "All fields are required",
    });
  }

  const newUser = await UserModel.create({ name, email, password });

  const token = jwt.sign(
    { id: newUser._id, email: newUser.email },
    process.env.JWT_SECRET,
  );

  res.cookie("token", token);

  return res.status(201).json({
    message: "user registered successfully",
    newUser,
  });
});

app.post("/api/auth/login", async (req, res) => {
  try {
    let { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        message: "all fields are required",
      });
    }

    const user = await UserModel.findOne({ email });

    if (!user) {
      return res.status(404).json({
        message: "user not found",
      });
    }

    if (!(await user.matchPassword(password))) {
      return res.status(401).json({ error: "Invalid credentials" });
    }

    const token = jwt.sign(
      { id: user._id, email: user.email },
      process.env.JWT_SECRET,
    );

    res.cookie("token", token);

    return res.status(200).json({
      message: "user loggedin successfully",
      user,
    });
  } catch (error) {
    return res.status(500).json({
      message: "internal server error",
      error,
    });
  }
});

app.get("/api/auth/me", async (req, res) => {
  const token = req.cookies.token;

  return res.status(200).json({
    message: "user details",
    token,
  });
});

app.post("/api/notes", async (req, res) => {
  try {
    let { title, description } = req.body;

    const token = req.cookies.token;
    const user = jwt.verify(token, process.env.JWT_SECRET);

    req.user = user;

    if (!title || !description)
      return res.status(400).json({
        message: "All fields are required",
      });

    const newNote = await noteModel.create({
      title,
      description,
      user: req.user.email,
    });

    return res.status(291).json({
      message: "note created successfully",
      newNote,
    });
  } catch (error) {
    res.status(500).json({
      message: "Internal server error",
    });
  }
});

app.get("/api/notes", async (req, res) => {
  try {
    let notes = await noteModel.find();

    return res.status(200).json({
      message: "notes fetched successfully",
      notes,
    });
  } catch (error) {
    return res.status(500).json({
      message: "Internal server error",
    });
  }
});

app.patch("/api/notes/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const { description } = req.body;
    const token = req.cookies.token;
    const user = jwt.verify(token, process.env.JWT_SECRET);
    req.user = user;
    if (!description) {
      return res.status(400).json({ error: "Description is required" });
    }

    const note = await noteModel.findOne({
      _id: id,
      user: req.user.email,
    });

    if (!note) {
      return res.status(404).json({ error: "Note not found" });
    }

    note.description = description;
    await note.save();

    return res.status(200).json({
      message: "note updated successfully",
      note,
    });
  } catch (error) {
    return res.status(500).json({
      error: "Internal server error",
    });
  }
});

app.delete("/api/notes/:id", async (req, res) => {
  try {
    let { id } = req.params;
    let token = req.cookies.token;
    let user = jwt.verify(token, process.env.JWT_SECRET);
    req.user = user;

    const note = await noteModel.findOne({
      _id: id,
      user: req.user.email,
    });

    if (!note) {
      return res.status(404).json({ error: "note not found" });
    }

    await noteModel.findByIdAndDelete(id);

    return res.status(200).json({
      message: "note deleted successfully",
    });
  } catch (error) {
    return res.status(500).json({
      error: "Internal server error",
    });
  }
});

export default app;
