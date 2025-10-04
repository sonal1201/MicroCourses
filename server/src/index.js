import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import prisma from "./prisma/client.js";

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());

app.get("/", async (req, res) => {
  res.json({ message: "MicroCourses API is running" });
});

app.get("/users", async (req, res) => {
  s;
  const users = await prisma.user.findMany();
});

// Server start
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
