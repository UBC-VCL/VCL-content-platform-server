import express from "express";
import validate from "./validations/validation.js";
import projectValidationSchema from "./validations/models/projectValidation.model.js";
import { userCreationSchema } from "./validations/models/userValidation.model.js";

//Snapshot controller imports
import {
  createSnapshot,
  getAllSnapshots,
  deleteSnapshot,
  getSnapshot,
} from "./controllers/snapshotController.js";

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

//MEMBER controller imports
import { createMember } from "./controllers/memberController.js";

const router = express.Router();

/**
 * SNAPSHOT ENDPOINTS
 */
router.post("/api/snapshots", createSnapshot);
router.get("/api/snapshots/:project/:category/:year/:month/:day/:author", getAllSnapshots);
router.delete("/api/snapshots/:id", deleteSnapshot);
router.get("/api/snapshots/:id", getSnapshot);


/**
 * PROJECT ENDPOINTS
 */
router.get("/api/projects", getProjects);
router.get("/api/projects/:name", getProject);
router.post("/api/projects", validate(projectValidationSchema), createProject);
router.put(
  "/api/projects/:name",
  validate(projectValidationSchema),
  updateProject
);
router.delete("/api/projects/:name", deleteProject);

/**
 * AUTHENTICATION ENDPOINTS
 */
router.post("/api/users", validate(userCreationSchema), createUser);
router.get("/api/users", getUsers);
router.delete("/api/users/:username", deleteUser);
router.post("/api/users/login", loginUser);
router.post("/api/users/logout", logoutUser);
router.get("/api/tokens/access_token", refreshToken);

// POST route for creating lab member
router.post("/api/members", createMember);

export default router;
