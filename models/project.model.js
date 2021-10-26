import mongoose from "mongoose";

const Schema = mongoose.Schema;

const projectSchema = new Schema({
  name: {
    type: String,
    required: true,
    trim: true,
    unique: true, // does it need to be?
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
});
