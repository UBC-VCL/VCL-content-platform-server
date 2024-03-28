import Resource from "../models/resource.model.js"
import { hasAdminPermissions } from "./authMiddleware.js";

export const verifyResourceAndOwner = async (req, res, next) => {
  const resource = await Resource.findOne({_id: req.params.id});
  
  if (!resource) {
    res.sendStatus(404);
  }

  if (resource.owner.toString() === req.user.id) {
    next();
  } else {
    hasAdminPermissions(req, res, next);
  }
}