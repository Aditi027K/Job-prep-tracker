const mysql = require('mysql2');

const connection = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: 'Aditi@2004',     // enter your MySQL password if you set one
  database: 'jobprep'
});

connection.connect((err) => {
  if (err) {
    console.error('❌ DB connection failed:', err);
    return;
  }
  console.log('✅ Connected to MySQL database!');
});

module.exports = connection;


module.exports = connection;
