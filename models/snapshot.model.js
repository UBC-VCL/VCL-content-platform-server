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
      ref: "User",
      required: true,
    },
    categories: [{ type: String }],
    contributors: [{ type: mongoose.ObjectId, ref: "User" }],
  },
  {
    timestamps: true,
  }
);

mongoose.set("useFindAndModify", false);
const Snapshot = mongoose.model("Snapshot", snapshotSchema);
export default Snapshot;
