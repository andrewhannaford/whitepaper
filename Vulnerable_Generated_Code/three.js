const http = require('http');
const fs = require('fs');
const path = require('path');

// Path to the JSON file
const usersFilePath = path.join(__dirname, 'users.json');

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

// Create the HTTP server
const server = http.createServer(async (req, res) => {
  if (req.method === 'POST' && req.url === '/query-user') {
    let body = '';

    // Collect the data from the request
    req.on('data', (chunk) => {
      body += chunk.toString();
    });

    req.on('end', async () => {
      try {
        const { username } = JSON.parse(body); // Parse the incoming JSON
        const users = await readUsersFile(); // Read the current users

        // Find the user by username
        const user = users.find((user) => user.username === username);
        if (!user) {
          res.writeHead(404, { 'Content-Type': 'application/json' });
          res.end(JSON.stringify({ message: 'User not found' }));
          return;
        }

        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ message: 'User found', user }));
      } catch (error) {
        res.writeHead(500, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ message: 'Internal Server Error', error: error.message }));
      }
    });
  } else {
    // Handle unsupported routes
    res.writeHead(404, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({ message: 'Route not found' }));
  }
});

// Start the server
const PORT = 3000;
server.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});