// import request from "supertest";
// import express, { Application } from "express";
// import passport from "passport";
// import logger from "../utils/logger";

// // Configura el mock de passport antes de importar las rutas
// jest.mock("passport");
// passport.authenticate = jest.fn(() => (req: any, res: any, next: any) => next());

// // Mockea los métodos de logger para evitar logs en las pruebas
// beforeAll(() => {
//   jest.spyOn(logger, "info").mockImplementation(() => {});
//   jest.spyOn(logger, "error").mockImplementation(() => {});
// });

// import authRoutes from "../routes/authRoutes";

// // Mock de controladores
// jest.mock("../controllers/authController", () => ({
//   login: jest.fn((req, res) => res.status(200).json({ message: "User logged in successfully" })),
//   register: jest.fn((req, res, next) => {
//     if (req.body.email === "existinguser@test.com") {
//       return res.status(400).json({ message: "User already exists" });
//     }
//     return res.status(201).json({ message: "User registered successfully" });
//   }),
//   googleAuth: jest.fn((req, res) => res.status(200).json({ message: "Google authentication successful" })),
//   getAllUsers: jest.fn((req, res, next) => {
//     if (req.query.fail) {
//       return next(new Error("Database error"));
//     }
//     return res.status(200).json([{ email: "test@test.com" }]);
//   }),
//   deleteUserById: jest.fn((req, res, next) => {
//     if (req.params.id === "invalid-id") {
//       return res.status(404).json({ message: "User not found" });
//     }
//     return res.status(200).json({ message: "User deleted successfully" });
//   }),
// }));

// const app: Application = express();
// app.use(express.json());
// app.use("/api/auth", authRoutes);

// jest.setTimeout(30000); // Aumenta el tiempo de espera global a 30 segundos

// describe("authRoutes", () => {
//   describe("POST /api/auth/login", () => {
//     it("should login successfully", async () => {
//       const response = await request(app)
//         .post("/api/auth/login")
//         .send({ email: "test@test.com", password: "password123" });

//       expect(response.status).toBe(200);
//     });
//   });

//   describe("POST /api/auth/register", () => {
//     it("should register a new user successfully", async () => {
//       const response = await request(app)
//         .post("/api/auth/register")
//         .send({ email: "newuser@test.com", password: "password123" });

//       expect(response.status).toBe(201);
//     });

//     it("should return 400 if user already exists", async () => {
//       const response = await request(app)
//         .post("/api/auth/register")
//         .send({ email: "existinguser@test.com", password: "password123" });

//       expect(response.status).toBe(400);
//       expect(response.body.message).toBe("User already exists");
//     });
//   });

//   describe("GET /api/auth/google", () => {
//     it("should redirect to Google OAuth", async () => {
//       const response = await request(app).get("/api/auth/google");

//       expect(response.status).toBe(302); // 302 for redirection
//     });
//   });

//   describe("GET /api/auth/google/callback", () => {
//     it("should handle Google OAuth callback", async () => {
//       const response = await request(app).get("/api/auth/google/callback");

//       expect(response.status).toBe(302); // Assuming successful redirection
//     });
//   });

//   describe("GET /api/auth/users", () => {
//     it("should fetch all users", async () => {
//       const response = await request(app).get("/api/auth/users");

//       expect(response.status).toBe(200);
//       expect(Array.isArray(response.body)).toBe(true); // Should return an array of users
//     });

//     it("should handle server error", async () => {
//       const response = await request(app).get("/api/auth/users?fail=true");

//       expect(response.status).toBe(500);
//       expect(response.body.message).toBe("Server error");
//     });
//   });

//   describe("DELETE /api/auth/users/:id", () => {
//     it("should delete a user by ID", async () => {
//       const response = await request(app).delete("/api/auth/users/123");

//       expect(response.status).toBe(200);
//       expect(response.body.message).toBe("User deleted successfully");
//     });

//     it("should return 404 if user not found", async () => {
//       const response = await request(app).delete("/api/auth/users/invalid-id");

//       expect(response.status).toBe(404);
//       expect(response.body.message).toBe("User not found");
//     });

//     it("should handle server error", async () => {
//       const response = await request(app).delete("/api/auth/users/123?fail=true");

//       expect(response.status).toBe(500);
//       expect(response.body.message).toBe("Server error");
//     });
//   });
// });
