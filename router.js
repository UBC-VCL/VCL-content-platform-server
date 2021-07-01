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
  authenticateUser,
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

// POST route for user authentication
router.post("/api/users/auth", authenticateUser);

export default router;
