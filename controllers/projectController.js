import PROJECT_ERR from "../errors/projectErrors";
import { checkAccessToken } from "../helpers/authHelper";
import { USER_TYPES } from "../helpers/types";
import Project from "../models/project.model";

export const createProject = async (req, res) => {
  try {
    const access = await checkAccessToken(req.headers.authorization);

    if (access.userPermissions !== USER_TYPES.MEMBER) {
      res.status(400).json({
        message: "Invalid access - must be a member to create a new project.",
      });
      return;
    } else {
      const { name, description, members, isActive } = req.body;

      const newProject = new Project({ name, description, members, isActive });

      newProject
        .save()
        .then((data) => {
          res.status(200).json({
            message: "Successfully created new project.",
            data,
          });
        })
        .catch((err) => {
          res.status(400).json({
            message: "Error creating new project",
            error: err,
          });
        });
    }
  } catch (error) {
    res.status(500).json({
      message: "Internal server error while attempting to create project",
      errCode: PROJECT_ERR.PROJECT001,
      error
    })
  }
};

export const getProjects = () => {};

export const getProject = () => {};

export const updateProject = () => {};

export const deleteProject = () => {};
