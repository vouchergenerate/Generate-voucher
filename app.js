const express = require('express');
const session = require('express-session');
const fs = require('fs');
const app = express();
const PORT = 3000;

// Middleware
app.use(express.json());
app.use(express.static('public')); // Serve frontend files
app.use(
    session({
        secret: 'your-secret-key', // Ganti dengan kunci rahasia yang kuat
        resave: false,
        saveUninitialized: true,
        cookie: { maxAge: 86400000 } // Cookie berlaku selama 1 hari
    })
);

// Load databases
let vouchers = JSON.parse(fs.readFileSync('vouchers.json', 'utf8'));
let users = JSON.parse(fs.readFileSync('users.json', 'utf8')); // Admin users

// Login endpoint
app.post('/login', (req, res) => {
    const { username, password } = req.body;
    const user = users.find(
        (u) => u.username === username && u.password === password
    );
    if (user) {
        req.session.isAdmin = true; // Set session for admin
        return res.json({ message: 'Login successful' });
    }
    res.status(401).json({ message: 'Invalid username or password' });
});

// Logout endpoint
app.post('/logout', (req, res) => {
    req.session.destroy((err) => {
        if (err) {
            return res.status(500).json({ message: 'Logout failed' });
        }
        res.json({ message: 'Logout successful' });
    });
});

// Protect admin endpoint
app.use('/admin', (req, res, next) => {
    if (!req.session.isAdmin) {
        return res.status(403).json({ message: 'Access denied' });
    }
    next();
});

// Add Voucher
app.post('/add-voucher', (req, res) => {
    const { code } = req.body;
    if (!code) {
        return res.status(400).json({ message: 'Voucher code is required.' });
    }
    vouchers.push(code);
    fs.writeFileSync('vouchers.json', JSON.stringify(vouchers));
    res.json({ message: 'Voucher added successfully.' });
});

// Generate Voucher
app.get('/generate-voucher', (req, res) => {
    if (req.session.voucherGenerated) {
        return res.status(403).json({ message: 'You have already generated a voucher.' });
    }

    if (vouchers.length === 0) {
        return res.status(404).json({ message: 'No vouchers available.' });
    }

    // Assign a voucher
    const voucher = vouchers.pop();
    req.session.voucherGenerated = true; // Set session to prevent multiple generations
    req.session.voucherCode = voucher;  // Store voucher code in the session
    fs.writeFileSync('vouchers.json', JSON.stringify(vouchers));
    res.json({ voucher });
});

// Start server
app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});