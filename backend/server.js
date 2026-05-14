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
    "https://integrate.api.nvidia.com/v1",
});

app.post("/parse", async (req, res) => {
  try {
    const { prompt } = req.body;

    const completion =
      await client.chat.completions.create({
        model:
          "deepseek-ai/deepseek-v4-flash",

        messages: [
          {
            role: "system",

            content:
              "Extract crypto transaction data and return JSON only with amount, token and address.",
          },

          {
            role: "user",

            content: prompt,
          },
        ],

        temperature: 0.2,
      });

    res.json({
      output:
        completion.choices[0].message
          .content,
    });
  } catch (err) {
    console.log(err);

    res.status(500).json({
      error: "AI Server Error",
    });
  }
});

app.listen(3001, () => {
  console.log(
    "AI backend running on 3001"
  );
});