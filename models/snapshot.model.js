import mongoose from "mongoose";

const Schema = mongoose.Schema;

const snapshotSchema = new Schema(
  {
    author: {
      type: mongoose.ObjectId,
      ref: "User",
      required: true,
    },
    title: {
      type: String,
      required: true,
      trim: true,
    },
    project: {
      type: String,
      required: true,
    },
    date: {
      type: Date,
      required: true,
    },
    descriptions: [{ type: String }],
    hyperlinks: [{ type: String }],
    contributors: [{ type: mongoose.ObjectId, ref: "User" }],
    categories: [{ type: String }],
  },
  {
    timestamps: true,
  }
);

mongoose.set("useFindAndModify", false);
const Snapshot = mongoose.model("Snapshot", snapshotSchema);
export default Snapshot;
