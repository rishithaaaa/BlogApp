const {validateToken} = require("../services/authentication");
function checkForAuthenticationCookie(cookieName) {
  return (req, res, next) => {
    console.log("cookie", req.cookies);
    const tokenCokkieValue = req.cookies?.[cookieName];

    if (!tokenCokkieValue) {
      next();
    }
    try {
      const userPayload = validateToken(tokenCokkieValue);
      req.user = userPayload;
    } catch (error) {
      console.log(error);
    }
    next();
  };
}

module.exports = checkForAuthenticationCookie;
