// ── routes/editor.js ──
const { Router } = require("express");
const Question=require("../models/question")
const {Usercheck}=require("../middleware/authentication")
const router = Router();
router.use(Usercheck);

router.get("/editor", (req, res) => {
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

  res.render("editor", {
    question: {
      title,
      body,
      output
    }
  });
});
module.exports = router;
