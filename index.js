const express = require("express");
const app = express();

app.use(express.json());


app.post("/bfhl", (req, res) => {
  const { data } = req.body;

  let numbers = [];
  let alphabets = [];

  data.forEach(item => {
    if (!isNaN(item)) numbers.push(item);
    else alphabets.push(item);
  });

  res.json({
    is_success: true,
    user_id: "shivanshi_jain_2310991210",
    email: "shivanshijain@gmail.com",
    roll_number: "2310991210",
    numbers,
    alphabets
  });
});

app.get("/health", (req, res) => {
  res.status(200).json({ status: "API is running" });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
