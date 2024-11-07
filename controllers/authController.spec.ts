import { Request, Response } from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import User from "../models/User";
import * as authController from "../controllers/authController";
import { beforeEach, describe, expect, it, jest } from '@jest/globals';

// Mock dependencies
jest.mock("bcryptjs");
jest.mock("jsonwebtoken");
jest.mock("../models/User");

describe("authController", () => {
  let req: Partial<Request>;
  let res: Partial<Response>;
  let jsonMock: jest.Mock;
  let statusMock: jest.Mock;
  
  beforeEach(() => {
    jsonMock = jest.fn();
    statusMock = jest.fn().mockReturnValue({ json: jsonMock });
    req = { body: {}, params: {} };
    res = { json: jsonMock, status: statusMock } as Partial<Response>;
  });

  describe("register", () => {
    it("should register a user successfully", async () => {
      req.body = { email: "test@test.com", password: "password123" };
      (User.findOne as jest.Mock<any>).mockResolvedValue(null);
      (bcrypt.hash as jest.Mock<any>).mockResolvedValue("hashedPassword");
      (User.prototype.save as jest.Mock<any>).mockResolvedValue(true);

      await authController.register(req as Request, res as Response);

      expect(statusMock).toHaveBeenCalledWith(201);
      expect(jsonMock).toHaveBeenCalledWith({ message: "User registered successfully" });
    });

    it("should return 400 if user already exists", async () => {
      req.body = { email: "test@test.com" };
      (User.findOne as jest.Mock<any>).mockResolvedValue(true);

      await authController.register(req as Request, res as Response);

      expect(statusMock).toHaveBeenCalledWith(400);
      expect(jsonMock).toHaveBeenCalledWith({ message: "User already exists" });
    });

    it("should handle server errors", async () => {
      req.body = { email: "test@test.com", password: "password123" };
      (User.findOne as jest.Mock<any>).mockRejectedValue(new Error("Database error"));

      await authController.register(req as Request, res as Response);

      expect(statusMock).toHaveBeenCalledWith(500);
      expect(jsonMock).toHaveBeenCalledWith({ message: "Server error" });
    });
  });

  describe("login", () => {
    it("should login successfully and return a token", async () => {
      req.body = { email: "test@test.com", password: "password123" };
      (User.findOne as jest.Mock<any>).mockResolvedValue({ password: "hashedPassword", _id: "123" });
      (bcrypt.compare as jest.Mock<any>).mockResolvedValue(true);
      (jwt.sign as jest.Mock<any>).mockReturnValue("fakeToken");

      await authController.login(req as Request, res as Response);

      expect(jsonMock).toHaveBeenCalledWith(expect.objectContaining({ token: "fakeToken" }));
    });

    it("should return 400 for invalid credentials", async () => {
      req.body = { email: "test@test.com", password: "password123" };
      (User.findOne as jest.Mock<any>).mockResolvedValue(null);

      await authController.login(req as Request, res as Response);

      expect(statusMock).toHaveBeenCalledWith(400);
      expect(jsonMock).toHaveBeenCalledWith({ message: "Invalid credentials" });
    });

    it("should handle server errors", async () => {
      (User.findOne as jest.Mock<any>).mockRejectedValue(new Error("Database error"));

      await authController.login(req as Request, res as Response);

      expect(statusMock).toHaveBeenCalledWith(500);
      expect(jsonMock).toHaveBeenCalledWith({ message: "Server error" });
    });
  });

  describe("googleAuth", () => {
    it("should authenticate user with Google successfully", async () => {
      req.user = { id: "google123", nombre: "Test User", email: "test@test.com" };
      (User.findOne as jest.Mock<any>).mockResolvedValue(null);
      (User.prototype.save as jest.Mock<any>).mockResolvedValue(true);
      (jwt.sign as jest.Mock<any>).mockReturnValue("fakeToken");

      await authController.googleAuth(req as Request, res as Response);

      expect(jsonMock).toHaveBeenCalledWith(expect.objectContaining({ token: "fakeToken" }));
    });

    it("should handle server errors", async () => {
      req.user = { id: "google123", nombre: "Test User", email: "test@test.com" };
      (User.findOne as jest.Mock<any>).mockRejectedValue(new Error("Database error"));

      await authController.googleAuth(req as Request, res as Response);

      expect(statusMock).toHaveBeenCalledWith(500);
      expect(jsonMock).toHaveBeenCalledWith({ message: "Server error" });
    });
  });

  describe("getAllUsers", () => {
    it("should fetch all users successfully", async () => {
      const users = [{ email: "test@test.com" }];
      (User.find as jest.Mock<any>).mockResolvedValue(users);

      await authController.getAllUsers(req as Request, res as Response);

      expect(statusMock).toHaveBeenCalledWith(200);
      expect(jsonMock).toHaveBeenCalledWith(users);
    });

    it("should handle server errors", async () => {
      (User.find as jest.Mock<any>).mockRejectedValue(new Error("Database error"));

      await authController.getAllUsers(req as Request, res as Response);

      expect(statusMock).toHaveBeenCalledWith(500);
      expect(jsonMock).toHaveBeenCalledWith({ message: "Server error" });
    });
  });

  describe("deleteUserById", () => {
    it("should delete a user successfully", async () => {
      req.params = { id: "123" };
      (User.findByIdAndDelete as jest.Mock<any>).mockResolvedValue(true);

      await authController.deleteUserById(req as Request, res as Response);

      expect(statusMock).toHaveBeenCalledWith(200);
      expect(jsonMock).toHaveBeenCalledWith({ message: "User deleted successfully" });
    });

    it("should return 404 if user not found", async () => {
      req.params = { id: "123" };
      (User.findByIdAndDelete as jest.Mock<any>).mockResolvedValue(null);

      await authController.deleteUserById(req as Request, res as Response);

      expect(statusMock).toHaveBeenCalledWith(404);
      expect(jsonMock).toHaveBeenCalledWith({ message: "User not found" });
    });

    it("should handle server errors", async () => {
      req.params = { id: "123" };
      (User.findByIdAndDelete as jest.Mock<any>).mockRejectedValue(new Error("Database error"));

      await authController.deleteUserById(req as Request, res as Response);

      expect(statusMock).toHaveBeenCalledWith(500);
      expect(jsonMock).toHaveBeenCalledWith({ message: "Server error" });
    });
  });
});
