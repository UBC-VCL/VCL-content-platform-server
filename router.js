import express from 'express';

//CRUD controller imports
import {
  createSnapshot,
  getAllSnapshots,
  deleteSnapshot,
  getSnapshot,
} from "./controllers/crudController.js";

//AUTH controller imports
import {
  createUser,
  loginUser,
  refreshToken,
  getUsers,
} from "./controllers/authController.js";

const router = express.Router();

//Define POST route for creating timeline snapshot
router.post("/api/snapshots", createSnapshot);

// Define GET route for getting all timeline snapshots
router.get("/api/snapshots", getAllSnapshots);

// Define DEL route for deleting a snapshot given the ID
router.delete("/api/snapshots/:id", deleteSnapshot);

// Define GET route for getting a snapshot given the ID
router.get("/api/snapshots/:id", getSnapshot);

// POST route for creating user
router.post("/api/users", createUser);

// GET route for getting users
router.get("/api/users/:access_token", getUsers);

// POST route for user authentication
router.post("/api/users/login", loginUser);

// GET route for refreshing access token
router.get("/api/tokens/refresh/:refresh_token", refreshToken);

export default router;
