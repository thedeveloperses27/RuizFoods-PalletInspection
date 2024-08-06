const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const cors = require('cors');
const pg = require('pg');
const sendGridMail = require('@sendgrid/mail');

require('dotenv').config();
sendGridMail.setApiKey(process.env.SENDGRID_API_KEY)

const app = express();
app.use(express.json());
app.use(cors());

const pool = new pg.Pool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  port: process.env.DB_PORT,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_DATABASE,
  ssl: {
    rejectUnauthorized: false
  }
});

// Middleware to authenticate and authorize user
const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1]; // Bearer TOKEN

  if (token == null) return res.status(401).send('Access Denied');

  jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
    if (err) return res.status(403).send('Invalid Token');
    req.user = user;
    next();
  });
};

// Use this middleware in your protected routes
app.use('/dashboard', authenticateToken);

// Endpoint to get data from a specific table
app.get('/getTableData/:tableName', async (req, res) => {
  const { tableName } = req.params;
  const validTables = ['TX1', 'CA1', 'CA4', 'SC1'];
  const page = parseInt(req.query.page) || 1; // Default to page 1 if not specified
  const limit = parseInt(req.query.limit) || 100; // Default to 100 records per page if not specified
  const offset = (page - 1) * limit;
  
  if (!validTables.includes(tableName)) {
    return res.status(400).send('Invalid table name');
  }

  try {
    const countQueryText = `SELECT COUNT(*) FROM "${tableName}"`;
    const countResult = await pool.query(countQueryText);
    const totalRows = parseInt(countResult.rows[0].count);
    const totalPages = Math.ceil(totalRows / limit);
    console.log(totalRows)
  
    const dataQueryText = `SELECT * FROM "${tableName}" ORDER BY risk_level ASC, (image_url IS NULL) ASC, location_id ASC LIMIT $1 OFFSET $2`;
    const result = await pool.query(dataQueryText, [limit, offset]);
    
    const summaryQueryText = `SELECT COUNT(*) FILTER (WHERE risk_level = TRUE) AS "risky" FROM "${tableName}"`;
    const summaryResult = await pool.query(summaryQueryText);
    console.log("Summary: ", summaryResult.rows[0]);
    const summary = summaryResult.rows[0];

    res.json({
      data: result.rows,
      currentPage: page,
      totalPages: totalPages,
      totalRows: totalRows,
      summary: summary
    });
  } catch (error) {
    console.error('Error fetching data:', error.message);
    res.status(500).send('Failed to fetch data');
  }
});

// Registration endpoint
app.post('/register', async (req, res) => {
  const { firstName, lastName, email, password } = req.body;
  console.log("Received email:", email);
  if (!email.endsWith('@ruizfoods.com')) {
    return res.status(400).send('Registration is only allowed with a Ruiz Foods email.');
  }

  try  {
    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = await pool.query(
      'INSERT INTO users (first_name, last_name, email, password, verified) VALUES ($1, $2, $3, $4, false) RETURNING *',
      [firstName, lastName, email, hashedPassword]
    );
    // For testing purposes:
    console.log(newUser.rows);

    // Create verification token
    const verificationToken = jwt.sign({ email }, process.env.JWT_SECRET, { expiresIn: '24h' });
    const verificationUrl = `http://localhost:3001/verify-email?token=${verificationToken}`;

    // Send verification email using SendGrid
    const msg = {
      to: email,
      from: 'palletins@ruizfoods.com',
      subject: 'Verify your Email',
      text: `Please click on the link to verify your email: ${verificationUrl}`,
      html: `Please click on the link to verify your email: <a href="${verificationUrl}">Verify Email</a>`,
    };

    await sendGridMail.send(msg);

    res.status(201).send('User registered. Please check your email to verify your account. Please check your spam folder.');
  } catch (error) {
    console.error('Error inserting new user:', error.message);
    if (error.response) {
      console.error('Error response from SendGrid:', error.response.body);
    }
    res.status(500).send('Database error: ' + error.message);
  }
});

app.post('/login', async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await pool.query('SELECT * FROM users WHERE email = $1', [email]);
    if (user.rows.length > 0) {
      const validPassword = await bcrypt.compare(password, user.rows[0].password);
      if (validPassword) {
        if (!user.rows[0].verified) {
          res.status(401).json({ error: "Please verify your email before logging in." });
        } else {
          const token = jwt.sign({ email: user.rows[0].email }, process.env.JWT_SECRET, { expiresIn: '24h' });
          res.json({ message: "Login successful.", token: token });
        }
      } else {
        res.status(401).json({ error: "Invalid password." });
      }
    } else {
      res.status(404).json({ error: "User not found." });
    }
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ error: "Database error during login." });
  }
});

// Email Verification Endpoint
// Following code is not used yet but it is self-explanatory
app.get('/verify-email', async (req, res) => {
  try {
    const { token } = req.query;
    const { email } = jwt.verify(token, process.env.JWT_SECRET);
    await pool.query('UPDATE users SET verified = true WHERE email = $1', [email]);
    res.send('Email verified successfully.');
  } catch (error) {
    res.status(400).send('Invalid or expired token.');
  }
});

app.listen(3001, () => {
  console.log(`Server running on port 3001`);
});
