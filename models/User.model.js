const { Schema, model } = require("mongoose");

const userSchema = new Schema(
  {
    profilePic: {
      type: String,
      trim: true,
      default: "https://res.cloudinary.com/santic/image/upload/v1592769503/mi-mascota/profile-pics/defaultPic_on0abf.png"
    },
    firstName: {
      type: String,
      trim: true,
      required: [true, "Name is required."],
    },
    pets: [{ type: Schema.Types.ObjectId, ref: "Pet" }],
    lastName: {
      type: String,
      trim: true,
      required: [true, "Last name is required."],
    },
    username: {
      type: String,
      trim: true,
      required: [true, "Username is required."],
      unique: true,
    },
    email: {
      type: String,
      required: [true, "Email is required."],
      match: [/^\S+@\S+\.\S+$/, "Invalid email address."],
      unique: true,
      lowercase: true,
      trim: true,
    },
    // add password property here
    passwordHash: {
      type: String,
      required: [true, "Password is required."],
    },
  },
  {
    timestamps: {
      createdAt: "created_at",
      updatedAt: "updated_at",
    },
  }
);

module.exports = model("User", userSchema);
