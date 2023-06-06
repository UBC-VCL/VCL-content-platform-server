
import {createUser} from "../../../controllers/authController.js";

import httpMocks  from 'node-mocks-http';


import {hasAdminPermissions} from '../../../helpers/authHelper.js';
// import pkg from '@jest/globals';
// const {expect, jest, test} = pkg;
// jest.mock("../../../helpers/authHelper.js");
// hasAdminPermissions.mockImplementation(() => {
//     return Promise.resolve(true);
// });


test('sendSomeStuff', () => {
        const request = httpMocks.createRequest({
            method: 'POST',
            url: '/api/users',
            body: {
                usernmae: "test1",
                password: "test1",
                permissions: "admin"
            },
            header: ""
        });
        const response = httpMocks.createResponse();
        createUser(request, response);
        expect(response._getStatusCode()).toBe(200);
        const temp = JSON.parse(response._getData());
        console.log(temp);
        expect(temp['username']).toBe("test1");
        expect(temp['password']).toBe("test1");
        expect(temp['admin']).toBe('admin')
    
});

test("Dummy test: 1 + 1 equals 2", () => {
    const result = 1 + 1;
    expect(result).toBe(2);
  });