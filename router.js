import express from "express";

//CRUD controller imports
import {
  createSnapshot,
  getAllSnapshots,
  deleteSnapshot,
  getSnapshot,
} from "./controllers/crudController.js";

// Project controller imports
import {
  createProject,
  getProject,
  getProjects,
  updateProject,
  deleteProject,
} from "./controllers/projectController.js";

//AUTH controller imports
import {
  createUser,
  loginUser,
  refreshToken,
  getUsers,
  deleteUser,
  logoutUser,
} from "./controllers/authController.js";

const router = express.Router();

/**
 * SNAPSHOT ENDPOINTS
 */

router.post("/api/snapshots", createSnapshot);
router.get("/api/snapshots", getAllSnapshots);
router.delete("/api/snapshots/:id", deleteSnapshot);
router.get("/api/snapshots/:id", getSnapshot);

/**
 * PROJECT ENDPOINTS
 */
router.post("/api/projects", createProject);
router.get("/api/projects", getProjects);
router.get("/api/projects/:id", getProject);
router.put("/api/projects/:id", updateProject);
router.delete("/api/projects/:id", deleteProject);


/**
 * AUTHENTICATION ENDPOINTS
 */
router.post("/api/users", createUser);
router.get("/api/users", getUsers);
router.delete("/api/users/:username", deleteUser);
router.post("/api/users/login", loginUser);
router.post("/api/users/logout", logoutUser);
router.get("/api/tokens/access_token", refreshToken);

export default router;
