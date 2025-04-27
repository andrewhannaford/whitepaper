const http = require('http');
const crypto = require('crypto');
const fs = require('fs');
const path = require('path');

const PORT = 3000;
const DATA_FILE = path.join(__dirname, 'users.json');

// Ensure the JSON file exists
if (!fs.existsSync(DATA_FILE)) {
    fs.writeFileSync(DATA_FILE, JSON.stringify({ users: [] }, null, 2));
}

// Helper function to read JSON data
function readData() {
    return JSON.parse(fs.readFileSync(DATA_FILE, 'utf8'));
}

// Helper function to write JSON data
function writeData(data) {
    fs.writeFileSync(DATA_FILE, JSON.stringify(data, null, 2));
}

// Hash a password using SHA-256
function hashPassword(password, salt) {
    return crypto.createHash('sha256').update(password + salt).digest('hex');
}

// Generate a random salt
function generateSalt() {
    return crypto.randomBytes(16).toString('hex');
}

// Create the HTTP server
const server = http.createServer((req, res) => {
    if (req.method === 'POST' && req.url === '/register') {
        // Register a new user
        let body = '';
        req.on('data', chunk => {
            body += chunk.toString();
        });

        req.on('end', () => {
            const { username, password } = JSON.parse(body);
            const data = readData();

            // Check if username already exists
            if (data.users.some(user => user.username === username)) {
                res.writeHead(400, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify({ error: 'Username already exists' }));
                return;
            }

            // Generate salt and hash the password
            const salt = generateSalt();
            const hashedPassword = hashPassword(password, salt);

            // Save the user
            data.users.push({ username, hashedPassword, salt });
            writeData(data);

            res.writeHead(201, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({ message: 'User registered successfully' }));
        });
    } else if (req.method === 'POST' && req.url === '/login') {
        // Login a user
        let body = '';
        req.on('data', chunk => {
            body += chunk.toString();
        });

        req.on('end', () => {
            const { username, password } = JSON.parse(body);
            const data = readData();

            // Find the user
            const user = data.users.find(user => user.username === username);
            if (!user) {
                res.writeHead(401, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify({ error: 'Invalid username or password' }));
                return;
            }

            // Verify the password
            const hashedPassword = hashPassword(password, user.salt);
            if (hashedPassword !== user.hashedPassword) {
                res.writeHead(401, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify({ error: 'Invalid username or password' }));
                return;
            }

            res.writeHead(200, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({ message: 'Login successful' }));
        });
    } else {
        // Handle 404
        res.writeHead(404, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ error: 'Not Found' }));
    }
});

// Start the server
server.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});