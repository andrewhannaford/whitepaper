const http = require('http');
const url = require('url');

// Mock data
const users = [
  { id: 1, username: 'user1', role: 'user' },
  { id: 2, username: 'admin1', role: 'admin' }
];

// Create the HTTP server
const server = http.createServer((req, res) => {
  const parsedUrl = url.parse(req.url, true);
  const path = parsedUrl.pathname;
  const method = req.method;

  // Route: Get user details
  if (method === 'GET' && path.startsWith('/user')) {
    const userId = parseInt(parsedUrl.query.id, 10);
    const user = users.find((u) => u.id === userId);

    if (user) {
      res.writeHead(200, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ message: 'User found', user }));
    } else {
      res.writeHead(404, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ message: 'User not found' }));
    }
  }
  // Route: Admin functionality
  else if (method === 'GET' && path.startsWith('/admin')) {
    const adminId = parseInt(parsedUrl.query.id, 10);
    const admin = users.find((u) => u.id === adminId && u.role === 'admin');

    if (admin) {
      res.writeHead(200, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ message: 'Admin access granted', admin }));
    } else {
      res.writeHead(403, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ message: 'Access denied' }));
    }
  }
  // Handle unsupported routes
  else {
    res.writeHead(404, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({ message: 'Route not found' }));
  }
});

// Start the server
const PORT = 3000;
server.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});