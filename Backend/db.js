const mysql = require("mysql2");

const connection = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "root123",    
  database: "mediverse" 
});

connection.connect((err) => {
  if (err) console.error("MySQL Connection Error:", err);
  else console.log("✅ Connected to MySQL");
});

module.exports = connection;
