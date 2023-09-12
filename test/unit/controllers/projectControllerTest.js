import httpMocks  from 'node-mocks-http';
import mongoose from 'mongoose';
import { createProject, deleteProject, getProject, getProjects, updateProject } from '../../../controllers/projectController';
import authHelper from '../../../helpers/authHelper.js';
import Project from '../../../models/project.model';
//TODO: how can this router send 500 response code 
const projectControllerTest = ()=>{
	describe('test on creating project', ()=>{
		test('does not have membership permission', async ()=> {
			const mockHasAdminPermissions = jest.spyOn(authHelper, 'hasMemberPermissions');
			mockHasAdminPermissions.mockReturnValueOnce(Promise.resolve(false));
			const request = httpMocks.createRequest({
				method: 'POST',
				url: '/api/projects',
				body: {
					name: 'test',
					description: 'Hi', 
					members: [mongoose.Types.ObjectId('61a2db9b410ae13f78f05da8')], 
					isActive: true
				}
			});
			const response = httpMocks.createResponse();
			await createProject(request, response);
			expect(response._getStatusCode()).toBe(400);
			const temp = JSON.parse(response._getData());
			expect(temp.message).toBe('Invalid access - must be a member to create a new project.');
		});
		test('should pass', async ()=>{
			const mockHasAdminPermissions = jest.spyOn(authHelper, 'hasMemberPermissions');
			mockHasAdminPermissions.mockReturnValueOnce(Promise.resolve(true));
			const request = httpMocks.createRequest({
				method: 'POST',
				url: '/api/projects',
				body: {
					name: 'test',
					description: 'Hi', 
					members: [mongoose.Types.ObjectId('61a2db9b410ae13f78f05da8')], 
					isActive: true
				}
			});
			const response = httpMocks.createResponse();
			await createProject(request, response);
			expect(response._getStatusCode()).toBe(200);
			const temp = JSON.parse(response._getData());
			expect(temp.data.name).toBe('test');
			expect(temp.data.description).toBe('Hi');
			expect(temp.data.members[0]).toBe('61a2db9b410ae13f78f05da8');
			expect(temp.data.members.length).toBe(1);
			expect(temp.data.isActive).toBeTruthy();
		});
		test('try to create the same user again. Should fail', async () => {
			const mockHasAdminPermissions = jest.spyOn(authHelper, 'hasMemberPermissions');
			mockHasAdminPermissions.mockReturnValueOnce(Promise.resolve(true));
			const request = httpMocks.createRequest({
				method: 'POST',
				url: '/api/projects',
				body: {
					name: 'test',
					description: 'Hi', 
					members: [mongoose.Types.ObjectId('61a2db9b410ae13f78f05da8')], 
					isActive: true
				}
			});
			const response = httpMocks.createResponse();
			await createProject(request, response);
			expect(response._getStatusCode()).toBe(400);
			const temp = JSON.parse(response._getData());
			expect(temp.message).toBe('Error creating new project');
		});
	});

	//TODO: when does error code 500 appear
	describe('test on get projects', ()=>{
        
		test('ahoud pass', async ()=> {
			const expectedCount = await Project.count();
			const request = httpMocks.createRequest({
				method: 'GET',
				url: '/api/projects',
			});
			const response = httpMocks.createResponse();
			await getProjects(request, response);
			expect(response._getStatusCode()).toBe(200);
			const temp = JSON.parse(response._getData());
			expect(temp.data.length).toBe(expectedCount);
		});
            
	});

	describe('test on get project', ()=>{
		test('Pass a dummy user, should fail', async ()=> {
			const request = httpMocks.createRequest({
				method: 'GET',
				url: '/api/projects',
				params:{
					name: 'dummy Name'
				}
			});
			const response = httpMocks.createResponse();
			await getProject(request, response);
			expect(response._getStatusCode()).toBe(400);
		});
		test('should pass', async ()=> {
			const request = httpMocks.createRequest({
				method: 'GET',
				url: '/api/projects',
				params:{
					name: 'test'
				}
			});
			const response = httpMocks.createResponse();
			await getProject(request, response);
			expect(response._getStatusCode()).toBe(200);
			const temp = JSON.parse(response._getData());
			expect(temp.data.name).toBe('test');
			expect(temp.data.description).toBe('Hi');
			expect(temp.data.members[0]).toBe('61a2db9b410ae13f78f05da8');
			expect(temp.data.members.length).toBe(1);
			expect(temp.data.isActive).toBeTruthy();
		});
        
	});

	describe('test on update project', ()=> {
		test('do not have member permission, should fail', async ()=> {
			const mockHasAdminPermissions = jest.spyOn(authHelper, 'hasMemberPermissions');
			mockHasAdminPermissions.mockReturnValueOnce(Promise.resolve(false));
			const request = httpMocks.createRequest({
				method: 'PUT',
				url: '/api/projects',
				params: {
					name: 'test'
				},
				body: {
					description: 'Byebye'
				}
			});
			const response = httpMocks.createResponse();
			await updateProject(request, response);
			expect(response._getStatusCode()).toBe(400);
			const temp = JSON.parse(response._getData());
			expect(temp.message).toBe('Invalid access - must be a member to update a project');
		});

		test('update a project which does not exist, should fail', async ()=> {
			const mockHasAdminPermissions = jest.spyOn(authHelper, 'hasMemberPermissions');
			mockHasAdminPermissions.mockReturnValueOnce(Promise.resolve(true));
			const request = httpMocks.createRequest({
				method: 'PUT',
				url: '/api/projects',
				params: {
					name: 'dummyName'
				},
				body: {
					description: 'Byebye'
				}
			});
			const response = httpMocks.createResponse();
			await updateProject(request, response);
			expect(response._getStatusCode()).toBe(400);
			const temp = JSON.parse(response._getData());
			expect(temp.message).toBe('Could not update project with name: dummyName');
		});

		test(' should pass', async ()=> {
			const mockHasAdminPermissions = jest.spyOn(authHelper, 'hasMemberPermissions');
			mockHasAdminPermissions.mockReturnValueOnce(Promise.resolve(true));
			const request = httpMocks.createRequest({
				method: 'PUT',
				url: '/api/projects',
				params: {
					name: 'test'
				},
				body: {
					description: 'Byebye'
				}
			});
			const response = httpMocks.createResponse();
			await updateProject(request, response);
			expect(response._getStatusCode()).toBe(200);
			const temp = JSON.parse(response._getData());
			expect(temp.data.description).toBe('Byebye');
		});
	});
	describe('test on deleting project', ()=> {
		test('try to delete a project which does not exist, should fail', async ()=> {
			const mockHasAdminPermissions = jest.spyOn(authHelper, 'hasMemberPermissions');
			mockHasAdminPermissions.mockReturnValueOnce(Promise.resolve(true));
			const request = httpMocks.createRequest({
				method: 'DELETE',
				url: '/api/projects',
				params: {
					name: 'dummyUser'
				}
			});
			const response = httpMocks.createResponse();
			await deleteProject(request, response);
			const temp = JSON.parse(response._getData());
			expect(response._getStatusCode()).toBe(400);
			expect(temp.message).toBe('Error - could not delete given project');
		});

		test('does not have member permission, should fail', async ()=> {
			const mockHasAdminPermissions = jest.spyOn(authHelper, 'hasMemberPermissions');
			mockHasAdminPermissions.mockReturnValueOnce(Promise.resolve(false));
			const request = httpMocks.createRequest({
				method: 'DELETE',
				url: '/api/projects',
				params: {
					name: 'test'
				}
			});
			const response = httpMocks.createResponse();
			await deleteProject(request, response);
			const temp = JSON.parse(response._getData());
			expect(response._getStatusCode()).toBe(400);
			expect(temp.message).toBe('Invalid access - must be a member to delete a project.');
		});

		test('should pass', async ()=> {
			const mockHasAdminPermissions = jest.spyOn(authHelper, 'hasMemberPermissions');
			mockHasAdminPermissions.mockReturnValueOnce(Promise.resolve(true));
			const request = httpMocks.createRequest({
				method: 'DELETE',
				url: '/api/projects',
				params: {
					name: 'test'
				}
			});
			const response = httpMocks.createResponse();
			await deleteProject(request, response);
			expect(response._getStatusCode()).toBe(200);
		});
	});
};

export default projectControllerTest;