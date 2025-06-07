const express = require("express");
const router = express.Router();
const {Usercheck}=require("../middleware/authentication");
router.use(Usercheck);
router.get("/",Usercheck, (req, res) => {
  res.render("joinroom", { user: req.user });
});

router.post("/join", (req, res) => {
  const room = req.body.room.trim();
  res.redirect(`/chat/${room}`);
});
router.get("/:room", (req, res) => {
  res.render("chat", {
    user: req.user,
    room: req.params.room,
  });
});

module.exports = router;