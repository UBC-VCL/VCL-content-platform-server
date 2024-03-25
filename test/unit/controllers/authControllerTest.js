import {changePassword, changeUsername, createUser, deleteUser, getUsers, loginUser, logoutUser, refreshToken} from '../../../controllers/authController.js';
import httpMocks  from 'node-mocks-http';
import mongoose from 'mongoose';
import User from '../../../models/user.model.js';


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
		});

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
            
			expect(response._getStatusCode()).toBe(500);
		});
        
		// test('should not have permission', async ()=> {
		// 	const mockHasAdminPermissions = jest.spyOn(authHelper, 'hasAdminPermissions');
		// 	mockHasAdminPermissions.mockReturnValueOnce(Promise.resolve(false));
		// 	const request = httpMocks.createRequest({
		// 		method: 'POST',
		// 		url: '/api/users',
		// 		body: {
		// 			username: 'test1',
		// 			password: 'test1',
		// 			permissions: 'admin',
		// 			member: mongoose.Types.ObjectId()
		// 		}
		// 	});
		// 	const response = httpMocks.createResponse();
		// 	await createUser(request, response);
		// 	expect(response._getStatusCode()).toBe(400);
		// });
	});

	describe('test on get User', ()=> {
		// test('No permission, should fail', async()=> {
		// 	const mockHasAdminPermissions = jest.spyOn(authHelper, 'hasAdminPermissions');
		// 	mockHasAdminPermissions.mockReturnValueOnce(Promise.resolve(false));
		// 	const request = httpMocks.createRequest({
		// 		method: 'GET',
		// 		url: '/api/users',
		// 	});
		// 	const response = httpMocks.createResponse();
		// 	await getUsers(request, response);
		// 	expect(response._getStatusCode()).toBe(400);
		// });

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
			await loginUser(request, response);
			expect(response._getStatusCode()).toBe(200);
			let temp = JSON.parse(response._getData());
			expect(temp.data.username).toBe('test1');
			expect(temp.data.permissions).toBe('admin');
			expect(response.cookies).toBeTruthy();
			// expect(temp.data.refresh_token == refreshTokenBefore).toBeTruthy();
		});
	});

	// describe('test on refreshing token', ()=> {
	// 	test('a dummy refresh token is sent. should fail', async ()=> {
	// 		const request = httpMocks.createRequest({
	// 			method: 'GET',
	// 			url: '/api/tokens/access_token',
	// 			headers: {
	// 				authorization: 'dummyRefreshToken'
	// 			}
	// 		});
	// 		const response = httpMocks.createResponse();
	// 		await refreshToken(request, response);
	// 		expect(response._getStatusCode()).toBe(400);
        
	// 	});
	// 	test('a wrongly formatted request is sent. should fail', async ()=> {
	// 		const request = httpMocks.createRequest({
	// 			method: 'GET',
	// 			url: '/api/tokens/access_token',
	// 			headers: {
	// 				dummy: 'dummyRefreshToken'
	// 			}
	// 		});
	// 		const response = httpMocks.createResponse();
	// 		await refreshToken(request, response);
	// 		expect(response._getStatusCode()).toBe(400);
	// 	});
	// 	test('should pass', async ()=> {
	// 		let testUser = await User.findOne({username:'test1'});
	// 		const request = httpMocks.createRequest({
	// 			method: 'GET',
	// 			url: '/api/tokens/access_token',
	// 			headers: {
	// 				authorization: testUser.refresh_token
	// 			}
	// 		});
	// 		const response = httpMocks.createResponse();
	// 		await refreshToken(request, response);
	// 		expect(response._getStatusCode()).toBe(200);
	// 		const temp = JSON.parse(response._getData());
	// 		expect(temp.access_token != testUser.access_token).toBeTruthy();
	// 	});

	// 	//TODO: how can this test throw error code 500? when?
	// });

	describe('test on logging out', ()=> {
		// test('the authorization is failed. Should fail', async ()=> {
		// 	const mockHasAdminPermissions = jest.spyOn(authHelper, 'hasFrontendAPIKey');
		// 	mockHasAdminPermissions.mockReturnValueOnce(Promise.resolve(false));
		// 	const request = httpMocks.createRequest({
		// 		method: 'POST',
		// 		url: '/api/users/logout',
		// 	});
		// 	const response = httpMocks.createResponse();
		// 	await logoutUser(request, response);
		// 	expect(response._getStatusCode()).toBe(400);
		// });

		test('should pass', async()=>{
			const request = httpMocks.createRequest({
				method: 'POST',
				url: '/api/users/logout',
				cookies: {
					access_token: 'cookie_value'
				}
			});
			const response = httpMocks.createResponse();
			response.clearCookie = jest.fn();
			await logoutUser(request, response);
			expect(response._getStatusCode()).toBe(200);
			// expect(temp.refresh_token != testUser.refresh_token).toBeTruthy();
			expect(response.clearCookie).toHaveBeenCalledWith('access_token');
		})
	});

	// // UNSOLVED: I think only admin users can change the username
	describe('test on changing the username', ()=>{
		test('should pass', async () => {
			const request = httpMocks.createRequest({
				method: 'PUT',
				url: '/api/users/change_username',
				body: {
					username: 'test2'
				},
			});
			request.user = {username: 'test1'};
			const response = httpMocks.createResponse();
			await changeUsername(request, response);
			expect(response._getStatusCode()).toBe(200);
			const testuser = await User.findOne({username: 'test2'});
			expect(testuser).toBeTruthy();
		});

		// test('is not an admin, should fail', async() => {
		// 	const mockHasAdminPermissions = jest.spyOn(authHelper, 'hasFrontendAPIKey');
		// 	mockHasAdminPermissions.mockReturnValueOnce(Promise.resolve(false));
		// 	const request = httpMocks.createRequest({
		// 		method: 'PUT',
		// 		url: '/api/users/change_username',
		// 		body: {
		// 			username: 'test2'
		// 		}
		// 	});
		// 	const response = httpMocks.createResponse();
		// 	await changeUsername(request, response);
		// 	expect(response._getStatusCode()).toBe(400);
		// });
	});

	describe('test on changing the password', ()=>{
		test('should pass', async () => {
			const testuserBefore = await User.findOne({username: 'test2'});
			const request = httpMocks.createRequest({
				method: 'PUT',
				url: '/api/users/change_password',
				body: {
					password: 'test2'
				},
			});
			request.user = {username: 'test2'};
			const response = httpMocks.createResponse();
			await changePassword(request, response);
			expect(response._getStatusCode()).toBe(200);
			const testuserAfter = await User.findOne({username: 'test2'}); //TODO: confirm with sarah about data attached in response body
			expect(testuserAfter.hash != testuserBefore.hash).toBeTruthy();
			// expect(testuserAfter.refresh_token != testuserBefore.refresh_token).toBeTruthy(); 
		});

		// test('user isn't an authenticated user', async () => {
		// 	const request = httpMocks.createRequest({
		// 		method: 'PUT',
		// 		url: '/api/users/change_password',
		// 		body: {
		// 			password: 'test2'
		// 		},
		// 	});
		// 	const response = httpMocks.createResponse();
		// 	await changePassword(request, response);
		// 	expect(response._getStatusCode()).toBe(400);
		// });
	});

	describe('test on deleting users', ()=>{
		// test('doesn not have admin permission. should fail', async()=> {
		// 	const mockHasAdminPermissions = jest.spyOn(authHelper, 'hasAdminPermissions');
		// 	mockHasAdminPermissions.mockReturnValueOnce(Promise.resolve(false));
		// 	const request = httpMocks.createRequest({
		// 		method: 'DELETE',
		// 		url: 'api/users/:username',
		// 		params: {
		// 			username: 'test2'
		// 		}
		// 	});
		// 	const response = httpMocks.createResponse();
		// 	await deleteUser(request, response);
		// 	expect(response._getStatusCode()).toBe(400);
		// });

		test('should pass', async()=> {
			const request = httpMocks.createRequest({
				method: 'DELETE',
				url: 'api/users/:username',
				params: {
					username: 'test1'
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

