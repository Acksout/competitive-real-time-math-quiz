import mongoose from "mongoose";

const UserSchema = new mongoose.Schema({
  username: {
    type: String,
    required: [true, "Please provide a username"],
    unique: true,
    trim: true,
    maxlength: [20, "Username cannot be more than 20 characters"],
  },
  password: {
    type: String,
    required: [true, "Please provide a password"],
  },
  score: {
    type: Number,
    default: 0,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

const User = mongoose.models.User || mongoose.model("User", UserSchema);

export default User;
