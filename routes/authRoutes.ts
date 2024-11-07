import { Router } from "express";
import passport from "passport";
import {
  login,
  register,
  googleAuth,
  getAllUsers,
  deleteUserById,
} from "../controllers/authController";
import logger from "../utils/logger";

const router = Router();

/**
 * @swagger
 * /api/auth/login:
 *   post:
 *     summary: Login with email and password
 *     tags: [Authentication]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *               password:
 *                 type: string
 *     responses:
 *       200:
 *         description: User logged in successfully
 *       400:
 *         description: Invalid credentials
 *       500:
 *         description: Server error
 */
router.post("/login", (req, res, next) => {
  logger.info(`[Routes - login]: Received login request`);
  login(req, res).catch((error) => {
    logger.error(`[Routes - login]: Error processing login request: ${error}`);
    next(error);
  });
});

/**
 * @swagger
 * /api/auth/register:
 *   post:
 *     summary: Register a new user
 *     tags: [Authentication]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *               password:
 *                 type: string
 *     responses:
 *       201:
 *         description: User registered successfully
 *       400:
 *         description: User already exists
 *       500:
 *         description: Server error
 */
router.post("/register", (req, res, next) => {
  logger.info(`[Routes - register]: Received registration request`);
  register(req, res).catch((error) => {
    logger.error(`[Routes - register]: Error processing registration request: ${error}`);
    next(error);
  });
});

/**
 * @swagger
 * /api/auth/google:
 *   get:
 *     summary: Google OAuth login
 *     tags: [Authentication]
 *     responses:
 *       302:
 *         description: Redirects to Google OAuth login page
 */
router.get("/google", (req, res, next) => {
  logger.info(`[Routes - google]: Initiating Google OAuth login`);
  passport.authenticate("google", { scope: ["profile", "email"] })(req, res, next);
});

/**
 * @swagger
 * /api/auth/google/callback:
 *   get:
 *     summary: Google OAuth callback
 *     tags: [Authentication]
 *     responses:
 *       302:
 *         description: Redirects on successful authentication
 *       500:
 *         description: Server error
 */
router.get(
  "/google/callback",
  passport.authenticate("google", {
    failureRedirect: "https://quintaapp.com.mx:3001/sllmenus.html",
  }),
  (req, res, next) => {
    logger.info(`[Routes - googleCallback]: Google OAuth callback successful`);
    googleAuth(req, res).catch((error) => {
      logger.error(`[Routes - googleCallback]: Error in Google OAuth callback: ${error}`);
      next(error);
    });
  }
);

/**
 * @swagger
 * /api/auth/users:
 *   get:
 *     summary: Get all users
 *     tags: [User Management]
 *     responses:
 *       200:
 *         description: List of all users
 *       500:
 *         description: Server error
 */
router.get("/users", (req, res, next) => {
  logger.info(`[Routes - getAllUsers]: Received request to fetch all users`);
  getAllUsers(req, res).catch((error) => {
    logger.error(`[Routes - getAllUsers]: Error fetching users: ${error}`);
    next(error);
  });
});

/**
 * @swagger
 * /api/auth/users/{id}:
 *   delete:
 *     summary: Delete a user by ID
 *     tags: [User Management]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: The user ID
 *     responses:
 *       200:
 *         description: User deleted successfully
 *       404:
 *         description: User not found
 *       500:
 *         description: Server error
 */
router.delete("/users/:id", (req, res, next) => {
  const { id } = req.params;
  logger.info(`[Routes - deleteUserById]: Received request to delete user with ID: ${id}`);
  deleteUserById(req, res).catch((error) => {
    logger.error(`[Routes - deleteUserById]: Error deleting user with ID ${id}: ${error}`);
    next(error);
  });
});

export default router;
