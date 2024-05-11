const {createHmac, randomBytes} = require("crypto");
const {Schema, model} = require("mongoose");
const {createTokenForUser} = require("../services/authentication");
const userSchema = new Schema(
  {
    fullName: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    salt: {
      type: String,
      // required: true,
    },
    password: {
      type: String,
      required: true,
    },
    profileImageUrl: {
      type: String,
      default: "/images/default_img.webp",
    },
    role: {
      type: String,
      enum: ["ADMIN", "USER"],
      default: "USER",
    },
  },
  {timestamps: true}
);

userSchema.pre("save", function (next) {
  const user = this;
  if (!user.isModified("password")) return;
  //secret key
  const salt = randomBytes(16).toString();
  const hashedPassword = createHmac("sha256", salt)
    .update(user.password)
    .digest("hex");

  this.salt = salt;
  this.password = hashedPassword;

  next();
});

userSchema.static(
  "matchPasswordAndCreateToken",
  async function (email, password) {
    const user = await this.findOne({email});

    if (!user) throw new Error("Email not found");
    const salt = user.salt;
    const userProvidedHash = createHmac("sha256", salt)
      .update(password)
      .digest("hex");

    const hashedPassword = user.password;
    if (hashedPassword !== userProvidedHash) throw new Error("Wrong password");

    const token = createTokenForUser(user);

    return token;
  }
);

const USER = model("user", userSchema);
module.exports = USER;
