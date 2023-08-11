import { hasMemberPermissions } from "../helpers/authHelper";
import User from "../models/user.model.js";
import Member from "../models/member.model.js";
import Project from "../models/project.model.js";
import Snapshot from "../models/snapshot.model.js";
const postQuery = async (req, res) => {
    
    const {collection, conditions} = req.body.collection;
    if(!collection) {
        res.status(400).json({
            message: "The database to query on is missing!"
        });
    }

    switch(collection) {
        case "user":
            User
                .aggregate(req.conditions)
                .exec()
                .then((data)=>{
                    res.status(200).json({
                        message: "Successfully executed the query.",
                        data
                    });
                }).catch((err)=> {
                    res.status(400).json({
                        message: "Error executing the query",
                        error: err
                    })
                });
            break;
        case "member":
            Member
                .aggregate(req.conditions)
                .exec()
                .then((data)=>{
                    res.status(200).json({
                        message: "Successfully executed the query.",
                        data
                    });
                }).catch((err)=> {
                    res.status(400).json({
                        message: "Error executing the query",
                        error: err
                    })
                });
            break;
        case "project":
            Project
                .aggregate(req.conditions)
                .exec()
                .then((data)=>{
                    res.status(200).json({
                        message: "Successfully executed the query.",
                        data
                    });
                }).catch((err)=> {
                    res.status(400).json({
                        message: "Error executing the query",
                        error: err
                    })
                });
            break;
        case "snapshot":
            Snapshot
                .aggregate(req.conditions)
                .exec()
                .then((data)=>{
                    res.status(200).json({
                        message: "Successfully executed the query.",
                        data
                    });
                }).catch((err)=> {
                    res.status(400).json({
                        message: "Error executing the query",
                        error: err
                    })
                });
            break;
        default:
            res.status(400).json({
                message: "The collection does not exist in the database."
            });
        
    }

}