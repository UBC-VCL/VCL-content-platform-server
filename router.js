const router = require("express").Router(); //require express router

//Import Controller
const Controller = require("./controller.js");

//Define POST route for creating timeline snapshot
router.post("/api/snapshots", Controller.createSnapshot);

// Define GET route for getting all timeline snapshots
router.get("/api/snapshots", Controller.getAllSnapshots);

// Define DEL route for deleting a snapshot given the ID
router.delete("/api/snapshots/:id", Controller.deleteSnapshot);

// Definte GET route for getting a snapshot given the ID
router.get("/api/snapshots/:id", Controller.getSnapshot);

module.exports = router;