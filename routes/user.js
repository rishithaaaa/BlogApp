const {Router} = require("express");
const USER = require("../models/user");

const router = Router();

router.get("/signin", (req, res) => {
  return res.render("signin");
});

router.get("/signup", (req, res) => {
  return res.render("signup");
});

router.post("/signin", async (req, res) => {
  const {email, password} = req.body;

  try {
    const token = await USER.matchPasswordAndCreateToken(email, password);
    console.log("tokennn", token);

    // return res.cookie("token", token);
    // return res.redirect("/");
  } catch (error) {
    console.log("token eroor", error);
    // return res.render("signin", {error: "Incorrect email or password"});
  }
});
router.post("/signup", async (req, res) => {
  // console.log(req.body);
  const {fullName, email, password} = req.body;

  await USER.create({
    fullName,
    email,
    password,
  });

  return res.redirect("/");
});

module.exports = router;
