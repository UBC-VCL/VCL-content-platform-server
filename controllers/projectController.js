import PROJECT_ERR from "../errors/projectErrors.js";
import Project from "../models/project.model.js";
import { hasMemberPermissions } from "../helpers/authHelper.js";

/**
 * Create a new Project
 */
export const createProject = async (req, res) => {
  try {
    const isMember = await hasMemberPermissions(req.headers.authorization);

    if (!isMember) {
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
      error,
    });
  }
};

/**
 * Get all Projects
 */
export const getProjects = async (req, res) => {
  Project.find()
    .exec()
    .then((data) => {
      res.status(200).json({
        message: "Successfully retrieved all Projects",
        data,
      });
    })
    .catch((error) => {
      res.status(500).json({
        message: "Error while getting all Projects from MongoDB",
        error,
        errCode: PROJECT_ERR.PROJECT002,
      });
    });
};

/**
 * Get a single Project, identified by name
 */
export const getProject = async (req, res) => {
  try {
    const name = req.params.name;
    const project = await Project.findOne({ name });

    if (project) {
      res.status(200).json({
        message: `Successfully retrieved project ${name}`,
        data: project,
      });
    } else throw `Could not find project with name: ${name}`;
  } catch (error) {
    res.status(400).json({ message: error });
  }
};

/**
 * Update the fields of a single project, identified by name
 */
export const updateProject = async (req, res) => {
  try {
    const isMember = await hasMemberPermissions(req.headers.authorization);

    if (!isMember) {
      res.status(400).json({
        message: "Invalid access - must be a member to update a project",
      });
    } else {
      try {
        const name = req.params.name;
        const updatedProject = await Project.findOneAndUpdate(name, req.body, {
          new: true,
        });
        if (updatedProject) {
          res.status(200).json({
            message: `Successfully updated project: ${name}`,
            data: updatedProject,
          });
        } else throw `Could not update project with name: ${name}`;
      } catch (error) {
        res.status(400).json({ message: error });
      }
    }
  } catch (error) {
    res.status(500).json({
      message: "Internal server error while attempting to update project",
      errCode: PROJECT_ERR.PROJECT005,
      error,
    });
  }
};

/**
 * Delete a single project, identified by name
 */
export const deleteProject = async (req, res) => {
  try {
    const isMember = await hasMemberPermissions(req.headers.authorization);

    if (!isMember) {
      res.status(400).json({
        message: "Invalid access - must be a member to delete a project.",
      });
      return;
    } else {
      try {
        const name = req.body.name;
        await Project.deleteOne({ name });
        res.status(200).json({
          message: `Successfully deleted project: ${name}`,
        });
      } catch (error) {
        res.status(400).json({
          message: `Error - could not delete given project`,
          error,
        });
      }
    }
  } catch (error) {
    res.status(500).json({
      message: "Internal server error while attempting to delete project",
      errCode: PROJECT_ERR.PROJECT004,
      error,
    });
  }
};
