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
 */
router.post("/login", (req, res, next) => {
  logger.info(`Received login request for email: ${req.body.email}`);
  login(req, res).catch((error) => {
    logger.error(`Error in login route: ${error}`);
    next(error);
  });
});

/**
 * @swagger
 * /api/auth/register:
 *   post:
 *     summary: Register a new user
 *     tags: [Authentication]
 */
router.post("/register", (req, res, next) => {
  logger.info(`Received registration request for email: ${req.body.email}`);
  register(req, res).catch((error) => {
    logger.error(`Error in register route: ${error}`);
    next(error);
  });
});

/**
 * @swagger
 * /api/auth/google:
 *   get:
 *     summary: Google OAuth login
 *     tags: [Authentication]
 */
router.get("/google", (req, res, next) => {
  logger.info("Initiating Google OAuth login");
  logger.debug(`Initiating Google OAuth login, ${req.body} `);
  passport.authenticate("google", { scope: ["profile", "email"] })(
    req,
    res,
    next
  );
});

router.get(
  "/google/callback",
  passport.authenticate("google", {
    failureRedirect: "https://quintaapp.com.mx:3001/sllmenus.html",
  }),
  (req, res, next) => {
    logger.info("Google OAuth callback successful");
    googleAuth(req, res).catch((error) => {
      logger.error(`Error in Google OAuth callback: ${error}`);
      next(error);
    });
  }
);

// Ruta para obtener todos los usuarios
router.get("/users", (req, res, next) => {
  logger.info("Received request to fetch all users");
  getAllUsers(req, res).catch((error) => {
    logger.error(`Error in getAllUsers route: ${error}`);
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
  logger.info(`Received request to delete user with ID: ${id}`);
  deleteUserById(req, res).catch((error) => {
    logger.error(`Error in deleteUserById route: ${error}`);
    next(error);
  });
});

export default router;
