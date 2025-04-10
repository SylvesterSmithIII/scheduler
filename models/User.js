// models/User.js
import { Schema, model, models } from "mongoose";

const UserSchema = new Schema(
  {
    username: { type: String, required: true, unique: true },
    firstName: { type: String, required: true },
    password: { type: String, required: true },
  },
  { timestamps: true }
);

const User = models.User || model("User", UserSchema);
export default User;