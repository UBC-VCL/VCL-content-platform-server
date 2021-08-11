import express from 'express';

//CRUD controller imports
import {
  createSnapshot,
  getAllSnapshots,
  deleteSnapshot,
  getSnapshot,
  getSnapshots
} from "./controllers/crudController.js";

//AUTH controller imports
import {
  createUser,
  loginUser,
  refreshToken,
  getUsers,
  deleteUser,
} from "./controllers/authController.js";

const router = express.Router();

//Define POST route for creating timeline snapshot
router.post("/api/snapshots", createSnapshot);

// Define GET route for getting all timeline snapshots [FOR INTERNAL USE ONLY]
router.get("/api/allsnapshots", getAllSnapshots);

// Define GET route for getting a range of timeline snapshots
router.get("/api/snapshots", getSnapshots);

// Define GET route for getting a snapshot given the ID
router.get("/api/snapshots/:id", getSnapshot);

// Define DEL route for deleting a snapshot given the ID
router.delete("/api/snapshots/:id", deleteSnapshot);

// POST route for creating user
router.post("/api/users", createUser);

// GET route for getting users
router.get("/api/users", getUsers);

// DELETE route for deleting user by username
router.delete("/api/users/:username", deleteUser);

// POST route for user authentication
router.post("/api/users/login", loginUser);

// GET route for refreshing access token
router.get("/api/tokens/access_token", refreshToken);

export default router;
