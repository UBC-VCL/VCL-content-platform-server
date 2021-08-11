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
 *
 * @param Responds with created object.
 */
export const createSnapshot = async (req, res) => {
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
      res.status(400).json({
        message: "Error getting all timeline snapshots from MongoDB",
        error: err,
      });
    });
};

/**
 *
 * @param Expected request body: None, request url parameter: id - ID of the timeline snapshot to delete
 * @param Responds with a message saying deleted if successful, along with the deleted object, or an error message if unsuccessful
 */
export const deleteSnapshot = async (req, res) => {
  let id = req.params.id;
  Snapshot.findByIdAndDelete(id)
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
      res.status(400).json({
        message: "Error retrieving timeline snapshot from MongoDB",
        error: err,
      });
    });
};


/**
 *
 * @param Expected request body: 
 *      {
 *        size: number,
 *        offset: number,
 *        filters: 
 *          {
 *           <filterName>: <filterValue>
 *           <filterName>: <filterValue>
 *           ...
 *          }
 *      }, 
 * 
 * @param Responds with a message saying retrieved if successful, along with the retrieved object, or an error message if unsuccessful
 */

 export const getSnapshots = async (req, res) => {
  let size = req.body.size;
  let offset = req.body.offset;
  let filters = req.body.filters;
  
  // TODO: 
  // Snapshot.find()
  //   .exec()
  //   .then((data) => {
  //     res.status(200).json({
  //       message: "Successfully retrieved all timeline snapshots",
  //       data: data,
  //     });
  //   })
  //   .catch((err) => {
  //     res.status(400).json({
  //       message: "Error getting all timeline snapshots from MongoDB",
  //       error: err,
  //     });
  //   });
};
