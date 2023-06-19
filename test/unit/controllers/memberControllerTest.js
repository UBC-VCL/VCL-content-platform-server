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
					firstName: 'test',
					lastName: 'test',
					isActive: false
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
					firstName: 'test',
					lastName: 'test',
					isActive: false,
					projects: ['619c08a2fde7a602c72198d4']
				}
			});
			const response = httpMocks.createResponse();
			await createMember(request, response);
			expect(response._getStatusCode()).toBe(200);
			const temp = JSON.parse(response._getData());
			expect(temp.data.firstName).toBe('test');
			expect(temp.data.lastName).toBe('test');
			expect(temp.data.isActive).toBeFalsy();
			expect(temp.data.projects[0]).toBe('619c08a2fde7a602c72198d4');
			expect(temp.data.projects.length).toBe(1);
			await Member.deleteOne({
				firstName: 'test',
				lastName: 'test',
				isActive: false,
				projects: ['619c08a2fde7a602c72198d4']
			});
		});
	});
};

export default memberControllerTest;