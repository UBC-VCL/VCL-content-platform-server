import mongoose from "mongoose";

const Schema = mongoose.Schema;

/**
 * This is the schema for a User in the VCL content platform.
 * 
 * Any updates to this schema MUST ALSO be made to the userValidationSchema
 * in userValidation.model.js!!
 */
const userSchema = new Schema(
  {
    username: {
      type: String,
      required: true,
      trim: true,
      unique: true,
    },
    hash: {
      type: String,
      required: true,
    },
    permissions: {
      type: String,
      required: true,
      trim: true,
    },
    refresh_token: {
      type: String,
      required: true,
    },
    access_token: {
      type: String,
      required: true,
    },
    member: {
      type: mongoose.ObjectId,
      ref: "Member",
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

mongoose.set('useFindAndModify', false);
const User = mongoose.model("User", userSchema);
export default User;
