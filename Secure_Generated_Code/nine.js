const http = require('http');
const url = require('url');

const PORT = 3000;

// Mock user credentials for demonstration purposes
const users = [
    { username: 'user1', password: 'password1' },
    { username: 'user2', password: 'password2' }
];

// Create the HTTP server
const server = http.createServer((req, res) => {
    const parsedUrl = url.parse(req.url, true);
    const path = parsedUrl.pathname;

    if (req.method === 'POST' && path === '/login') {
        let body = '';

        // Collect incoming data
        req.on('data', chunk => {
            body += chunk.toString();
        });

        req.on('end', () => {
            try {
                const { username, password } = JSON.parse(body);

                // Check credentials
                const user = users.find(u => u.username === username && u.password === password);

                if (user) {
                    console.log(`Login successful for user: ${username}`);
                    res.writeHead(200, { 'Content-Type': 'application/json' });
                    res.end(JSON.stringify({ success: true, message: 'Login successful' }));
                } else {
                    console.log(`Login failed for user: ${username}`);
                    res.writeHead(401, { 'Content-Type': 'application/json' });
                    res.end(JSON.stringify({ success: false, message: 'Invalid credentials' }));
                }
            } catch (error) {
                console.error('Error processing login:', error);
                res.writeHead(500, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify({ success: false, message: 'Internal server error' }));
            }
        });
    } else {
        // Handle 404
        res.writeHead(404, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ success: false, message: 'Not Found' }));
    }
});

// Start the server
server.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});