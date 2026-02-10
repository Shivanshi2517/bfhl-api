const express = require("express");
const { GoogleGenerativeAI } = require("@google/generative-ai");

const app = express();
app.use(express.json());

const OFFICIAL_EMAIL = "shivanshi.jain@chitkara.edu.in";

/* ================= UTILITY FUNCTIONS ================= */

// Fibonacci: returns n numbers
const getFibonacci = (n) => {
  if (n <= 0) return [];
  if (n === 1) return [0];
  if (n === 2) return [0, 1];

  const fib = [0, 1];
  for (let i = 2; i < n; i++) {
    fib.push(fib[i - 1] + fib[i - 2]);
  }
  return fib;
};

// Prime filter
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

// GCD / HCF
const gcd = (a, b) => (b === 0 ? a : gcd(b, a % b));
const getHCF = (arr) => arr.reduce((a, b) => gcd(a, b));

// LCM
const getLCM = (arr) =>
  arr.reduce((a, b) => (a * b) / gcd(a, b));

/* ================= GEMINI SETUP ================= */

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

/* ================= POST /bfhl ================= */

app.post("/bfhl", async (req, res) => {
  try {
    const body = req.body;
    let data;

    // Exactly ONE key is expected
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
      const model = genAI.getGenerativeModel({
        model: "gemini-1.5-flash"
      });

      const result = await model.generateContent(body.AI);
      const text = result.response.text();

      // Single-word response as required
      data = text.trim().split(" ")[0];
    } 
    else {
      return res.status(400).json({
        is_success: false,
        official_email: OFFICIAL_EMAIL,
        data: "Invalid request key"
      });
    }

    return res.status(200).json({
      is_success: true,
      official_email: OFFICIAL_EMAIL,
      data
    });

  } catch (error) {
    return res.status(500).json({
      is_success: false,
      official_email: OFFICIAL_EMAIL,
      data: "Internal server error"
    });
  }
});

/* ================= GET /health ================= */

app.get("/health", (req, res) => {
  res.status(200).json({
    is_success: true,
    official_email: OFFICIAL_EMAIL
  });
});

/* ================= SERVER ================= */

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log("Server running on port", PORT);
});
