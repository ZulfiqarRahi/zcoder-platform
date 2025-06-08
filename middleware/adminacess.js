const User = require("../models/user");

async function accessAdmin(req, res, next) {
  try {
    
    if (!req.user || !req.user._id) {
      console.log("User not signed in");
      return res.redirect("/user/signin");
    }

    const userId = req.user._id;
    const user = await User.findById(userId);

   
    if (!user || user.role !== "ADMIN") {
      console.log("Not an admin user");
      return res.redirect("/home");
    }

    next(); 
  } catch (err) {
    console.error("Error checking admin access:", err);
    return res.status(500).send("Internal Server Error");
  }
}

module.exports = { accessAdmin };
