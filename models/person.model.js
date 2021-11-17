import mongoose from "mongoose";

const Schema = mongoose.Schema;

const personSchema = new Schema(
  {
    // relates person to person. person object doesn't need to have an associated user
    username: {
      type: String,
      trim: true,
      unique: true,
    },
    projects: [{ type: mongoose.ObjectId, ref: "Project" }],
    isActive: {
      type: Boolean,
      required: true,
    },
    firstName: {
      type: String,
      trim: true,
    },
    lastName: {
      type: String,
      trim: true,
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
const Person = mongoose.model("Person", personSchema);
export default Person;
