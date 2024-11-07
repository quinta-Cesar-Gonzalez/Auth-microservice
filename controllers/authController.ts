import { Request, Response } from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import User from "../models/User";
import dotenv from "dotenv";
import logger from "../utils/logger";

dotenv.config();
const SALT_ROUNDS = 10;
const JWT_SECRET = process.env.JWT_SECRET || "your_jwt_secret";

export const register = async (req: Request, res: Response) => {
  try {
    const { email, password, ...otherData } = req.body;
    logger.info(`[Controller - register]: Attempting to register user`);

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      logger.warn(`[Controller - register]: Registration failed. User already exists`);
      return res.status(400).json({ message: "User already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, SALT_ROUNDS);
    const newUser = new User({
      email,
      password: hashedPassword,
      ...otherData,
    });

    await newUser.save();
    logger.info(`[Controller - register]: User registered successfully`);
    res.status(201).json({ message: "User registered successfully" });
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    logger.error(`[Controller - register]: Server error during registration: ${errorMessage}`);
    res.status(500).json({ message: "Server error" });
  }
};

export const login = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;
    logger.info(`[Controller - login]: Attempting login`);

    const user = await User.findOne({ email });
    if (!user || !user.password) {
      logger.warn(`[Controller - login]: Login failed. Invalid credentials`);
      return res.status(400).json({ message: "Invalid credentials" });
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      logger.warn(`[Controller - login]: Login failed. Invalid credentials`);
      return res.status(400).json({ message: "Invalid credentials" });
    }

    const token = jwt.sign({ id: user._id }, JWT_SECRET, { expiresIn: "1h" });
    logger.info(`[Controller - login]: Login successful`);

    res.json({
      IP: "https://www.quintaapp.com.mx:3000",
      IPclte: "https://www.quintaapp.com.mx:3001",
      empresa: "tsmTrucking",
      usuario: "DIE",
      nombre: user.nombre,
      token,
      email: user.email,
      utilidad: 10,
    });
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    logger.error(`[Controller - login]: Server error during login: ${errorMessage}`);
    res.status(500).json({ message: "Server error" });
  }
};

export const googleAuth = async (req: Request, res: Response) => {
  try {
    const googleUser = req.user as any;
    logger.info(`[Controller - googleAuth]: Attempting Google authentication`);

    let user = await User.findOne({ client_googleId: googleUser.client_googleId });
    if (!user) {
      logger.info(`[Controller - googleAuth]: No existing user found, creating new user for Google ID`);
      user = new User({
        client_googleId: googleUser.client_googleId,
        nombre: googleUser.nombre,
        email: googleUser.email,
      });
      await user.save();
      logger.info(`[Controller - googleAuth]: New user created successfully`);
    }
    else {
      logger.info(`[Controller - googleAuth]: Existing user found for Google ID`);
    }

    const token = jwt.sign({ id: user._id }, JWT_SECRET, { expiresIn: "1h" });
    logger.info(`[Controller - googleAuth]: Google authentication successful`);

    res.json({
      IP: "https://www.quintaapp.com.mx:3000",
      IPclte: "https://www.quintaapp.com.mx:3001",
      empresa: "tsmTrucking",
      usuario: "DIE",
      nombre: user.nombre,
      token,
      email: user.email,
      utilidad: 10,
    });
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    logger.error(`[Controller - googleAuth]: Server error during Google authentication: ${errorMessage}`);
    res.status(500).json({ message: "Server error" });
  }
};

export const getAllUsers = async (req: Request, res: Response) => {
  try {
    logger.info(`[Controller - getAllUsers]: Fetching all users`);

    const users = await User.find();
    logger.info(`[Controller - getAllUsers]: Successfully fetched all users`);
    res.status(200).json(users);
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    logger.error(`[Controller - getAllUsers]: Error fetching users: ${errorMessage}`);
    res.status(500).json({ message: "Server error" });
  }
};

export const deleteUserById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    logger.info(`[Controller - deleteUserById]: Attempting to delete user`);

    const user = await User.findByIdAndDelete(id);
    if (!user) {
      logger.warn(`[Controller - deleteUserById]: User not found`);
      return res.status(404).json({ message: "User not found" });
    }

    logger.info(`[Controller - deleteUserById]: User deleted successfully`);
    res.status(200).json({ message: "User deleted successfully" });
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    logger.error(`[Controller - deleteUserById]: Server error during user deletion: ${errorMessage}`);
    res.status(500).json({ message: "Server error" });
  }
};




