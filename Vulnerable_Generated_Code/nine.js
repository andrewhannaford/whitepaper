const http = require('http');
const fs = require('fs');
const path = require('path');
const crypto = require('crypto');

// Path to the JSON file storing user credentials
const usersFilePath = path.join(__dirname, 'seven.json');

// Helper function to read the JSON file
const readUsersFile = () => {
  return new Promise((resolve, reject) => {
    fs.readFile(usersFilePath, 'utf8', (err, data) => {
      if (err) {
        reject(err);
      } else {
        resolve(JSON.parse(data));
      }
    });
  });
};

// Helper function to hash a password
const hashPassword = (password) => {
  return crypto.createHash('sha256').update(password).digest('hex');
};

// Create the HTTP server
const server = http.createServer(async (req, res) => {
  if (req.method === 'POST' && req.url === '/login') {
    let body = '';

    // Collect the data from the request
    req.on('data', (chunk) => {
      body += chunk.toString();
    });

    req.on('end', async () => {
      try {
        const { username, password } = JSON.parse(body);
        console.log(`Login attempt: username=${username}`);

        const users = await readUsersFile();

        // Find the user by username
        const user = users.find((user) => user.username === username);
        if (!user || user.password !== hashPassword(password)) {
          console.log(`Login failed for username=${username}`);
          res.writeHead(401, { 'Content-Type': 'application/json' });
          res.end(JSON.stringify({ message: 'Invalid username or password' }));
          return;
        }

        console.log(`Login successful for username=${username}`);
        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ message: 'Login successful' }));
      } catch (error) {
        console.error('Error processing login:', error.message);
        res.writeHead(500, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ message: 'Internal Server Error', error: error.message }));
      }
    });
  } else {
    // Handle unsupported routes
    console.log(`Unsupported route: ${req.method} ${req.url}`);
    res.writeHead(404, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({ message: 'Route not found' }));
  }
});

// Start the server
const PORT = 3000;
server.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});