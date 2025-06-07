const {Router}=require("express")
const Question=require("../models/question")
const router=Router()
const {Usercheck}=require("../middleware/authentication");
router.use(Usercheck);
// Bookmark a question
router.post("/:id", async (req, res) => {
  const questionId = req.params.id;
  const userId = req.user._id;

  try {
    const question = await Question.findById(questionId);

    if (!question) {
      return res.status(404).send("Question not found");
    }

    // Add user ID only if not already bookmarked
    if (!question.bookmark.includes(userId)) {
      question.bookmark.push(userId);
      await question.save();
    }

    res.redirect("/console/problem"); // stay on same page
  } catch (err) {
    console.error("Bookmark error:", err);
    res.status(500).send("Server Error");
  }
});

router.get("/console/editor/:id", async (req, res) => {
  const questionId = req.params.id;

  try {
    const question = await Question.findById(questionId);

    if (!question) {
      return res.status(404).send("Question not found");
    }
    res.render("editor", {
      question:{
        title:question.Title,
        body: question.Body,
        output:question.Output
      }
    });
  } catch (err) {
    console.error("Error loading question for editor:", err);
    res.status(500).send("Server Error");
  }
});


// Remove bookmark
router.post("/unbook/:id", async (req, res) => {
  const questionId = req.params.id;
  const userId = req.user._id;

  try {
    await Question.findByIdAndUpdate(questionId, {
      $pull: { bookmark: userId }
    });

    res.redirect("/bookmarks");
  } catch (err) {
    console.error("Unbookmark error:", err);
    res.status(500).send("Server Error");
  }
});

// View all bookmarked questions
router.get("/", async (req, res) => {
  try {
    const questions = await Question.find({ bookmark: req.user._id });
    res.render("bookmark", { questions }); // create bookmarks.ejs for rendering
  } catch (err) {
    console.error("Fetching bookmarks failed:", err);
    res.status(500).send("Server Error");
  }
});
module.exports=router