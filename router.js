import express from 'express';

//CRUD controller imports
import {
  createSnapshot,
  getAllSnapshots,
  deleteSnapshot,
  getSnapshot,
} from "./controllers/crudController.js";

const router = express.Router();

//Define POST route for creating timeline snapshot
router.post("/api/snapshots", createSnapshot);

// Define GET route for getting all timeline snapshots
router.get("/api/snapshots", getAllSnapshots);

// Define DEL route for deleting a snapshot given the ID
router.delete("/api/snapshots/:id", deleteSnapshot);

// Definte GET route for getting a snapshot given the ID
router.get("/api/snapshots/:id", getSnapshot);

export default router;
