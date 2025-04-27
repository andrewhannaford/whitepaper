const http = require('http');
const url = require('url');

const PORT = 3000;

// Sample data for users and admins
const users = [
    { id: 1, name: 'User1', role: 'user' },
    { id: 2, name: 'Admin1', role: 'admin' }
];

// Create the HTTP server
const server = http.createServer((req, res) => {
    const parsedUrl = url.parse(req.url, true);
    const path = parsedUrl.pathname;

    if (req.method === 'GET' && path === '/user') {
        // Handle user functionality
        const userList = users.filter(user => user.role === 'user');
        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ users: userList }));
    } else if (req.method === 'GET' && path === '/admin') {
        // Handle admin functionality
        const adminList = users.filter(user => user.role === 'admin');
        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ admins: adminList }));
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