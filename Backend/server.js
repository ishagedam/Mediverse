const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const db = require("./db");
const app = express();
const PORT = 3000;

app.use(cors());
app.use(bodyParser.json());
app.use(express.static("public"));

app.get("/departments", (req, res) => {
  db.query("SELECT * FROM departments", (err, results) => {
    if (err) return res.status(500).send("Error loading departments");
    res.json(results);
  });
});

app.get("/doctors", (req, res) => {
  db.query("SELECT * FROM doctors", (err, results) => {
    if (err) return res.status(500).send("Error loading doctors");
    res.json(results);
  });
});

app.post("/appointments", (req, res) => {
  const { doctor, first_name, last_name, age, gender, email, date, time } = req.body;
const sql = `
  INSERT INTO appointments (doctor, first_name, last_name, age, gender, email, date, time)
  VALUES (?, ?, ?, ?, ?, ?, ?, ?)
`;
db.query(sql, [doctor, first_name, last_name, age, gender, email, date, time], (err) => {
    if (err) return res.status(500).send("Failed to book appointment");
    res.send("Appointment booked successfully");
  });
});

app.listen(PORT, () => {
  console.log(`✅ Server running at http://localhost:${PORT}`);
});
