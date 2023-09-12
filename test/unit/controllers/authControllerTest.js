
import {changePassword, changeUsername, createUser, deleteUser, getUsers, loginUser, logoutUser, refreshToken} from '../../../controllers/authController.js';

import httpMocks  from 'node-mocks-http';
import mongoose from 'mongoose';
import User from '../../../models/user.model.js';
import authHelper from '../../../helpers/authHelper.js';


const authControllerTest = () => {
describe('test user auth controller', ()=>{
		test('send valid user information, should created a user', async () => {
			const request = httpMocks.createRequest({
				method: 'POST',
				url: '/api/users',
				body: {
					username: 'test1',
					password: 'test1',
					permissions: 'admin',
					member: mongoose.Types.ObjectId()
				}
			});
            
			const response = httpMocks.createResponse();
			await createUser(request, response);
            
			expect(response._getStatusCode()).toBe(200);
			const temp = JSON.parse(response._getData());
            
			expect(temp.data.username).toBe('test1');
            
			expect(temp.data.permissions).toBe('admin');
        
		} );
		test('send the same user information, should not pass', async()=> {
			const request = httpMocks.createRequest({
				method: 'POST',
				url: '/api/users',
				body: {
					username: 'test1',
					password: 'test1',
					permissions: 'admin',
					member: mongoose.Types.ObjectId()
				}
			});
			const response = httpMocks.createResponse();
			await createUser(request, response);
            
			expect(response._getStatusCode()== 500).toBeTruthy();
            
		});

        
		test('should not have permission', async ()=> {
			const mockHasAdminPermissions = jest.spyOn(authHelper, 'hasAdminPermissions');
			mockHasAdminPermissions.mockReturnValueOnce(Promise.resolve(false));
			const request = httpMocks.createRequest({
				method: 'POST',
				url: '/api/users',
				body: {
					username: 'test1',
					password: 'test1',
					permissions: 'admin',
					member: mongoose.Types.ObjectId()
				}
			});
			const response = httpMocks.createResponse();
			await createUser(request, response);
			expect(response._getStatusCode()).toBe(400);
		});
        
	});

	describe('test on get User', ()=> {
		test('No permission, should fail', async()=> {
			const mockHasAdminPermissions = jest.spyOn(authHelper, 'hasAdminPermissions');
			mockHasAdminPermissions.mockReturnValueOnce(Promise.resolve(false));
			const request = httpMocks.createRequest({
				method: 'GET',
				url: '/api/users',
			});
			const response = httpMocks.createResponse();
			await getUsers(request, response);
			expect(response._getStatusCode()).toBe(400);

            

		});
		test('should pass', async ()=>{
			const request = httpMocks.createRequest({
				method: 'GET',
				url: '/api/users',
			});
			let expectedCount = await User.count();
			const response = httpMocks.createResponse();
			await getUsers(request, response);
			expect(response._getStatusCode()).toBe(200);
			let temp = JSON.parse(response._getData());
			expect(temp.data.length).toBe(expectedCount);
		})
	});

	describe('test on logining users', ()=>{
		test('missing password in request body, should fail', async()=> {
			const request = httpMocks.createRequest({
				method: 'POST',
				url: '/api/users/login',
				body: {
					username: 'test1'
				}
			});
			const response = httpMocks.createResponse();
			await loginUser(request, response);
			expect(response._getStatusCode()).toBe(400);
			let temp = JSON.parse(response._getData());
			expect(temp['message']).toBe('Invalid request body.');

		});

		test('missing username in request body, should fail', async()=> {
			const request = httpMocks.createRequest({
				method: 'POST',
				url: '/api/users/login',
				body: {
					password: 'test1'
				}
			});
			const response = httpMocks.createResponse();
			await loginUser(request, response);
			expect(response._getStatusCode()).toBe(400);
			let temp = JSON.parse(response._getData());
			expect(temp['message']).toBe('Invalid request body.');

		});

		test('fake a username that does not exists, should fail', async()=> {
			const request = httpMocks.createRequest({
				method: 'POST',
				url: '/api/users/login',
				body: {
					username: 'dummyUsername',
					password: 'test1'
				}
			});
			const response = httpMocks.createResponse();
			await loginUser(request, response);
			expect(response._getStatusCode()).toBe(400);
			let temp = JSON.parse(response._getData());
			expect(temp['message']).toBe('Invalid username or password.');

		});

		test('unmatched password, should fail', async()=> {
			const request = httpMocks.createRequest({
				method: 'POST',
				url: '/api/users/login',
				body: {
					username: 'test1',
					password: 'dummyPassword'
				}
			});
			const response = httpMocks.createResponse();
			await loginUser(request, response);
			expect(response._getStatusCode()).toBe(400);
			let temp = JSON.parse(response._getData());
			expect(temp['message']).toBe('Invalid username or password.');

		});

		test('should pass', async()=> {
			const request = httpMocks.createRequest({
				method: 'POST',
				url: '/api/users/login',
				body: {
					username: 'test1',
					password: 'test1'
				}
			});
			const response = httpMocks.createResponse();

			let user = await User.findOne({username: 'test1'});
			let accessTokenBefore = user.access_token;
			let refreshTokenBefore = user.refresh_token;
			await loginUser(request, response);
			expect(response._getStatusCode()).toBe(200);
			let temp = JSON.parse(response._getData());
			expect(temp.data.username).toBe('test1');
			expect(temp.data.access_token != accessTokenBefore).toBeTruthy();
			expect(temp.data.permissions).toBe('admin');
			expect(temp.data.refresh_token == refreshTokenBefore).toBeTruthy();

		});
        
	});

	describe('test on refreshing token', ()=> {
		test('a dummy refresh token is sent. should fail', async ()=> {
			const request = httpMocks.createRequest({
				method: 'GET',
				url: '/api/tokens/access_token',
				headers: {
					authorization: 'dummyRefreshToken'
				}
			});
			const response = httpMocks.createResponse();
			await refreshToken(request, response);
			expect(response._getStatusCode()).toBe(400);
        
		});
		test('a wrongly formatted request is sent. should fail', async ()=> {
			const request = httpMocks.createRequest({
				method: 'GET',
				url: '/api/tokens/access_token',
				headers: {
					dummy: 'dummyRefreshToken'
				}
			});
			const response = httpMocks.createResponse();
			await refreshToken(request, response);
			expect(response._getStatusCode()).toBe(400);
		});
		test('should pass', async ()=> {
			let testUser = await User.findOne({username:'test1'});
			const request = httpMocks.createRequest({
				method: 'GET',
				url: '/api/tokens/access_token',
				headers: {
					authorization: testUser.refresh_token
				}
			});
			const response = httpMocks.createResponse();
			await refreshToken(request, response);
			expect(response._getStatusCode()).toBe(200);
			const temp = JSON.parse(response._getData());
			expect(temp.access_token != testUser.access_token).toBeTruthy();
		});

		//TODO: how can this test throw error code 500? when?
	});

	describe('test on logining out', ()=> {
		test('the authorization is failed. Should fail', async ()=> {
			const mockHasAdminPermissions = jest.spyOn(authHelper, 'hasMemberPermissions');
			mockHasAdminPermissions.mockReturnValueOnce(Promise.resolve(false));
			const request = httpMocks.createRequest({
				method: 'POST',
				url: '/api/users/logout',
			});
			const response = httpMocks.createResponse();
			await logoutUser(request, response);
			expect(response._getStatusCode()).toBe(400);
		});

		test('should pass', async()=>{
			let testUser = await User.findOne({username:'test1'});
			const request = httpMocks.createRequest({
				method: 'POST',
				url: '/api/users/logout',
				headers: {
					authorization: testUser.access_token,
				}
			});
			const response = httpMocks.createResponse();
			await logoutUser(request, response);
			expect(response._getStatusCode()).toBe(200);
			const temp = JSON.parse(response._getData());
			expect(temp.access_token != testUser.access_token).toBeTruthy();
			expect(temp.refresh_token != testUser.refresh_token).toBeTruthy();
		})
	});

	// UNSOLVED: I think only admin users can change the username
	describe('test on changing the username', ()=>{
		test('should pass', async () => {
			let testuser = await User.findOne({username: 'test1'});
			const request = httpMocks.createRequest({
				method: 'PUT',
				url: '/api/users/change_username',
				body: {
					username: 'test2'
				},
				headers: {
					authorization: testuser.access_token
				}
			});
			const response = httpMocks.createResponse();
			await changeUsername(request, response);
			expect(response._getStatusCode()).toBe(200);
		});

		test('is not member, should fail', async() => {
			const mockHasAdminPermissions = jest.spyOn(authHelper, 'hasMemberPermissions');
			mockHasAdminPermissions.mockReturnValueOnce(Promise.resolve(false));
			const request = httpMocks.createRequest({
				method: 'PUT',
				url: '/api/users/change_username',
				body: {
					username: 'test2'
				}
			});
			const response = httpMocks.createResponse();
			await changeUsername(request, response);
			expect(response._getStatusCode()).toBe(400);
		});
	});

	describe('test on changing the password', ()=>{
		test('should pass', async () => {
			let testuserBefore = await User.findOne({username: 'test2'});
			const request = httpMocks.createRequest({
				method: 'PUT',
				url: '/api/users/change_password',
				body: {
					password: 'test2'
				},
				headers: {
					authorization: testuserBefore.access_token
				}
			});
			const response = httpMocks.createResponse();
			await changePassword(request, response);
			expect(response._getStatusCode()).toBe(200);
			let testuserAfter = await User.findOne({username: 'test2'}); //TODO: confirm with sarah about data attached in response body
			expect(testuserAfter.hash != testuserBefore.hash).toBeTruthy();
			expect(testuserAfter.access_token != testuserBefore.access_token).toBeTruthy();
			expect(testuserAfter.refresh_token != testuserBefore.refresh_token).toBeTruthy(); 
		});

		test('should pass', async () => {
            
			//console.log(testuser.access_token);
			const request = httpMocks.createRequest({
				method: 'PUT',
				url: '/api/users/change_password',
				body: {
					password: 'test2'
				},
				headers: {
					authorization: 'dummyHeader'
				}
			});
			const response = httpMocks.createResponse();
			await changePassword(request, response);
			expect(response._getStatusCode()).toBe(400);
        
		});

        

        
	});

	describe('test on deleting users', ()=>{
		test('doesn not have admin permission. should fail', async()=> {
			const mockHasAdminPermissions = jest.spyOn(authHelper, 'hasAdminPermissions');
			mockHasAdminPermissions.mockReturnValueOnce(Promise.resolve(false));
			const request = httpMocks.createRequest({
				method: 'DELETE',
				url: 'api/users/:username',
				params: {
					username: 'test2'
				}
			});
			const response = httpMocks.createResponse();
			await deleteUser(request, response);
			expect(response._getStatusCode()).toBe(400);
		});

		test('should pass', async()=> {
			const request = httpMocks.createRequest({
				method: 'DELETE',
				url: 'api/users/:username',
				params: {
					username: 'test2'
				}
			});
			const response = httpMocks.createResponse();
			await deleteUser(request, response);
			expect(response._getStatusCode()).toBe(200);
		});

		//TODO：should it pass when delete an non-existed user?
		test('should pass', async()=> {
			const request = httpMocks.createRequest({
				method: 'DELETE',
				url: 'api/users/:username',
				params: {
					username: 'test2'
				}
			});
			const response = httpMocks.createResponse();
			await deleteUser(request, response);
			expect(response._getStatusCode()).toBe(200);
		});
	});
};

export default authControllerTest;

