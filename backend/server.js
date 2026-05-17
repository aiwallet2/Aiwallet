require("dotenv").config();

const express = require("express");
const cors = require("cors");
const OpenAI = require("openai");

const app = express();

app.use(cors());
app.use(express.json());

const client = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
  baseURL:
    "https://api.groq.com/openai/v1",
});

app.get("/", (req, res) => {
  res.send("Backend Running");
});

app.post("/parse", async (req, res) => {
  try {
    const { prompt } = req.body;

    const completion =
      await client.chat.completions.create({
        model:
          "llama-3.3-70b-versatile",

        messages: [
          {
            role: "system",

            content:
              'Return ONLY valid JSON like {"amount":"0.01","token":"ETH","address":"0x123"}',
          },

          {
            role: "user",

            content: prompt,
          },
        ],

        temperature: 0,

        response_format: {
          type: "json_object",
        },
      });

    const output =
      completion.choices[0].message
        .content;

    console.log(output);

    res.json({
      output,
    });
  } catch (err) {
    console.log(err);

    res.status(500).json({
      error: err.message,
    });
  }
});

const PORT =
  process.env.PORT || 3001;

app.listen(PORT, () => {
  console.log(
    "AI backend running"
  );
});
