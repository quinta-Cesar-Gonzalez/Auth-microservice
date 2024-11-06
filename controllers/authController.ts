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

    logger.info(`Attempting to register user with email: ${email}`);

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      logger.warn(
        `Registration failed. User with email ${email} already exists.`
      );
      return res.status(400).json({ message: "User already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = new User({
      email,
      password: hashedPassword,
      ...otherData,
    });

    await newUser.save();
    logger.info(`User registered successfully with email: ${email}`);
    res.status(201).json({ message: "User registered successfully" });
  } catch (error) {
    logger.error(`Server error during registration: ${error}`);
    res.status(500).json({ message: "Server error" });
  }
};

export const login = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;

    logger.info(`Attempting login for user with email: ${email}`);

    const user = await User.findOne({ email });
    if (!user || !user.password) {
      logger.warn(`Login failed. Invalid credentials for email: ${email}`);
      return res.status(400).json({ message: "Invalid credentials" });
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      logger.warn(`Login failed. Invalid credentials for email: ${email}`);
      return res.status(400).json({ message: "Invalid credentials" });
    }

    const token = jwt.sign({ id: user._id }, JWT_SECRET, { expiresIn: "1h" });
    logger.info(`Login successful for user with email: ${email}`);

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
    logger.error(`Server error during login: ${error}`);
    res.status(500).json({ message: "Server error" });
  }
};

//   try {
//     const { email, password } = req.body;

//     logger.info(`Attempting login for user with email: ${email}`);

//     const user = await User.findOne({ email });
//     if (!user) {
//       logger.warn(`Login failed. Invalid credentials for email: ${email}`);
//       return res.status(400).json({ message: "Invalid credentials" });
//     }

//     const isPasswordValid = await bcrypt.compare(password, user.password);
//     if (!isPasswordValid) {
//       logger.warn(`Login failed. Invalid credentials for email: ${email}`);
//       return res.status(400).json({ message: "Invalid credentials" });
//     }

//     const token = jwt.sign({ id: user._id }, JWT_SECRET, { expiresIn: "1h" });
//     logger.info(`Login successful for user with email: ${email}`);

//     res.json({
//       IP: "https://www.quintaapp.com.mx:3000",
//       IPclte: "https://www.quintaapp.com.mx:3001",
//       empresa: "tsmTrucking",
//       usuario: "DIE",
//       nombre: user.nombre,
//       token,
//       email: user.email,
//       utilidad: 10,
//     });
//   } catch (error) {
//     logger.error(`Server error during login: ${error}`);
//     res.status(500).json({ message: "Server error" });
//   }
// };

export const googleAuth = async (req: Request, res: Response) => {
  try {
    const googleUser = req.user as any;
    console.log("google user", googleUser);
    logger.info(
      `Attempting Google authentication for user: ${googleUser.nombre}`
    );

    let user = await User.findOne({ client_googleId: googleUser.id });
    if (!user) {
      console.log('Wacha this shiiiit: ',googleUser.email);
      logger.info(
        `No existing user found for Google ID: ${googleUser.id}. Creating new user. ${googleUser.email}`
      );
      user = new User({
        client_googleId: googleUser.client_googleId,
        nombre: googleUser.nombre,
        email: googleUser.email,
      });
      await user.save();
    }

    const token = jwt.sign({ id: user._id }, JWT_SECRET, { expiresIn: "1h" });
    logger.info(
      `Google authentication successful for user: ${googleUser.nombre}`
    );

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
    logger.error(`Server error during Google authentication: ${error}`);
    res.status(500).json({ message: "Server error" });
  }
};

export const getAllUsers = async (req: Request, res: Response) => {
  try {
    logger.info("Fetching all users");

    // Find all users in the database
    const users = await User.find();

    // Respond with the list of users
    res.status(200).json(users);
  } catch (error) {
    logger.error(`Error fetching users: ${error}`);
    res.status(500).json({ message: "Server error" });
  }
};

export const deleteUserById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    logger.info(`Attempting to delete user with ID: ${id}`);

    const user = await User.findByIdAndDelete(id);

    if (!user) {
      logger.warn(`User with ID ${id} not found.`);
      return res.status(404).json({ message: "User not found" });
    }

    logger.info(`User with ID ${id} deleted successfully.`);
    res.status(200).json({ message: "User deleted successfully" });
  } catch (error) {
    logger.error(`Server error during user deletion: ${error}`);
    res.status(500).json({ message: "Server error" });
  }
};
