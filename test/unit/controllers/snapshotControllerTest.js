import httpMocks  from 'node-mocks-http';
import mongoose from "mongoose";
import { createSnapshot } from '../../../controllers/snapshotController';
import authHelper from '../../../helpers/authHelper.js';
const snapshotControllerTest = async ()=>{
    describe('test on create snapshot', ()=>{
        const mockHasAdminPermissions = jest.spyOn(authHelper, 'hasMemberPermissions');
         mockHasAdminPermissions.mockReturnValueOnce(Promise.resolve(true));
        test('should pass', async ()=> {
            const request = httpMocks.createRequest({
                url: '/api/snapshots',
                method: 'POST',
                body: {
                    
                    title: 'test',
                    description: 'test',
                    imageURL: 'test.png',
                    date: '3000-01-01',
                    project: "testProject",
                    categories: ['c1'],
                    contributors: [mongoose.Types.ObjectId("61a2dd6b0076a86ec89cd232")],
                    author: mongoose.Types.ObjectId("61a2dd6b0076a86ec89cd232")
                      
                }
            });
            const response = httpMocks.createResponse();
            await createSnapshot(request, response);
            expect(response._getStatusCode()).toBe(200);
            const temp = JSON.parse(response._getData());
            expect(temp.data.title).toBe('test');
            expect(temp.data.description).toBe('test');
            expect(temp.data.imageURL).toBe('test.png');
            expect(temp.data.project).toBe('testProject');
            expect(temp.data.categories.length).toBe(1);
            expect(temp.data.categories[0]).toBe("c1");
            expect(temp.data.contributers.length).toBe(1);
            expect(temp.data.contributers[0]).toBe("61a2dd6b0076a86ec89cd232");
            expect(temp.data.contributers.author).toBe("61a2dd6b0076a86ec89cd232");
        })
    });
};

export default snapshotControllerTest;