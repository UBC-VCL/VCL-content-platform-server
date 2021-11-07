import mongoose from "mongoose";

const Schema = mongoose.Schema;

const projectSchema = new Schema(
  {
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
      type: Boolean,
    },
  },
  {
    timestamps: true,
  }
);

mongoose.set("useFindAndModify", false);
const Project = mongoose.model("Project", projectSchema);
export default Project;
