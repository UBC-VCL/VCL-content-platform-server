import SNAPSHOT_ERR from "../errors/snapshotErrors.js";
import { hasMemberPermissions } from "../helpers/authHelper.js";
import Snapshot from "../models/snapshot.model.js";

/**
 * 
 * @param Expected request body:
          {
            title: String,
            description: String,
            imageURL: String,
            date: String,
            project: String
            categories: Array<String>,
            contributors: Array<ObjectId>,
            author: ObjectId
          }
   @param Expected HEADERS:
          {
            authorization: string
          }
 *
 * @param Responds with created object.
 */
export const createSnapshot = async (req, res) => {
  try {
    const isMember = await hasMemberPermissions(req.headers.authorization);

    if (!isMember) {
      res.status(400).json({
        message: 'Invalid access - must be a member to create a snapshot'
      });
      return;

    } else {
      const newSnapshot = new Snapshot({
        title: req.body.title,
        description: req.body.description,
        imageURL: req.body.imageURL,
        date: req.body.date,
        project: req.body.project,
        author: req.body.author,
        categories: req.body.categories,
        contributors: req.body.contributors,
      });

      newSnapshot
        .save()
        .then((data) => {
          res.status(200).json({
            message: "Successfully created timeline snapshot.",
            data: data,
          });
        })
        .catch((err) => {
          res.status(400).json({
            message: "Error saving timeline snapshot to MongoDB",
            error: err,
          });
        });
      
      return;
    }
  } catch (err) {
    res.status(500).json({
      message: 'Internal server error while attempting to create snapshot',
      error: err,
      errCode: SNAPSHOT_ERR.SNAPSHOT001
    });

    return;
  }
};

/**
 * @param Expected request body: None
 * @param Responds with all timeline objects found in database
 */
export const getAllSnapshots = async (req, res) => {
  Snapshot.find()
    .exec()
    .then((data) => {
      res.status(200).json({
        message: "Successfully retrieved all timeline snapshots",
        data: data,
      });
    })
    .catch((err) => {
      res.status(500).json({
        message: "Error getting all timeline snapshots from MongoDB",
        error: err,
        errCode: SNAPSHOT_ERR.SNAPSHOT002
      });
    });
};

/**
 *
 * @param Expected request body: None, request url parameter: id - ID of the timeline snapshot to delete
 * @param Responds with a message saying deleted if successful, along with the deleted object, or an error message if unsuccessful
 */
export const deleteSnapshot = async (req, res) => {
  try {
    const isMember = await hasMemberPermissions(req.headers.authorization);

    if (!isMember) {
      res.status(400).json({
        message: 'Invalid access - must be a user to delete a snapshot'
      });
    } else {
      Snapshot.findByIdAndDelete(req.params.id)
        .exec()
        .then((data) => {
          res.status(200).json({
            message: "Successfully deleted timeline snapshot",
            data: data,
          });
        })
        .catch((err) => {
          res.status(400).json({
            message: "Error deleting timeline snapshot from MongoDB",
            error: err,
          });
        });
    }
  } catch (err) {
    res.status(500).json({
      message: 'Internal server error while attempting to delete snapshot',
      error: err,
      errCode: SNAPSHOT_ERR.SNAPSHOT003
    });
  }
};

/**
 *
 * @param Expected request body: None, request url parameter: id - ID of the timeline snapshot to get
 * @param Responds with a message saying retrieved if successful, along with the retrieved object, or an error message if unsuccessful
 */

export const getSnapshot = async (req, res) => {
  let id = req.params.id;
  Snapshot.findById(id)
    .exec()
    .then((data) => {
      res.status(200).json({
        message: "Successfully retrieved timeline snapshot",
        data: data,
      });
    })
    .catch((err) => {
      res.status(500).json({
        message: "Error retrieving timeline snapshot from MongoDB",
        error: err,
        errCode: SNAPSHOT_ERR.SNAPSHOT004
      });
    });
};
