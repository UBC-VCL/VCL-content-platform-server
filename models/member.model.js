import mongoose from "mongoose";

const Schema = mongoose.Schema;

const memberSchema = new Schema(
  {
    // relates member to user. member document doesn't need to have an associated user
    username: {
      type: String,
      trim: true,
    },
    projects: [{ type: mongoose.ObjectId, ref: "Project" }],
    isActive: {
      type: Boolean,
      required: true,
    },
    firstName: {
      type: String,
      trim: true,
      required: true,
    },
    lastName: {
      type: String,
      trim: true,
      required: true,
    },
    email: {
      type: String,
      trim: true,
    },
    linkedIn: {
      type: String,
      trim: true,
    }
  },
  {
    timestamps: true,
  }
);

mongoose.set('useFindAndModify', false);
const Member = mongoose.model("Member", memberSchema);
export default Member;
