import mongoose from "mongoose";

const Schema = mongoose.Schema;

const snapshotSchema = new Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },
    description: {
      type: String,
    },
    imageURL: {
      type: String,
    },
    date: {
      type: String,
      required: true,
    },
    project: {
      type: String,
      required: true,
    },
    author: {
      type: mongoose.ObjectId,
      required: true,
    },
    categories: [{ type: String }],
    contributors: [{ type: mongoose.ObjectId }],
  },
  {
    timestamps: true,
  }
);

const Snapshot = mongoose.model("Snapshot", snapshotSchema);
export default Snapshot;
