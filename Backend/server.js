const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");
const jwt = require("jsonwebtoken");
const db = require("./db");
const app = express();
const PORT = 3000;
const SECRET = "mediverseSecretKey";

app.use(cors());
app.use(bodyParser.json());
app.use(cookieParser());

// Static files
app.use("/", express.static("public"));
app.use("/dashboard", express.static("dashboard"));

// Routes
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

app.get("/doctor-names", (req, res) => {
  db.query("SELECT doctor_name FROM doctor_login ORDER BY doctor_name", (err, results) => {
    if (err) return res.status(500).send("Error loading names");
    res.json(results);
  });
});

app.post("/appointments", (req, res) => {
  const { doctor, first_name, last_name, age, gender, email, date, time } = req.body;
  // Log payload
  // console.log("📦 Incoming appointment:", req.body);
  const sql = `
    INSERT INTO appointments (doctor, first_name, last_name, age, gender, email, date, time)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?)
  `;

  db.query(sql, [doctor, first_name, last_name, age, gender, email, date, time], (err) => {
    if (err) {
      // Log SQL error
      console.error("❌ Booking Error:", err); 
      return res.status(500).send("Failed to book appointment");
    }
    res.send("Appointment booked successfully");
  });
});

app.get("/appointments", (req, res) => {
  const doctor = req.query.doctor;
  if (!doctor) return res.status(400).send("Doctor name required");
  db.query("SELECT * FROM appointments WHERE doctor = ?", [doctor], (err, results) => {
    if (err) {
      console.error("Booking Error:", err); 
      return res.status(500).send("Failed to book appointment");
    }    
    res.json(results);
  });
});

// 🔐 Login
app.post("/login", (req, res) => {
  const { doctor, password } = req.body;
  db.query("SELECT * FROM doctor_login WHERE doctor_name = ? AND password = ?", [doctor, password], (err, results) => {
    if (err || results.length === 0) return res.status(401).send("Invalid credentials");

    const token = jwt.sign({ doctorName: doctor }, SECRET, { expiresIn: "1h" });
    res.cookie("token", token, { httpOnly: true });
    res.send("Login success");
  });
});

// 🔐 Auth middleware
function authMiddleware(req, res, next) {
  const token = req.cookies.token;
  if (!token) return res.redirect("/dashboard/login.html");
  try {
    const decoded = jwt.verify(token, SECRET);
    req.doctorName = decoded.doctorName;
    next();
  } catch (err) {
    res.clearCookie("token");
    res.redirect("/dashboard/login.html");
  }
}

// 🔐 Protect dashboard route
app.get("/dashboard/dashboard.html", authMiddleware, (req, res) => {
  res.sendFile(__dirname + "/dashboard/dashboard.html");
});

app.listen(PORT, () => {
  console.log(`✅ Server running at http://localhost:${PORT}`);
});

app.get("/me", (req, res) => {
  const token = req.cookies.token;
  if (!token) return res.status(401).send("Not logged in");

  try {
    const decoded = jwt.verify(token, SECRET);
    const doctorName = decoded.doctorName;

    const sql = `
      SELECT d.image 
      FROM doctor_login l
      LEFT JOIN doctors d ON d.name = l.doctor_name
      WHERE l.doctor_name = ?
    `;
    db.query(sql, [doctorName], (err, results) => {
      if (err || results.length === 0) {
        return res.status(500).send("Doctor not found");
      }

      // ✅ Prefix with server URL
      const baseURL = "http://localhost:3000/";
      const image = results[0].image ? baseURL + results[0].image : null;

      res.json({ doctorName, image });
    });
  } catch (err) {
    res.clearCookie("token");
    res.status(401).send("Invalid token");
  }
});
