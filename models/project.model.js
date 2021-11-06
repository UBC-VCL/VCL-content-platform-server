import mongoose from "mongoose";

const Schema = mongoose.Schema;

const projectSchema = new Schema({
  name: {
    type: String,
    required: true,
    trim: true,
    unique: true,
  },
  description: {
    type: String,
  },
  members: [
    {
      type: mongoose.ObjectId,
      ref: "User",
    },
  ],
  isActive: {
    type: Boolean
  }
});
