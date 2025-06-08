
const express = require("express");
const axios = require("axios");
require("dotenv").config(); 

const router = express.Router();

router.post("/", async (req, res) => {
  try {
    const { source_code, language_id, stdin, input } = req.body;
    if (!source_code || !language_id) {
      return res.status(400).json({ error: "Missing source_code or language_id" });
    }

   
    const stdinData = (typeof stdin === "string" && stdin.trim() !== "")
      ? stdin
      : (typeof input === "string" ? input : "");

    
    const createRes = await axios.post(
      `https://${process.env.RAPIDAPI_HOST}/submissions?base64_encoded=false&wait=false`,
      {
        source_code,
        language_id: Number(language_id),
        stdin: stdinData
      },
      {
        headers: {
          "Content-Type": "application/json",
          "X-RapidAPI-Key": process.env.RAPIDAPI_KEY,
          "X-RapidAPI-Host": process.env.RAPIDAPI_HOST
        }
      }
    );

    const token = createRes.data.token;

   
    let result;
    do {
      await new Promise(r => setTimeout(r, 1500));
      const fetchRes = await axios.get(
        `https://${process.env.RAPIDAPI_HOST}/submissions/${token}?base64_encoded=false&fields=*`,
        {
          headers: {
            "X-RapidAPI-Key": process.env.RAPIDAPI_KEY,
            "X-RapidAPI-Host": process.env.RAPIDAPI_HOST
          }
        }
      );
      result = fetchRes.data;
    } while (result.status.id <= 2);

    return res.json({
      stdout: result.stdout,
      stderr: result.stderr,
      compile_output: result.compile_output,
      time: result.time,
      memory: result.memory,
      status: result.status
    });
  } catch (err) {
    console.error("Error in /compile:", err.response?.data || err.message);
    return res.status(500).json({ error: "Server error while compiling." });
  }
});

module.exports = router;
