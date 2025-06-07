const { Router } = require("express");
const multer = require("multer");
const { createHmac } = require("crypto");
const fs = require("fs");
const path = require("path");
const User = require("../models/user");
const { Usercheck } = require("../middleware/authentication");

const router = Router();
router.use(Usercheck);

// Configure multer storage
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, "./public/images"),
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname);
    cb(null, `user-${req.user.email}-${Date.now()}${ext}`);
  }
});

const upload = multer({
  storage,
  fileFilter: (req, file, cb) => file.mimetype.startsWith('image/') ? cb(null, true) : cb(new Error('Only images allowed'), false)
});

// GET profile edit page
router.get("/profile", (req, res) => res.render("Editprofile.ejs", { user: req.user }));

// POST profile update
router.post("/profile", upload.single("avatar"), async (req, res, next) => {
  try {
    const userId = req.user._id;
    const updateData = { fullname: req.body.username, email: req.body.email };

    if (req.file) {
      const oldImage = req.user.profileimageURL;
      if (oldImage && !oldImage.includes("OIP.webp")) {
        const oldImagePath = path.join(__dirname, '..', 'public', oldImage);
        fs.unlink(oldImagePath, err => err && console.error('Failed deleting old image:', err));
      }
      updateData.profileImage = `/images/${req.file.filename}`;
    }

    // Update in DB
    const updatedUser = await User.findByIdAndUpdate(userId, updateData, { new: true });

    // Refresh login session / req.user
    if (req.login) {
      // Passport.js
      req.login(updatedUser, err => err ? next(err) : res.redirect('/home'));
    } else if (req.session) {
      // Custom express-session
      req.session.user = updatedUser;
      req.user = updatedUser;
      res.redirect('/home');
    } else {
      // Fallback
      res.redirect('/home');
    }
  } catch (err) {
    console.error(err);
    res.status(500).render("Editprofile.ejs", { user: req.user, error: 'Server error' });
  }
});

// GET password update page
router.get("/password", (req, res) => res.render("passwordUpdate"));

// POST password update
router.post("/password", async (req, res) => {
  try {
    const { oldPassword, newPassword, confirmPassword } = req.body;
    if (newPassword !== confirmPassword) return res.render("passwordUpdate", { error: "New passwords do not match." });

    const user = await User.findById(req.user._id);
    const oldHash = createHmac("sha256", user.salt).update(oldPassword).digest("hex");
    if (oldHash !== user.password) return res.render("passwordUpdate", { error: "Old password is incorrect." });

    const newHash = createHmac("sha256", user.salt).update(newPassword).digest("hex");
    await User.findByIdAndUpdate(user._id, { password: newHash });

    res.render("passwordUpdate", { success: "Password changed successfully." });
  } catch (err) {
    console.error(err);
    res.status(500).render("passwordUpdate", { error: "Server error." });
  }
});

module.exports = router;
