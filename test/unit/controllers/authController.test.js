
import {createUser, deleteUser, getUsers, loginUser} from "../../../controllers/authController.js";

import httpMocks  from 'node-mocks-http';
import mongoose from "mongoose";
import User from '../../../models/user.model.js';
import authHelper from '../../../helpers/authHelper.js';
// import pkg from '@jest/globals';
// const {expect, jest, test} = pkg;
jest.mock("../../../helpers/authHelper.js", 
    () => {
        const originalModule = jest.requireActual("../../../helpers/authHelper.js");
        return {
          ...originalModule,
          hasAdminPermissions: jest.fn().mockImplementation(()=> {
            return Promise.resolve(true);
          }), // Mock the 'add' method
        };
    }
);
// hasAdminPermissions.mockImplementation(() => {
//     return Promise.resolve(true);
// });

beforeAll( (done)=> {
    const uri = "mongodb+srv://eason:eKur1QlgtndWAkxt@vcl-documentation-app.gcjzz.mongodb.net/VCL-Documentation-App?retryWrites=true&w=majority";

//Start MongoDB connection
    mongoose.connect(uri, {
        useNewUrlParser: true,
        useCreateIndex: true,
        useUnifiedTopology: true,
    }).then(() => {
        console.log("MongoDB database connection established successfully");
        done();
      })
      .catch((error) => {
        console.error("Error establishing MongoDB database connection:", error);
        done(error);
      });
    
});
afterAll((done)=>{
    mongoose.connection.close();
    done();
});





    



// {
//     "username": "test1",
//     "password": "testdddsdsddasa",
//     "permissions": "admin",
//     "member": "61a2db9b410ae13f78f05da8"
// }

describe('sendSomeStuff',()=>{
    test('send valid user information, should created a user', async () => {
        const request = httpMocks.createRequest({
            method: 'POST',
            url: '/api/users',
            body: {
                username: "test1",
                password: "test1",
                permissions: "admin",
                member: mongoose.Types.ObjectId()
            }
        });
        
        const response = httpMocks.createResponse();
        await createUser(request, response);
        
        expect(response._getStatusCode()).toBe(200);
        const temp = JSON.parse(response._getData());
        
        expect(temp.data.username).toBe("test1");
        
        expect(temp.data.permissions).toBe('admin');
    
    } );
    test('send the same user information, should not pass', async()=> {
        const request = httpMocks.createRequest({
            method: 'POST',
            url: '/api/users',
            body: {
                username: "test1",
                password: "test1",
                permissions: "admin",
                member: mongoose.Types.ObjectId()
            }
        });
        const response = httpMocks.createResponse();
        await createUser(request, response);
        
        expect(response._getStatusCode()== 500).toBeTruthy();
        
    });

    
    test("should not have permission", async ()=> {
        
        //const mockHasAdminPermissions = jest.fn(hasAdminPermissions);
        const mockHasAdminPermissions = jest.spyOn(authHelper, 'hasAdminPermissions');
        mockHasAdminPermissions.mockReturnValueOnce(Promise.resolve(false));
        const request = httpMocks.createRequest({
            method: 'POST',
            url: '/api/users',
            body: {
                username: "test1",
                password: "test1",
                permissions: "admin",
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
        console.log(temp.data);
        expect(temp.data.length).toBe(expectedCount);
    })
});

describe('test on logining users', ()=>{
    test('missing password in request body, should fail', async()=> {
        const request = httpMocks.createRequest({
            method: 'POST',
            url: '/api/users/login',
            body: {
                username: "test1"
            }
        });
        const response = httpMocks.createResponse();
        await loginUser(request, response);
        expect(response._getStatusCode()).toBe(400);
        let temp = JSON.parse(response._getData());
        expect(temp['message']).toBe("Invalid request body.");

    });

    test('missing username in request body, should fail', async()=> {
        const request = httpMocks.createRequest({
            method: 'POST',
            url: '/api/users/login',
            body: {
                password: "test1"
            }
        });
        const response = httpMocks.createResponse();
        await loginUser(request, response);
        expect(response._getStatusCode()).toBe(400);
        let temp = JSON.parse(response._getData());
        expect(temp['message']).toBe("Invalid request body.");

    });

    test('fake a username that does not exists, should fail', async()=> {
        const request = httpMocks.createRequest({
            method: 'POST',
            url: '/api/users/login',
            body: {
                username: 'dummyUsername',
                password: "test1"
            }
        });
        const response = httpMocks.createResponse();
        await loginUser(request, response);
        expect(response._getStatusCode()).toBe(400);
        let temp = JSON.parse(response._getData());
        expect(temp['message']).toBe("Invalid username or password.");

    });

    test('unmatched password, should fail', async()=> {
        const request = httpMocks.createRequest({
            method: 'POST',
            url: '/api/users/login',
            body: {
                username: 'test1',
                password: "dummyPassword"
            }
        });
        const response = httpMocks.createResponse();
        await loginUser(request, response);
        expect(response._getStatusCode()).toBe(400);
        let temp = JSON.parse(response._getData());
        expect(temp['message']).toBe("Invalid username or password.");

    });

    test('should pass', async()=> {
        const request = httpMocks.createRequest({
            method: 'POST',
            url: '/api/users/login',
            body: {
                username: 'test1',
                password: "test1"
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



describe('test on deleting users', ()=>{
    test('should delete the user', async()=> {
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
});