import httpMocks from "node-mocks-http";
import resourceHelper from "helpers/resourceHelper.js";
import authHelper from "../../../helpers/authHelper.js";
import {
  createResource,
  deleteResource,
  getResource,
  getResourcesInCategory,
  updateResource,
} from "controllers/resourceController.js";
import { createUser } from "controllers/authController.js";
import { createMember } from "controllers/memberController.js";
import RESOURCE_ERR from "errors/resourceErrors.js";
import Resource from "models/resource.model.js";

const resourceControllerTest = () => {
  const mockFnOfIsResourceOwnerReturnFalse = () => {
    return false;
  };

  let mockHasMemberPermissions;
  let mockHasAdminPermissions;
  let mockIsResourceOwner;
  let resourceId;
  let memberId;

  beforeAll(async (done) => {
    console.log("Setting up helper method spies");
    mockHasMemberPermissions = jest.spyOn(authHelper, "hasMemberPermissions");
    mockHasAdminPermissions = jest.spyOn(authHelper, "hasAdminPermissions");
    mockIsResourceOwner = jest.spyOn(resourceHelper, "isResourceOwner");

    console.log("Creating member for resource tests");
    mockHasMemberPermissions.mockReturnValueOnce(Promise.resolve(true));
    const memberRequest = httpMocks.createRequest({
      method: "POST",
      url: "/api/members",
      body: {
        name: {
          firstname: "resource",
          lastname: "test",
        },
        project: "619c08a2fde7a602c72198d4",
        position: "testposition",
        contact: {
          email: "npmtest6@gmail.com",
        },
      },
    });
    const memberResponse = httpMocks.createResponse();
    await createMember(memberRequest, memberResponse);
    const member = JSON.parse(memberResponse._getData());
    memberId = member.data._id;

    console.log("Creating user for resource tests");
    mockHasAdminPermissions.mockReturnValueOnce(Promise.resolve(true));
    const userRequest = httpMocks.createRequest({
      method: "POST",
      url: "/api/users",
      body: {
        username: "resourceUser",
        password: "resourceUser",
        permissions: "default_user",
        member: memberId,
      },
    });
    const userResponse = httpMocks.createResponse();
    await createUser(userRequest, userResponse);
    done();
  });

  describe("test create resource", () => {
    test("send valid user information, should create a resource", async () => {
      mockHasMemberPermissions.mockReturnValueOnce(Promise.resolve(true));

      const request = httpMocks.createRequest({
        method: "POST",
        url: "/api/resources",
        body: {
          title: "test_title",
          description: "test_description",
          category: "COGS 402",
          username: "resourceUser",
          resource_link: "https://www.google.com",
        },
      });

      const response = httpMocks.createResponse();
      await createResource(request, response);

      expect(response._getStatusCode()).toBe(200);
      const temp = JSON.parse(response._getData());

      expect(temp.message).toBe("Successfully created new resource");
      expect(temp.data.title).toBe("test_title");
      expect(temp.data.description).toBe("test_description");
      expect(temp.data.category).toBe("COGS 402");
      expect(temp.data.owner).toBe(memberId);
      expect(temp.data.resource_link).toBe("https://www.google.com");
      resourceId = temp.data._id;
    });

    test("no permissions, not a member", async () => {
      mockHasMemberPermissions.mockReturnValueOnce(Promise.resolve(false));

      const request = httpMocks.createRequest({
        method: "POST",
        url: "/api/resources",
        body: {
          title: "test_title",
          description: "test_description",
          category: "COGS 402",
          username: "resourceUser",
          resource_link: "https://www.google.com",
        },
      });

      const response = httpMocks.createResponse();
      await createResource(request, response);

      expect(response._getStatusCode()).toBe(400);
      const temp = JSON.parse(response._getData());
      expect(temp.message).toBe(
        "Invalid access - must be a member to create a new resource."
      );
    });

    test("unexpected user not found", async () => {
      mockHasMemberPermissions.mockReturnValueOnce(Promise.resolve(true));
      const request = httpMocks.createRequest({
        method: "POST",
        url: "/api/resources",
        body: {
          title: "test_title",
          description: "test_description",
          category: "COGS 402",
          username: "bad_username",
          resource_link: "https://www.google.com",
        },
      });

      const response = httpMocks.createResponse();
      await createResource(request, response);

      expect(response._getStatusCode()).toBe(500);
      const temp = JSON.parse(response._getData());
      expect(temp.message).toBe(
        "Internal server error while attempting to create resource"
      );
      expect(temp.error).toBe(
        "logged in user could not be found, when it should have been."
      );
      expect(temp.errCode).toBe(RESOURCE_ERR.RESOURCE001);
    });
  });

  describe("test get resources in category", () => {
    test("should pass", async () => {
      const expectedCount = await Resource.count({ category: "COGS 402" });
      const request = httpMocks.createRequest({
        method: "GET",
        url: "/api/resources",
        params: {
          category: "COGS 402",
        },
      });

      const response = httpMocks.createResponse();
      await getResourcesInCategory(request, response);

      expect(response._getStatusCode()).toBe(200);
      const temp = JSON.parse(response._getData());

      expect(temp.data.length).toBe(expectedCount);
      expect(temp.message).toBe(
        "Successfully retrieved all Resources in category"
      );
    });
  });

  describe("test get single resource", () => {
    test("should pass", async () => {
      const request = httpMocks.createRequest({
        method: "GET",
        url: "/api/resources",
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
      expect(temp.data.title).toBe("test_title");
      expect(temp.data.description).toBe("test_description");
      expect(temp.data.category).toBe("COGS 402");
      expect(temp.data.owner.firstname).toBe("resource");
      expect(temp.data.owner.lastname).toBe("test");
      expect(temp.data.resource_link).toBe("https://www.google.com");
    });
    test("resource with id doesn't exist", async () => {
      const request = httpMocks.createRequest({
        method: "GET",
        url: "/api/resources",
        params: {
          id: "5f85fd2f0ab7c11e186f146b",
        },
      });

      const response = httpMocks.createResponse();
      await getResource(request, response);

      expect(response._getStatusCode()).toBe(404);
      const temp = JSON.parse(response._getData());

      expect(temp.message).toBe(
        "message: `Couldn't find Resource with id <5f85fd2f0ab7c11e186f146b>`,"
      );
    });
  });

  describe("test update resource", () => {
    test("update as user with admin permissions, should pass", async () => {
      mockHasMemberPermissions.mockReturnValueOnce(Promise.resolve(true));
      mockHasAdminPermissions.mockReturnValueOnce(Promise.resolve(true));
      mockIsResourceOwner.mockImplementationOnce(
        mockFnOfIsResourceOwnerReturnFalse
      );

      const request = httpMocks.createRequest({
        method: "PATCH",
        url: "/api/resources",
        params: {
          id: resourceId,
        },
        headers: {
          user: "admin",
        },
        body: {
          title: "change_name_test",
          description: "change_desc",
          category: "Skills Workshops",
          resource_link: "https://www.youtube.com",
        },
      });

      const response = httpMocks.createResponse();
      await updateResource(request, response);

      expect(response._getStatusCode()).toBe(200);
      const temp = JSON.parse(response._getData());

      expect(temp.message).toBe("Successfully updated resource");
      expect(temp.data.title).toBe("change_name_test");
      expect(temp.data.description).toBe("change_desc");
      expect(temp.data.category).toBe("Skills Workshops");
      expect(temp.data.owner.firstname).toBe("resource");
      expect(temp.data.owner.lastname).toBe("test");
      expect(temp.data.resource_link).toBe("https://www.youtube.com");
    });
    test("update as resource owner, should pass", async () => {
      mockHasMemberPermissions.mockReturnValueOnce(Promise.resolve(true));
      mockHasAdminPermissions.mockReturnValueOnce(Promise.resolve(false));

      const request = httpMocks.createRequest({
        method: "PATCH",
        url: "/api/resources",
        params: {
          id: resourceId,
        },
        headers: {
          user: "resourceUser",
        },
        body: {
          title: "title",
          description: "description",
          category: "COGS 402",
          resource_link: "https://www.google.com",
        },
      });

      const response = httpMocks.createResponse();
      await updateResource(request, response);

      expect(response._getStatusCode()).toBe(200);
      const temp = JSON.parse(response._getData());

      expect(temp.message).toBe("Successfully updated resource");
      expect(temp.data.title).toBe("title");
      expect(temp.data.description).toBe("description");
      expect(temp.data.category).toBe("COGS 402");
      expect(temp.data.owner.firstname).toBe("resource");
      expect(temp.data.owner.lastname).toBe("test");
      expect(temp.data.resource_link).toBe("https://www.google.com");
    });
    test("update not the owner or an admin, should fail", async () => {
      mockHasMemberPermissions.mockReturnValueOnce(Promise.resolve(true));
      mockIsResourceOwner.mockImplementationOnce(
        mockFnOfIsResourceOwnerReturnFalse
      );

      const request = httpMocks.createRequest({
        method: "PATCH",
        url: "/api/resources",
        params: {
          id: resourceId,
        },
        headers: {
          user: "notOwnerNotAdmin",
        },
        body: {
          title: "change_name_test",
          description: "change_desc",
          category: "Skills Workshops",
          resource_link: "https://www.youtube.com",
        },
      });

      const response = httpMocks.createResponse();
      await updateResource(request, response);

      expect(response._getStatusCode()).toBe(400);
      const temp = JSON.parse(response._getData());

      expect(temp.message).toBe(
        "Invalid access - must be either owner of resource or an admin to update a resource"
      );
    });
    test("not a user, should fail", async () => {
      mockHasMemberPermissions.mockReturnValueOnce(Promise.resolve(false));

      const request = httpMocks.createRequest({
        method: "PATCH",
        url: "/api/resources",
        params: {
          id: resourceId,
        },
        headers: {
          user: "resourceUser",
        },
        body: {
          title: "change_name_test",
          description: "change_desc",
          category: "Skills Workshops",
          resource_link: "https://www.youtube.com",
        },
      });

      const response = httpMocks.createResponse();
      await updateResource(request, response);

      expect(response._getStatusCode()).toBe(400);
      const temp = JSON.parse(response._getData());

      expect(temp.message).toBe(
        "Invalid access - must be a member to update a resource"
      );
    });
    test("non-existent resource id, should fail", async () => {
      mockHasMemberPermissions.mockReturnValueOnce(Promise.resolve(true));

      const request = httpMocks.createRequest({
        method: "PATCH",
        url: "/api/resources",
        params: {
          id: "5f85fd2f0ab7c11e186f146b",
        },
        headers: {
          user: "resourceUser",
        },
        body: {
          title: "change_name_test",
          description: "change_desc",
          category: "Skills Workshops",
          resource_link: "https://www.youtube.com",
        },
      });

      const response = httpMocks.createResponse();
      await updateResource(request, response);

      expect(response._getStatusCode()).toBe(404);
      const temp = JSON.parse(response._getData());

      expect(temp.message).toBe(
        "Could not find resource with id 5f85fd2f0ab7c11e186f146b to update"
      );
    });
  });

  describe("test delete resource", () => {
    test("delete not as the owner or an admin, should fail", async () => {
      mockHasMemberPermissions.mockReturnValueOnce(Promise.resolve(true));
      mockHasAdminPermissions.mockReturnValueOnce(Promise.resolve(false));
      mockIsResourceOwner.mockImplementationOnce(
        mockFnOfIsResourceOwnerReturnFalse
      );

      const request = httpMocks.createRequest({
        method: "DELETE",
        url: "/api/resources",
        params: {
          id: resourceId,
        },
        headers: {
          user: "notOwnerNotAdmin",
        },
      });

      const response = httpMocks.createResponse();
      await deleteResource(request, response);

      expect(response._getStatusCode()).toBe(400);
      const temp = JSON.parse(response._getData());

      expect(temp.message).toBe(
        "Invalid access - must be either owner of resource or an admin to delete a resource"
      );
    });
    test("send non-existent resource id, should fail", async () => {
      mockHasMemberPermissions.mockReturnValueOnce(Promise.resolve(true));
      const request = httpMocks.createRequest({
        method: "DELETE",
        url: "/api/resources",
        params: {
          id: "5f85fd2f0ab7c11e186f146b",
        },
        headers: {
          user: "resourceUser",
        },
      });

      const response = httpMocks.createResponse();
      await deleteResource(request, response);

      expect(response._getStatusCode()).toBe(404);
      const temp = JSON.parse(response._getData());

      expect(temp.message).toBe(
        "Could not find resource with id 5f85fd2f0ab7c11e186f146b to delete"
      );
    });
    test("not a user, should fail", async () => {
      mockHasMemberPermissions.mockReturnValueOnce(Promise.resolve(false));

      const request = httpMocks.createRequest({
        method: "DELETE",
        url: "/api/resources",
        params: {
          id: resourceId,
        },
        headers: {
          user: "notMember",
        },
      });

      const response = httpMocks.createResponse();
      await deleteResource(request, response);

      expect(response._getStatusCode()).toBe(400);
      const temp = JSON.parse(response._getData());

      expect(temp.message).toBe(
        "Invalid access - must be a member to delete a resource"
      );
    });
    test("delete as owner, should pass", async () => {
      mockHasMemberPermissions.mockReturnValueOnce(Promise.resolve(true));

      const request = httpMocks.createRequest({
        method: "DELETE",
        url: "/api/resources",
        params: {
          id: resourceId,
        },
        headers: {
          user: "resourceUser",
        },
      });

      const response = httpMocks.createResponse();
      await deleteResource(request, response);

      expect(response._getStatusCode()).toBe(200);
      const temp = JSON.parse(response._getData());

      expect(temp.message).toBe("Successfully deleted resource");
    });
    test("delete as admin, should pass", async () => {
      mockHasMemberPermissions.mockReturnValue(Promise.resolve(true));
      mockHasAdminPermissions.mockReturnValue(Promise.resolve(true));

      const createRequest = httpMocks.createRequest({
        method: "POST",
        url: "/api/resources",
        body: {
          title: "test_title",
          description: "test_description",
          category: "COGS 402",
          username: "resourceUser",
          resource_link: "https://www.google.com",
        },
      });

      const createResponse = httpMocks.createResponse();
      await createResource(createRequest, createResponse);
      const resource = JSON.parse(createResponse._getData());

      mockIsResourceOwner.mockImplementationOnce(
        mockFnOfIsResourceOwnerReturnFalse
      );

      const request = httpMocks.createRequest({
        method: "DELETE",
        url: "/api/resources",
        params: {
          id: resource._id,
        },
        headers: {
          user: "admin",
        },
      });

      const response = httpMocks.createResponse();
      await deleteResource(request, response);

      expect(response._getStatusCode()).toBe(200);
      const temp = JSON.parse(response._getData());

      expect(temp.message).toBe("Successfully deleted resource");
    });
  });
};

export default resourceControllerTest;
