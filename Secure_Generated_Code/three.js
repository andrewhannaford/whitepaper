const http = require('http');
const fs = require('fs');
const path = require('path');

const PORT = 3000;
const DATA_FILE = path.join(__dirname, 'mockDatabase.json');

// Ensure the JSON file exists
if (!fs.existsSync(DATA_FILE)) {
    fs.writeFileSync(DATA_FILE, JSON.stringify({ users: [] }, null, 2));
}

// Helper function to read JSON data
function readData() {
    return JSON.parse(fs.readFileSync(DATA_FILE, 'utf8'));
}

// Create the HTTP server
const server = http.createServer((req, res) => {
    if (req.method === 'POST' && req.url === '/query') {
        let body = '';

        // Collect incoming data
        req.on('data', chunk => {
            body += chunk.toString();
        });

        req.on('end', () => {
            try {
                const query = JSON.parse(body);
                const data = readData();

                // Validate query input
                if (!query.key || !query.value) {
                    res.writeHead(400, { 'Content-Type': 'application/json' });
                    res.end(JSON.stringify({ error: 'Invalid query format. Provide "key" and "value".' }));
                    return;
                }

                // Query the mock database
                const results = data.users.filter(user => user[query.key] === query.value);

                res.writeHead(200, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify({ results }));
            } catch (error) {
                res.writeHead(500, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify({ error: 'Internal server error.' }));
            }
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