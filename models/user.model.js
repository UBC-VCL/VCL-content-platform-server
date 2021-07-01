import mongoose from "mongoose";

const Schema = mongoose.Schema;

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
  },
  {
    timestamps: true,
  }
);

const User = mongoose.model("User", userSchema);
export default User;
