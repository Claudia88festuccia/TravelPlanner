import mongoose from "mongoose";
import bcrypt from "bcrypt";

const UserSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  avatar: String,
});

UserSchema.statics.checkCredentials = async function (email, password) {
  const user = await this.findOne({ email });
  const isMatch = user ? await bcrypt.compare(password, user.password) : false;
  return isMatch ? user : null;
};

export default mongoose.model("User", UserSchema);