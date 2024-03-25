import express from 'express';
import validate from './validations/validation.js';
import projectValidationSchema from './validations/models/projectValidation.model.js';
import { userCreationSchema } from './validations/models/userValidation.model.js';
import snapshotValidationSchema from './validations/models/snapshotValidation.model.js';

//Snapshot controller imports
import {
	createSnapshot,
	getAllSnapshots,
	deleteSnapshot,
	getSnapshot,
	updateSnapshot,
} from './controllers/snapshotController.js';

// Project controller imports
import {
	createProject,
	getProject,
	getProjects,
	updateProject,
	deleteProject,
} from './controllers/projectController.js';

//AUTH controller imports
import {
	createUser,
	loginUser,
	refreshToken,
	getUsers,
	deleteUser,
	logoutUser,
	changeUsername,
	changePassword,
} from './controllers/authController.js';

//MEMBER controller imports

import { createMember, getMember, getProjectMembers } from './controllers/memberController.js';


//QUERY controller imports
import { postQuery } from './controllers/queryController.js';
import resourceValidationSchema from './validations/models/resourceValidation.model.js';
import {
	createResource,
	deleteResource,
	getResource,
	getResourcesInCategory,
	updateResource,
} from './controllers/resourceController.js';
import { authenticateTokenMiddleWare, hasAdminPermissions } from './middleware/authMiddleware.js';
const router = express.Router();

router.all('*', authenticateTokenMiddleWare);

/**
 * SNAPSHOT ENDPOINTS
 */
router.post('/api/snapshots', validate(snapshotValidationSchema), createSnapshot);
router.get('/api/snapshots', getAllSnapshots);
router.delete('/api/snapshots/:id', deleteSnapshot);
router.get('/api/snapshots/:id', getSnapshot);
router.put('/api/snapshots/:id', updateSnapshot);

/**
 * PROJECT ENDPOINTS
 */
router.get('/api/projects', getProjects);
router.get('/api/projects/:name', getProject);
router.post('/api/projects', validate(projectValidationSchema), createProject);
router.put(
	'/api/projects/:name',
	validate(projectValidationSchema),
	updateProject
);
router.delete('/api/projects/:name', deleteProject);

/**
 * AUTHENTICATION ENDPOINTS
 */
router.post('/api/users', hasAdminPermissions, validate(userCreationSchema), createUser);
router.get('/api/users', hasAdminPermissions, getUsers);
router.delete('/api/users/:username', hasAdminPermissions, deleteUser);
router.post('/api/users/login', loginUser);
router.post('/api/users/logout', logoutUser);
router.get('/api/tokens/access_token', refreshToken);
router.put('/api/users/change_username', changeUsername);
router.put('/api/users/change_password', changePassword);

// POST route for creating lab member

router.post('/api/members', createMember);
router.get('/api/members', getMember);
router.get('/api/members/:project', getProjectMembers);

/**
 * RESOURCES ENDPOINTS
 */
router.post('/api/resources', validate(resourceValidationSchema), createResource);
router.get('/api/resources/:category', getResourcesInCategory);
router.get('/api/resources/:id', getResource);
router.patch('/api/resources/:id', validate(resourceValidationSchema), updateResource);
router.delete('/api/resources/:id', deleteResource);

/**
 * QUERY ENDPOINTS
 */
router.post('/api/query', postQuery);
export default router;
