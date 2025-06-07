// ── routes/editor.js ──
const { Router } = require("express");
const Question=require("../models/question")
const {Usercheck}=require("../middleware/authentication")
const router = Router();
router.use(Usercheck);
// GET /editor → render the editor page
router.get("/editor", (req, res) => {
  // If you have any authentication middleware, you can insert it here.
  // e.g. router.get("/", checkForAuthentication, (req, res) => { … });
  res.render("editor"); 
});
router.get("/problem",async (req,res)=>{
  const prob=await Question.find({})
  res.render("Problems",{
  problem:prob
  })
})
router.post("/editor", (req, res) => {
  const { title, body, output } = req.body;

  // Render editor page with the question data
  res.render("editor", {
    question: {
      title,
      body,
      output
    }
  });
});
module.exports = router;
