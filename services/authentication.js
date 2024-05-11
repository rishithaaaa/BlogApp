const JWT = require("jsonwebtoken");
const secret = "$uperMan@123";

function createTokenForUser(user) {
  const payload = {
    _id: user._id,
    email: user.email,
    profileIMageUrl: user.profileImageUrl,
    role: user.role,
  };
  const token = JWT.sign(payload, secret);
  console.log("ctfu", token);
  return token;
}

function validateToken(token) {
  if (!token) return null;
  try {
    const payload = JWT.verify(token, secret);
    return payload;
  } catch (error) {
    return null;
  }
  // if (!token) throw new Error("Token not found");
}

module.exports = {
  createTokenForUser,
  validateToken,
};
