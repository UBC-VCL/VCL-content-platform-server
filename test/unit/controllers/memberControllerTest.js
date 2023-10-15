import httpMocks  from 'node-mocks-http';
import Member from '../../../models/member.model.js';
import {createMember} from '../../../controllers/memberController.js';

//TODO: how can it send status code 500 ?
const memberControllerTest= ()=>{
	describe('testing on creating member', ()=>{
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
					}
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
			// expect(temp.data.projects.length).toBe(1);
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
};

export default memberControllerTest;