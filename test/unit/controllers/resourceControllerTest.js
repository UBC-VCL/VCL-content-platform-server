import httpMocks from 'node-mocks-http';
import authHelper, { sendCreateUser } from '../../../helpers/authHelper.js';
import {
	createResource,
	deleteResource,
	getResource,
	getResourcesInCategory,
	updateResource,
} from '../../../controllers/resourceController.js';
import RESOURCE_ERR from '../../../errors/resourceErrors.js';
import Resource from '../../../models/resource.model.js';
import Member from '../../../models/member.model.js';
import User from '../../../models/user.model.js';
import { sendCreateMember } from '../../../helpers/memberHelper.js';
import mongoose from 'mongoose';

const resourceControllerTest = () => {
	describe('resource controller tests', () => {
		let mockHasMemberPermissions;
		let mockHasAdminPermissions;
		let resourceId;
		let userId;
	
		beforeAll(async () => {
			try {
				console.log('Setting up helper method spies');
				mockHasMemberPermissions = jest.spyOn(authHelper, 'hasFrontendAPIKey');
				mockHasAdminPermissions = jest.spyOn(authHelper, 'hasAdminPermissions');
		
				console.log('Creating member for resource tests');
				const member = await sendCreateMember({
					name: {
						firstname: 'resource',
						lastname: 'test',
					},
					project: '619c08a2fde7a602c72198d4',
					position: 'testposition',
					contact: {
						email: 'npmtest6@gmail.com',
					},
				})
				let memberId = member._id.toString();
		
				console.log('Creating users for resource tests');
				userId = await sendCreateUser({
					username: 'resourceUser',
					password: 'resourceUser',
					permissions: 'default_user',
					member: memberId,
				})
				await sendCreateUser({
					username: 'notOwnerNotAdmin',
					password: 'notOwnerNotAdmin',
					permissions: 'default_user',
					member: mongoose.Types.ObjectId(),
				})
				await sendCreateUser({
					username: 'resourceAdmin',
					password: 'resourceAdmin',
					permissions: 'admin',
					member: mongoose.Types.ObjectId(),
				})
			} catch (error) {
				console.log('An error occured while trying to setup test data: ' + error);
			}
		});
	
		afterAll(async () => {
			console.log('Cleaning up setup data for resource tests');
			console.log('Deleting users for resource tests');
			await User.deleteOne({
				username: 'resourceUser'
			})
			await User.deleteOne({
				username: 'notOwnerNotAdmin'
			})
			await User.deleteOne({
				username: 'resourceAdmin'
			})
	
			console.log('Deleting Member for resource tests');
			await Member.deleteOne({
				name: {
					firstname: 'resource',
					lastname: 'test'
				},
				project: '619c08a2fde7a602c72198d4',
				position: 'testposition',
				contact: {
					email: 'npmtest6@gmail.com'
				}
			});
		});
	
		describe('test create resource', () => {
			test('send valid user information, should create a resource', async () => {
				mockHasMemberPermissions.mockReturnValueOnce(Promise.resolve(true));
	
				const request = httpMocks.createRequest({
					method: 'POST',
					url: '/api/resources',
					body: {
						title: 'test_title',
						description: 'test_description',
						category: {
							main: 'COGS 402',
							sub: new Date().getFullYear().toString(),
						},
						author: 'Resource Test',
						username: 'resourceUser',
						resource_link: 'https://www.google.com',
					},
				});
	
				const response = httpMocks.createResponse();
				await createResource(request, response);
	
				expect(response._getStatusCode()).toBe(200);
				const temp = JSON.parse(response._getData());
				resourceId = temp.data._id;
	
				expect(temp.message).toBe('Successfully created new resource');
				expect(temp.data.title).toBe('test_title');
				expect(temp.data.description).toBe('test_description');
				expect(temp.data.category.main).toBe('COGS 402');
				expect(temp.data.category.sub).toBe(new Date().getFullYear().toString());
				expect(temp.data.author).toBe('Resource Test');
				expect(temp.data.owner.username).toBe('resourceUser');
				expect(temp.data.resource_link).toBe('https://www.google.com');
			});
	
			test('no permissions, not a member', async () => {
				mockHasMemberPermissions.mockReturnValueOnce(Promise.resolve(false));
	
				const request = httpMocks.createRequest({
					method: 'POST',
					url: '/api/resources',
					body: {
						title: 'test_title',
						description: 'test_description',
						category: {
							main: 'COGS 402',
							sub: '2024',
						},
						author: 'Resource Test',
						username: 'resourceUser',
						resource_link: 'https://www.google.com',
					},
				});
	
				const response = httpMocks.createResponse();
				await createResource(request, response);
	
				expect(response._getStatusCode()).toBe(400);
				const temp = JSON.parse(response._getData());
				expect(temp.message).toBe(
					'Invalid access - must be a member to create a new resource.'
				);
			});
	
			test('unexpected user not found', async () => {
				mockHasMemberPermissions.mockReturnValueOnce(Promise.resolve(true));
				const request = httpMocks.createRequest({
					method: 'POST',
					url: '/api/resources',
					body: {
						title: 'test_title',
						description: 'test_description',
						category: {
							main: 'COGS 402',
							sub: '2024',
						},
						author: 'Resource Test',
						username: 'bad_username',
						resource_link: 'https://www.google.com',
					},
				});
	
				const response = httpMocks.createResponse();
				await createResource(request, response);
	
				expect(response._getStatusCode()).toBe(500);
				const temp = JSON.parse(response._getData());
				expect(temp.message).toBe(
					'Internal server error while attempting to create resource'
				);
				expect(temp.error).toBe(
					'logged in user could not be found, when it should have been.'
				);
				expect(temp.errCode).toBe(RESOURCE_ERR.RESOURCE001);
			});
		});
	
		describe('test get resources in category', () => {
			beforeAll(async () => {
				console.log('Creating data for getAllResourcesInCategory');
				const prevYearResource = new Resource({
					title: 'prevYear',
					description: 'description',
					category: {
						main: 'COGS 402',
						sub: (new Date().getFullYear() - 1).toString(),
					},
					author: 'Resource Test',
					owner: userId,
					resource_link: 'https://www.google.com',
				});
				await prevYearResource.save();
				const postYearResource = new Resource({
					title: 'postYear',
					description: 'description',
					category: {
						main: 'COGS 402',
						sub: (new Date().getFullYear() + 1).toString(),
					},
					author: 'Resource Test',
					owner: userId,
					resource_link: 'https://www.google.com',
				});
				await postYearResource.save();
			});

			afterAll(async () => {
				console.log('Deleting data for getAllResourcesInCategory');
				await Resource.deleteOne({title: 'prevYear'});
				await Resource.deleteOne({title: 'postYear'});
			})

			test('should pass', async () => {
				const resourceAggregateArray = await Resource.aggregate([
					{
						$match:	{
							'category.main': 'COGS 402'
						}
					},
					{
						$group: {
							_id: '$category.sub'
						}
					}
			]);
			const expectedCount = resourceAggregateArray.length;
				const request = httpMocks.createRequest({
					method: 'GET',
					url: '/api/resources/:category',
					params: {
						category: 'COGS 402',
					},
				});
	
				const response = httpMocks.createResponse();
				await getResourcesInCategory(request, response);
	
				expect(response._getStatusCode()).toBe(200);
				const temp = JSON.parse(response._getData());
	
				expect(temp.data.length).toBe(expectedCount);
				var yearOffSet = 1;
				temp.data.forEach((subCatArr) => {
					expect(subCatArr[0].category.sub).toBe((new Date().getFullYear() + yearOffSet--).toString());
				})
				expect(temp.message).toBe(
					'Successfully retrieved all Resources in category'
				);
			});
		});
	
		describe('test get single resource', () => {
			test('should pass', async () => {
				const request = httpMocks.createRequest({
					method: 'GET',
					url: '/api/resources/:id',
					params: {
						id: resourceId,
					},
				});
	
				const response = httpMocks.createResponse();
				await getResource(request, response);
	
				expect(response._getStatusCode()).toBe(200);
				const temp = JSON.parse(response._getData());
	
				expect(temp.message).toBe(
					`Successfully retrieved Resource with id <${resourceId}>`
				);
				expect(temp.data.title).toBe('test_title');
				expect(temp.data.description).toBe('test_description');
				expect(temp.data.category.main).toBe('COGS 402');
				expect(temp.data.category.sub).toBe(new Date().getFullYear().toString());
				expect(temp.data.author).toBe('Resource Test');
				expect(temp.data.owner.username).toBe('resourceUser');
				expect(temp.data.resource_link).toBe('https://www.google.com');
			});

			test('resource with id doesn\'t exist', async () => {
				const request = httpMocks.createRequest({
					method: 'GET',
					url: '/api/resources/:id',
					params: {
						id: '5f85fd2f0ab7c11e186f146b',
					},
				});
	
				const response = httpMocks.createResponse();
				await getResource(request, response);
	
				expect(response._getStatusCode()).toBe(404);
				const temp = JSON.parse(response._getData());
	
				expect(temp.message).toBe(
					'Couldn\'t find Resource with id <5f85fd2f0ab7c11e186f146b>'
				);
			});
		});
	
		describe('test update resource', () => {
			test('update as user with admin permissions, should pass', async () => {
				mockHasMemberPermissions.mockReturnValueOnce(Promise.resolve(true));
				mockHasAdminPermissions.mockReturnValueOnce(Promise.resolve(true));
	
				const request = httpMocks.createRequest({
					method: 'PATCH',
					url: '/api/resources/:id',
					params: {
						id: resourceId,
					},
					body: {
						title: 'change_name_test',
						description: 'change_desc',
						category: {
							main: 'Skills Workshops',
							sub: 'Coding'
						},
						author: 'New Author',
						username: 'resourceAdmin',
						resource_link: 'https://www.youtube.com',
					},
				});
	
				const response = httpMocks.createResponse();
				await updateResource(request, response);
	
				expect(response._getStatusCode()).toBe(200);
				const temp = JSON.parse(response._getData());
	
				expect(temp.message).toBe('Successfully updated resource');
				expect(temp.data.title).toBe('change_name_test');
				expect(temp.data.description).toBe('change_desc');
				expect(temp.data.category.main).toBe('Skills Workshops');
				expect(temp.data.category.sub).toBe('Coding');
				expect(temp.data.author).toBe('New Author');
				expect(temp.data.owner.username).toBe('resourceUser');
				expect(temp.data.resource_link).toBe('https://www.youtube.com');
			});

			test('update as resource owner, should pass', async () => {
				mockHasMemberPermissions.mockReturnValueOnce(Promise.resolve(true));
				mockHasAdminPermissions.mockReturnValueOnce(Promise.resolve(false));
	
				const request = httpMocks.createRequest({
					method: 'PATCH',
					url: '/api/resources/:id',
					params: {
						id: resourceId,
					},
					body: {
						title: 'title',
						description: 'description',
						category: {
							main: 'COGS 402',
							sub: (new Date().getFullYear() + 1).toString(),
						},
						author: 'Resource Test',
						username: 'resourceUser',
						resource_link: 'https://www.google.com',
					},
				});
	
				const response = httpMocks.createResponse();
				await updateResource(request, response);
	
				const temp = JSON.parse(response._getData());
				console.log(temp.message);
				expect(response._getStatusCode()).toBe(200);

	
				expect(temp.message).toBe('Successfully updated resource');
				expect(temp.data.title).toBe('title');
				expect(temp.data.description).toBe('description');
				expect(temp.data.category.main).toBe('COGS 402');
				expect(temp.data.category.sub).toBe((new Date().getFullYear() + 1).toString());
				expect(temp.data.author).toBe('Resource Test');
				expect(temp.data.owner.username).toBe('resourceUser');
				expect(temp.data.resource_link).toBe('https://www.google.com');
			});

			test('update not the owner or an admin, should fail', async () => {
				mockHasMemberPermissions.mockReturnValueOnce(Promise.resolve(true));
				mockHasAdminPermissions.mockReturnValueOnce(Promise.resolve(false));
	
				const request = httpMocks.createRequest({
					method: 'PATCH',
					url: '/api/resources/:id',
					params: {
						id: resourceId,
					},
					body: {
						title: 'change_name_test',
						description: 'change_desc',
						category: {
							main: 'Skills Workshops',
							sub: 'Coding'
						},
						author: 'New Author',
						username: 'notOwnerNotAdmin',
						resource_link: 'https://www.youtube.com',
					},
				});
	
				const response = httpMocks.createResponse();
				await updateResource(request, response);
	
				expect(response._getStatusCode()).toBe(400);
				const temp = JSON.parse(response._getData());
	
				expect(temp.message).toBe(
					'Invalid access - must be either owner of resource or an admin to update a resource'
				);
			});

			test('not a user, should fail', async () => {
				mockHasMemberPermissions.mockReturnValueOnce(Promise.resolve(false));
	
				const request = httpMocks.createRequest({
					method: 'PATCH',
					url: '/api/resources/:id',
					params: {
						id: resourceId,
					},
					body: {
						title: 'change_name_test',
						description: 'change_desc',
						category: {
							main: 'Skills Workshops',
							sub: 'Coding'
						},
						author: 'New Author',
						username: 'notMember',
						resource_link: 'https://www.youtube.com',
					},
				});
	
				const response = httpMocks.createResponse();
				await updateResource(request, response);
	
				expect(response._getStatusCode()).toBe(400);
				const temp = JSON.parse(response._getData());
	
				expect(temp.message).toBe(
					'Invalid access - must be a member to update a resource'
				);
			});

			test('non-existent resource id, should fail', async () => {
				mockHasMemberPermissions.mockReturnValueOnce(Promise.resolve(true));
	
				const request = httpMocks.createRequest({
					method: 'PATCH',
					url: '/api/resources/:id',
					params: {
						id: '5f85fd2f0ab7c11e186f146b',
					},
					body: {
						title: 'change_name_test',
						description: 'change_desc',
						category: {
							main: 'Skills Workshops',
							sub: 'Coding'
						},
						author: 'New Author',
						username: 'resourceUser',
						resource_link: 'https://www.youtube.com',
					},
				});
	
				const response = httpMocks.createResponse();
				await updateResource(request, response);
	
				expect(response._getStatusCode()).toBe(404);
				const temp = JSON.parse(response._getData());
	
				expect(temp.message).toBe(
					'Could not find resource with id 5f85fd2f0ab7c11e186f146b to update'
				);
			});
		});
	
		describe('test delete resource', () => {
			test('delete not as the owner or an admin, should fail', async () => {
				mockHasMemberPermissions.mockReturnValueOnce(Promise.resolve(true));
				mockHasAdminPermissions.mockReturnValueOnce(Promise.resolve(false));
	
				const request = httpMocks.createRequest({
					method: 'DELETE',
					url: '/api/resources/:id',
					params: {
						id: resourceId,
					},
					body: {
						username: 'notOwnerNotAdmin',
					},
				});
	
				const response = httpMocks.createResponse();
				await deleteResource(request, response);

				expect(response._getStatusCode()).toBe(400);
				const temp = JSON.parse(response._getData());
	
				expect(temp.message).toBe(
					'Invalid access - must be either owner of resource or an admin to delete a resource'
				);
			});

			test('send non-existent resource id, should fail', async () => {
				mockHasMemberPermissions.mockReturnValueOnce(Promise.resolve(true));
				const request = httpMocks.createRequest({
					method: 'DELETE',
					url: '/api/resources/:id',
					params: {
						id: '5f85fd2f0ab7c11e186f146b',
					},
					body: {
						username: 'resourceUser',
					},
				});
	
				const response = httpMocks.createResponse();
				await deleteResource(request, response);
	
				expect(response._getStatusCode()).toBe(404);
				const temp = JSON.parse(response._getData());
	
				expect(temp.message).toBe(
					'Could not find resource with id 5f85fd2f0ab7c11e186f146b to delete'
				);
			});

			test('not a user, should fail', async () => {
				mockHasMemberPermissions.mockReturnValueOnce(Promise.resolve(false));
	
				const request = httpMocks.createRequest({
					method: 'DELETE',
					url: '/api/resources/:id',
					params: {
						id: resourceId,
					},
					body: {
						username: 'notMember',
					},
				});
	
				const response = httpMocks.createResponse();
				await deleteResource(request, response);
	
				expect(response._getStatusCode()).toBe(400);
				const temp = JSON.parse(response._getData());
	
				expect(temp.message).toBe(
					'Invalid access - must be a member to delete a resource'
				);
			});

			test('delete as owner, should pass', async () => {
				mockHasMemberPermissions.mockReturnValueOnce(Promise.resolve(true));
				mockHasAdminPermissions.mockReturnValueOnce(Promise.resolve(false));
	
				const request = httpMocks.createRequest({
					method: 'DELETE',
					url: '/api/resources/:id',
					params: {
						id: resourceId,
					},
					body: {
						username: 'resourceUser',
					},
				});
	
				const response = httpMocks.createResponse();
				await deleteResource(request, response);
	
				expect(response._getStatusCode()).toBe(200);
				const temp = JSON.parse(response._getData());
	
				expect(temp.message).toBe('Successfully deleted resource');
			});

			test('delete as admin, should pass', async () => {
				mockHasMemberPermissions.mockReturnValue(Promise.resolve(true));
				mockHasAdminPermissions.mockReturnValue(Promise.resolve(true));
	
				const createRequest = httpMocks.createRequest({
					method: 'POST',
					url: '/api/resources',
					body: {
						title: 'test_title',
						description: 'test_description',
						category: {
							main: 'COGS 402',
							sub: '2024',
						},
						author: 'Resource Test',
						username: 'resourceUser',
						resource_link: 'https://www.google.com',
					},
				});
	
				const createResponse = httpMocks.createResponse();
				await createResource(createRequest, createResponse);
				const resource = JSON.parse(createResponse._getData());
	
				const request = httpMocks.createRequest({
					method: 'DELETE',
					url: '/api/resources/:id',
					params: {
						id: resource.data._id,
					},
					body: {
						username: 'resourceAdmin',
					},
				});
	
				const response = httpMocks.createResponse();
				await deleteResource(request, response);
	
				expect(response._getStatusCode()).toBe(200);
				const temp = JSON.parse(response._getData());
	
				expect(temp.message).toBe('Successfully deleted resource');
			});
		});
	})
};

export default resourceControllerTest;
