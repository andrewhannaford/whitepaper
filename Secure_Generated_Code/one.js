const http = require('http');
const fs = require('fs');
const path = require('path');

const PORT = 3000;
const DATA_FILE = path.join(__dirname, 'userProfiles.json');

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

// Create the HTTP server
const server = http.createServer((req, res) => {
    if (req.method === 'GET' && req.url === '/profile') {
        // Fetch all profiles
        const data = readData();
        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify(data));
    } else if (req.method === 'POST' && req.url === '/profile') {
        // Update or add a profile
        let body = '';
        req.on('data', chunk => {
            body += chunk.toString();
        });

        req.on('end', () => {
            const newProfile = JSON.parse(body);
            const data = readData();

            // Check if user exists
            const userIndex = data.users.findIndex(user => user.id === newProfile.id);
            if (userIndex !== -1) {
                // Update existing user
                data.users[userIndex] = { ...data.users[userIndex], ...newProfile };
            } else {
                // Add new user
                data.users.push(newProfile);
            }

            writeData(data);

            res.writeHead(200, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({ message: 'Profile updated successfully' }));
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