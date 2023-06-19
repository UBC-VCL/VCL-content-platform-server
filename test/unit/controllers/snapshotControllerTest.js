import httpMocks  from 'node-mocks-http';
import mongoose from 'mongoose';
import { createSnapshot, deleteSnapshot, getAllSnapshots, getSnapshot, updateSnapshot } from '../../../controllers/snapshotController';
import authHelper from '../../../helpers/authHelper.js';
import Snapshot from '../../../models/snapshot.model';
import User from '../../../models/user.model';
const snapshotControllerTest =  ()=>{
	describe('test on create snapshot', ()=>{
        
		test('should pass', async ()=> {
			const mockHasAdminPermissions = jest.spyOn(authHelper, 'hasMemberPermissions');
			mockHasAdminPermissions.mockReturnValueOnce(Promise.resolve(true));
			const request = httpMocks.createRequest({
				url: '/api/snapshots',
				method: 'POST',
				body: {
                    
					title: 'test',
					descriptions: ['test'],
					hyperlinks: ['test.png'],
					date: '3000-01-01',
					project: 'testProject',
					categories: ['c1'],
					contributors: [mongoose.Types.ObjectId('61a2dd6b0076a86ec89cd232')],
					author: mongoose.Types.ObjectId('61a2dd6b0076a86ec89cd232')
                      
				}
			});
			const response = httpMocks.createResponse();
			await createSnapshot(request, response);
			expect(response._getStatusCode()).toBe(200);
			const temp = JSON.parse(response._getData());
			expect(temp.data.title).toBe('test');
			expect(temp.data.descriptions.length).toBe(1);
			expect(temp.data.descriptions[0]).toBe('test');
			expect(temp.data.hyperlinks.length).toBe(1);
			expect(temp.data.hyperlinks[0]).toBe('test.png');
			expect(temp.data.project).toBe('testProject');
			expect(temp.data.categories.length).toBe(1);
			expect(temp.data.categories[0]).toBe('c1');
			expect(temp.data.contributors.length).toBe(1);
			expect(temp.data.contributors[0]).toBe('61a2dd6b0076a86ec89cd232');
			expect(temp.data.author).toBe('61a2dd6b0076a86ec89cd232');
		});

		test('does not have permission. should fail', async ()=> {
			const mockHasAdminPermissions = jest.spyOn(authHelper, 'hasMemberPermissions');
			mockHasAdminPermissions.mockReturnValueOnce(Promise.resolve(false));
			const request = httpMocks.createRequest({
				url: '/api/snapshots',
				method: 'POST',
				body: {
                    
					title: 'test',
					descriptions: ['test'],
					hyperlinks: ['test.png'],
					date: '3000-01-01',
					project: 'testProject',
					categories: ['c1'],
					contributors: [mongoose.Types.ObjectId('61a2dd6b0076a86ec89cd232')],
					author: mongoose.Types.ObjectId('61a2dd6b0076a86ec89cd232')
                      
				}
			});
			const response = httpMocks.createResponse();
			await createSnapshot(request, response);
			expect(response._getStatusCode()).toBe(400);
			const temp = JSON.parse(response._getData());
			expect(temp.message).toBe('Invalid access - must be a member to create a snapshot');
		});

		test('body schema is wrong. should fail.', async ()=> {
			const mockHasAdminPermissions = jest.spyOn(authHelper, 'hasMemberPermissions');
			mockHasAdminPermissions.mockReturnValueOnce(Promise.resolve(true));
			const request = httpMocks.createRequest({
				url: '/api/snapshots',
				method: 'POST',
				body: {
					dummy: 'dummy'
                      
				}
			});
			const response = httpMocks.createResponse();
			await createSnapshot(request, response);
			expect(response._getStatusCode()).toBe(400);
			const temp = JSON.parse(response._getData());
			expect(temp.message).toBe('Error saving timeline snapshot to MongoDB');
		});
	});
    
	describe('test on get all snapshots', ()=>{
		test('should pass', async ()=>{
			let counts = await Snapshot.count();
			const request = httpMocks.createRequest({
				method: 'GET',
				url: '/api/snapshots'

			});
			const response = httpMocks.createResponse();
			await getAllSnapshots(request, response);
			expect(response._getStatusCode()).toBe(200);
			const temp = JSON.parse(response._getData());
			expect(temp.data.length).toBe(counts);
		});

		test('should pass', async ()=>{
			const testSnapshot = await Snapshot.findOne({title: 'test'});
			const request = httpMocks.createRequest({
				method: 'GET',
				url: '/api/snapshots',
				query: {
					project: 'testProject'
				}
			});
			const response = httpMocks.createResponse();
			await getAllSnapshots(request, response);
			expect(response._getStatusCode()).toBe(200);
			const temp = JSON.parse(response._getData());
			expect(temp.data[0]._id).toBe(testSnapshot.id);
			expect(temp.data.length).toBe(1);
		});

		test('should pass', async ()=>{
			const testSnapshot = await Snapshot.findOne({title: 'test'});
			const request = httpMocks.createRequest({
				method: 'GET',
				url: '/api/snapshots',
				query: {
					categories: 'c1'
				}
			});
			const response = httpMocks.createResponse();
			await getAllSnapshots(request, response);
			expect(response._getStatusCode()).toBe(200);
			const temp = JSON.parse(response._getData());
			expect(temp.data[0]._id).toBe(testSnapshot.id);
			expect(temp.data.length).toBe(1);
		});
	});

	describe('test on get a specific snapshot', ()=>{
		test('The id passed does not exists', async ()=>{
			const testSnapshot = await Snapshot.findOne({title: 'test'});
			const request = httpMocks.createRequest({
				method: 'GET',
				url: '/api/snapshots/:id',
				params: {
					id:  'dummyId'
				}
			});
			const response = httpMocks.createResponse();
			await getSnapshot(request, response);
			expect(response._getStatusCode()).toBe(500);
		});
		test('should pass', async ()=>{
			const testSnapshot = await Snapshot.findOne({title: 'test'});
			const request = httpMocks.createRequest({
				method: 'GET',
				url: '/api/snapshots/:id',
				params: {
					id: testSnapshot.id
				}
			});
			const response = httpMocks.createResponse();
			await getSnapshot(request, response);
			expect(response._getStatusCode()).toBe(200);
			const temp = JSON.parse(response._getData());
			expect(temp.data.title).toBe('test');
			expect(temp.data.descriptions.length).toBe(1);
			expect(temp.data.descriptions[0]).toBe('test');
			expect(temp.data.hyperlinks.length).toBe(1);
			expect(temp.data.hyperlinks[0]).toBe('test.png');
			expect(temp.data.project).toBe('testProject');
			expect(temp.data.categories.length).toBe(1);
			expect(temp.data.categories[0]).toBe('c1');
			expect(temp.data.contributors.length).toBe(1);
			expect(temp.data.contributors[0]).toBe('61a2dd6b0076a86ec89cd232');
			expect(temp.data.author).toBe('61a2dd6b0076a86ec89cd232');
		});
	});

	//Need ADMIN_001 user to be present
	describe('test on update snapshot', ()=>{
		test('do not have permission. shoud fail', async ()=>{
			const testSnapshot = await Snapshot.findOne({title: 'test'});
			const mockHasAdminPermissions = jest.spyOn(authHelper, 'hasMemberPermissions');
			mockHasAdminPermissions.mockReturnValueOnce(Promise.resolve(false));
			const request = httpMocks.createRequest({
				url: '/api/snapshots/:id',
				method: 'PUT',
				params: {
					id: testSnapshot.id
				},
				body: {
					contributors: ['Admin_001']
				}
			});
			const response = httpMocks.createResponse();
			await updateSnapshot(request, response);
			expect(response._getStatusCode()).toBe(400);
			const temp = JSON.parse(response._getData());
			expect(temp.message).toBe('Invalid access - must be a user to update a snapshot');
		});
		test('pass a dummy id. shoul fail', async()=>{
			const testSnapshot = await Snapshot.findOne({title: 'test'});
			const mockHasAdminPermissions = jest.spyOn(authHelper, 'hasMemberPermissions');
			mockHasAdminPermissions.mockReturnValueOnce(Promise.resolve(true));
			const request = httpMocks.createRequest({
				url: '/api/snapshots/:id',
				method: 'PUT',
				params: {
					id: 'dummyId'
				},
				body: {
					contributors: ['Admin_001']
				}
			});
			const response = httpMocks.createResponse();
			await updateSnapshot(request, response);
			expect(response._getStatusCode()).toBe(500);
			const temp = JSON.parse(response._getData());
			expect(temp.message).toBe('Internal server error while attempting to update snapshot');
		});
		test('should pass', async ()=>{
			const testSnapshot = await Snapshot.findOne({title: 'test'});
			const adminUser = await User.findOne({username: 'ADMIN_001'});
			const mockHasAdminPermissions = jest.spyOn(authHelper, 'hasMemberPermissions');
			mockHasAdminPermissions.mockReturnValueOnce(Promise.resolve(true));
			const request = httpMocks.createRequest({
				url: '/api/snapshots/:id',
				method: 'PUT',
				params: {
					id: testSnapshot.id
				},
				body: {
					contributors: ['Admin_001']
				}
			});
			const response = httpMocks.createResponse();
			await updateSnapshot(request, response);
			expect(response._getStatusCode()).toBe(200);
			const temp = JSON.parse(response._getData());
			expect(temp.data.title).toBe('test');
			expect(temp.data.descriptions.length).toBe(1);
			expect(temp.data.descriptions[0]).toBe('test');
			expect(temp.data.hyperlinks.length).toBe(1);
			expect(temp.data.hyperlinks[0]).toBe('test.png');
			expect(temp.data.project).toBe('testProject');
			expect(temp.data.categories.length).toBe(1);
			expect(temp.data.categories[0]).toBe('c1');
			expect(temp.data.contributors.length).toBe(1);
			expect(temp.data.contributors[0]).toBe(adminUser._id.toString());
			expect(temp.data.author).toBe('61a2dd6b0076a86ec89cd232');
		});
        
	});

	describe('test on delete snapshots', () => {
		test('does not have permmission. should fail', async ()=> {
			const testSnapshot = await Snapshot.findOne({title: 'test'});
			const mockHasAdminPermissions = jest.spyOn(authHelper, 'hasMemberPermissions');
			mockHasAdminPermissions.mockReturnValueOnce(Promise.resolve(false));
			const request = httpMocks.createRequest({
				url: '/api/snapshots',
				method: 'DELETE',
				params: {
					id: testSnapshot.id
				}
			});
			const response = httpMocks.createResponse();
			await deleteSnapshot(request, response);
			expect(response._getStatusCode()).toBe(400);
			const temp = JSON.parse(response._getData());
			expect(temp.message).toBe('Invalid access - must be a user to delete a snapshot');
		});
		test('request params is missing. should fail', async ()=> {
           
			const mockHasAdminPermissions = jest.spyOn(authHelper, 'hasMemberPermissions');
			mockHasAdminPermissions.mockReturnValueOnce(Promise.resolve(true));
			const request = httpMocks.createRequest({
				url: '/api/snapshots',
				method: 'DELETE',
				params: {
					id: 'dummy'
				}
			});
			const response = httpMocks.createResponse();
			await deleteSnapshot(request, response);
			expect(response._getStatusCode()).toBe(400);
			const temp = JSON.parse(response._getData());
			expect(temp.message).toBe('Error deleting timeline snapshot from MongoDB');
		});
		test('should pass', async()=>{
			const testSnapshot = await Snapshot.findOne({title: 'test'});
			const adminUser = await User.findOne({username: 'ADMIN_001'});
			const mockHasAdminPermissions = jest.spyOn(authHelper, 'hasMemberPermissions');
			mockHasAdminPermissions.mockReturnValueOnce(Promise.resolve(true));
			const request = httpMocks.createRequest({
				url: '/api/snapshots',
				method: 'DELETE',
				params: {
					id: testSnapshot.id
				}
			});
			const response = httpMocks.createResponse();
			await deleteSnapshot(request, response);
			expect(response._getStatusCode()).toBe(200);
			const temp = JSON.parse(response._getData());
			expect(temp.data.title).toBe('test');
			expect(temp.data.descriptions.length).toBe(1);
			expect(temp.data.descriptions[0]).toBe('test');
			expect(temp.data.hyperlinks.length).toBe(1);
			expect(temp.data.hyperlinks[0]).toBe('test.png');
			expect(temp.data.project).toBe('testProject');
			expect(temp.data.categories.length).toBe(1);
			expect(temp.data.categories[0]).toBe('c1');
			expect(temp.data.contributors.length).toBe(1);
			expect(temp.data.contributors[0]).toBe(adminUser._id.toString());
			expect(temp.data.author).toBe('61a2dd6b0076a86ec89cd232');

		});
	});

};


export default snapshotControllerTest;