const express = require("express");
const axios = require("axios");
const app = express();

app.use(express.json());

const OFFICIAL_EMAIL = "shivanshi.jain@chitkara.edu.in";

// Utility functions
const getFibonacci = (n) => {
  let fib = [0, 1];
  for (let i = 2; i <= n; i++) {
    fib.push(fib[i - 1] + fib[i - 2]);
  }
  return fib.slice(0, n + 1);
};

const getPrimes = (arr) => {
  const isPrime = (n) => {
    if (n < 2) return false;
    for (let i = 2; i <= Math.sqrt(n); i++) {
      if (n % i === 0) return false;
    }
    return true;
  };
  return arr.filter(isPrime);
};

const gcd = (a, b) => (b === 0 ? a : gcd(b, a % b));
const getHCF = (arr) => arr.reduce((a, b) => gcd(a, b));
const getLCM = (arr) => arr.reduce((a, b) => (a * b) / gcd(a, b));

// POST /bfhl
app.post("/bfhl", async (req, res) => {
  try {
    const body = req.body;
    let data;

    if (body.fibonacci !== undefined) {
      data = getFibonacci(body.fibonacci);
    } 
    else if (body.prime !== undefined) {
      data = getPrimes(body.prime);
    } 
    else if (body.lcm !== undefined) {
      data = getLCM(body.lcm);
    } 
    else if (body.hcf !== undefined) {
      data = getHCF(body.hcf);
    } 
    else if (body.AI !== undefined) {
      const response = await axios.post(
"https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent",

        {
          contents: [{ parts: [{ text: body.AI }] }]
        },
        {
          params: { key: process.env.GEMINI_API_KEY }
        }
      );

      data =
        response.data.candidates[0].content.parts[0].text.split(" ")[0];
    } 
    else {
      return res.status(400).json({
        is_success: false,
        official_email: OFFICIAL_EMAIL,
        data: "Invalid request key"
      });
    }

    res.status(200).json({
      is_success: true,
      official_email: OFFICIAL_EMAIL,
      data
    });
  } catch (err) {
    res.status(500).json({
      is_success: false,
      official_email: OFFICIAL_EMAIL,
      data: "Server error"
    });
  }
});

// GET /health
app.get("/health", (req, res) => {
  res.status(200).json({
    is_success: true,
    official_email: OFFICIAL_EMAIL
  });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log("Server running on port", PORT));
