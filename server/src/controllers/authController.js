import bcrypt from "bcrypt";
import jwt from "jsonwebtoken"

import prisma from "../prisma/client.js";
import { error, success } from "../utils/responseHandler.js";

// Register
export const register = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    if (!name || !email || !password)
      return error(res, "All fields required", 400);

    const existingUser = await prisma.user.findUnique({ where: { email } });
    if (existingUser) return error(res, "Email already registered", 400);

    const hashedPassword = await bcrypt.hash(password, 10);

    const data = await prisma.user.create({
      data: { name, email, password: hashedPassword },
    });

    success(res, "User registered successfully. Please login.", {name,email});
  } catch (err) {
    console.error(err);
    error(res, "Registration failed", 500);
  }
};

//login
export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return error(res, "Email and password are required", 400);
    }

    // Find user in DB
    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) return error(res, "Invalid credentials", 401);

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return error(res, "Invalid credentials", 401);

    const token = jwt.sign(
      { id: user.id, email: user.email, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    success(res, "Login successful", {
      user: { id: user.id, email: user.email, role: user.role },
      token,
    });
  } catch (err) {
    console.error(err);
    error(res, "Login failed", 500);
  }
};
