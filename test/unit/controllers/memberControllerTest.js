import httpMocks  from 'node-mocks-http';
import Member from '../../../models/member.model.js';
import {createMember, getMember, getProjectMembers} from '../../../controllers/memberController.js';
import authHelper from '../../../helpers/authHelper.js';

//TODO: how can it send status code 500 ?
const memberControllerTest= ()=>{
	describe('testing on creating member', ()=>{
		// test('No member permissions, should fail', async ()=> {
		// 	const mockHasAdminPermissions = jest.spyOn(authHelper, 'hasFrontendAPIKey');
		// 	mockHasAdminPermissions.mockReturnValueOnce(Promise.resolve(false));
		// 	const request = httpMocks.createRequest({
		// 		method: 'POST',
		// 		url: '/api/members',
		// 		body:{
		// 			dummy: 'dummy'
		// 		}
		// 	});
		// 	const response = httpMocks.createResponse();
		// 	await createMember(request, response);
		// 	expect(response._getStatusCode()).toBe(400);
		// 	const temp = JSON.parse(response._getData());
		// 	expect(temp.message).toBe('Invalid access - must be a member to create another member.');
		// });

		test('send a wrong schema. should fail', async ()=> {
			const request = httpMocks.createRequest({
				method: 'POST',
				url: '/api/members',
				body:{
					dummy: 'dummy'
				}
			});
			const response = httpMocks.createResponse();
			await createMember(request, response);
			expect(response._getStatusCode()).toBe(400);
		});

		test('should pass', async()=>{
			const request = httpMocks.createRequest({
				method: 'POST',
				url: '/api/members',
				body:{
					name: {
						firstname: 'npm',
						lastname: 'test'
					},
					project: '619c08a2fde7a602c72198d4',
					position: 'testposition',
					contact: {
						email: 'npmtest6@gmail.com'
					},
					isAlumni: false,
				}
			});
			const response = httpMocks.createResponse();
			await createMember(request, response);
			expect(response._getStatusCode()).toBe(200);
			const temp = JSON.parse(response._getData());
			expect(temp.data.name.firstname).toBe('npm');
			expect(temp.data.name.lastname).toBe('test');
			expect(temp.data.project).toBe('619c08a2fde7a602c72198d4');
			expect(temp.data.position).toBe('testposition');
			expect(temp.data.contact.email).toBe('npmtest6@gmail.com');
			expect(temp.data.isAlumni).toBe(false);
			await Member.deleteOne({
				name: {
					firstname: 'npm',
					lastname: 'test'
				},
				project: '619c08a2fde7a602c72198d4',
				position: 'testposition',
				contact: {
					email: 'npmtest6@gmail.com'
				}
			});
		});
	});

	describe('testing get all members', () => {
		test('should pass', async () => {
			var expectedCount = 0;
			await Member.countDocuments({}).exec()
				.then(count => {
					expectedCount = count;
				})
				.catch(err => {
					console.log(err);
					fail();
				});
			const request = httpMocks.createRequest({
				method: 'GET',
				url: '/api/members',
			});
			const response = httpMocks.createResponse();
			await getMember(request, response);
			expect(response._getStatusCode()).toBe(200);
			const temp = JSON.parse(response._getData());
			expect(temp.data.length).toBe(expectedCount);
		})
	});

	describe('testing get all members apart of project', () => {
		test('should pass', async () => {
			var expectedCount = 0;
			await Member.countDocuments({
				'project': 'NOVA'
			}).exec()
				.then(count => {
					expectedCount = count;
				})
				.catch(err => {
					console.log(err);
					fail();
				});
			const request = httpMocks.createRequest({
				method: 'GET',
				url: '/api/members/:project',
				params: {
					'project': 'NOVA',
				}
			});
			const response = httpMocks.createResponse();
			await getProjectMembers(request, response);
			expect(response._getStatusCode()).toBe(200);
			const temp = JSON.parse(response._getData());
			expect(temp.data.length).toBe(expectedCount);
		})
	});
};

export default memberControllerTest;