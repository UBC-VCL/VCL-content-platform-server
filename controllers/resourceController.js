import Resource from "models/resource.model.js";
import {
  hasAdminPermissions,
  hasFrontendAPIKey,
} from "../helpers/authHelper.js";
import RESOURCE_ERR from "errors/resourceErrors.js";
import User from "models/user.model.js";
import { isResourceOwner } from "helpers/resourceHelper.js";

/**
 *
 * @param Expected request body:
 *        {
 *          title: string,
 *          description: string,
 *          category: string,
 *          username: string,
 *          resource_link: string,
 *        }
 * @param Expected request headers:
 *        {
 *          authorization: string,
 *        }
 * @param Responds with status code and messsage.
 */
export const createResource = async (req, res) => {
  try {
    const isMember = await hasFrontendAPIKey(req.headers.authorization);

    if (!isMember) {
      res.status(400).json({
        message: "Invalid access - must be a member to create a new resource.",
      });
      return;
    }

    const { title, description, category, username, resource_link } = req.body;
    const ownerUser = await User.findOne({ username: username });
    if (!ownerUser) {
      throw "logged in user could not be found, when it should have been.";
    }

    const owner = ownerUser.member;
    const newResource = new Resource({
      title,
      description,
      category,
      owner,
      resource_link,
    });

    newResource.save().then((data) => {
      res.status(200).json({
        message: "Successfully created new resource",
        data,
      });
    });
  } catch (error) {
    res.status(500).json({
      message: "Internal server error while attempting to create resource",
      error,
      errCode: RESOURCE_ERR.RESOURCE001,
    });
  }
};

/**
 *
 * @param Expected request parameter:
 *        {
 *          category: string,
 *        }
 * @param Responds with array of resources.
 */
export const getResourcesInCategory = async (req, res) => {
  // TODO call isValidResourceCategory

  Resource.find({ category: req.params.category })
    .populate({ path: "owner", select: "name" })
    .exec()
    .then((data) => {
      res.status(200).json({
        message: "Successfully retrieved all Resources in category",
        data,
      });
    })
    .catch((error) => {
      res.status(500).json({
        message: "Error while getting all Resources in category from MongoDB",
        error,
        errCode: RESOURCE_ERR.RESOURCE002,
      });
    });
};

/**
 *
 * @param Expected request parameter:
 *        {
 *          id: mongoose.ObjectId (id of resource),
 *        }
 * @param Responds with resource
 */
export const getResource = async (req, res) => {
  const id = req.params.id;
  Resource.findOne({ _id: id })
    .populate({ path: "owner", select: "name" })
    .exec()
    .then((data) => {
      if (data) {
        res.status(200).json({
          message: `Successfully retrieved Resource with id <${id}>`,
          data,
        });
      } else {
        res.status(404).json({
          message: `Couldn't find Resource with id <${id}>`,
        });
      }
    })
    .catch((error) => {
      res.status(500).json({
        message: `Error while getting Resource with id <${id}> from MongoDB`,
        error,
        errCode: RESOURCE_ERR.RESOURCE003,
      });
    });
};

/**
 *
 * @param Expected request parameter:
 *        {
 *          id: mongoose.ObjectId (id of resource),
 *        }
 * @param Expected request body:
 *        {
 *          title: string,
 *          description: string,
 *          category: string,
 *          resource_link: string,
 *        }
 * @param Expected request headers:
 *        {
 *          authorization: string,
 *          user: string,
 *        }
 * @param Responds with status code and messsage.
 */
export const updateResource = async (req, res) => {
  try {
    const isMember = await hasFrontendAPIKey(req.headers.authorization);
    const isAdmin = await hasAdminPermissions(req.headers.authorization);

    if (!isMember) {
      res.status(400).json({
        message: "Invalid access - must be a member to update a resource",
      });
      return;
    }

    const id = req.params.id;
    try {
      const isOwner = await isResourceOwner(id, req.headers.user);
      if (!isOwner && !isAdmin) {
        res.status(400).json({
          message:
            "Invalid access - must be either owner of resource or an admin to update a resource",
        });
        return;
      }
    } catch (error) {
      if (error === "resource not found") {
        res.status(404).json({
          message: `Could not find resource with id ${id} to update`,
        });
        return;
      } else {
        throw error;
      }
    }

    const { title, description, category, resource_link } = req.body;
    const updatedResource = await Resource.findOneAndUpdate(
      { _id: id },
      { title, description, category, resource_link },
      { new: true }
    ).populate({ path: "owner", select: "name" });
    if (updatedResource) {
      res.status(200).json({
        message: "Successfully updated resource",
        data: updatedResource,
      });
    } else {
      res.status(400).json({
        message: "Could not update resource",
      });
    }
  } catch (error) {
    res.status(500).json({
      message: "Internal server error while attempting to update resource",
      errCode: RESOURCE_ERR.RESOURCE004,
      error,
    });
  }
};

/**
 *
 * @param Expected request parameter:
 *        {
 *          id: mongoose.ObjectId (id of resource),
 *        }
 * @param Expected request headers:
 *        {
 *          authorization: string,
 *          user: string,
 *        }
 * @param Responds with status code and messsage.
 */
export const deleteResource = async (req, res) => {
  try {
    const isMember = await hasFrontendAPIKey(req.headers.authorization);
    const isAdmin = await hasAdminPermissions(req.headers.authorization);

    if (!isMember) {
      res.status(400).json({
        message: "Invalid access - must be a member to delete a resource",
      });
      return;
    }

    const id = req.params.id;
    try {
      const isOwner = await isResourceOwner(id, req.headers.user);
      if (!isOwner && !isAdmin) {
        res.status(400).json({
          message:
            "Invalid access - must be either owner of resource or an admin to delete a resource",
        });
        return;
      }
    } catch (error) {
      if (error === "resource not found") {
        res.status(404).json({
          message: `Could not find resource with id ${id} to delete`,
        });
        return;
      } else {
        throw error;
      }
    }

    const { deletedCount } = await Resource.deleteOne({ _id: id });
    if (deletedCount === 0) {
      throw `Resource with id <${id}> not found, when it should have been`;
    } else {
      res.status(200).json({
        message: "Successfully deleted resource",
      });
    }
  } catch (error) {
    res.status(500).json({
      message: "Internal server error while attempting to delete resource",
      errCode: RESOURCE_ERR.RESOURCE005,
      error,
    });
  }
};
