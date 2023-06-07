
import {createUser} from "../../../controllers/authController.js";

import httpMocks  from 'node-mocks-http';
import mongoose from "mongoose";

import {hasAdminPermissions} from '../../../helpers/authHelper.js';
// import pkg from '@jest/globals';
// const {expect, jest, test} = pkg;
jest.mock("../../../helpers/authHelper.js", 
    () => {
        const originalModule = jest.requireActual("../../../helpers/authHelper.js");
        return {
          ...originalModule,
          hasAdminPermissions: ()=> {
            return Promise.resolve(true);
          }, // Mock the 'add' method
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

test('sendSomeStuff', async () => {
        const request = httpMocks.createRequest({
            method: 'POST',
            url: '/api/users',
            body: {
                username: "test1",
                password: "test1",
                permissions: "admin",
                member: mongoose.Types.ObjectId()
            },
            header: "kKXbOewgS9sad5PDfKaGc"
        });
        
        const response = httpMocks.createResponse();
        await createUser(request, response);
        
        expect(response._getStatusCode()).toBe(200);
        const temp = JSON.parse(response._getData());
        console.log(response._getData());
        expect(temp.data.username).toBe("test1");
        
        expect(temp.data.permissions).toBe('admin')
    
});

// describe("Dummy test: 1 + 1 equals 2", () => {
//     test("hhh", ()=> {
//         const result = 1 + 1;
//         expect(result).toBe(2);
//     })
//   });