const http = require('http');
const fs = require('fs');
const path = require('path');
const crypto = require('crypto');

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

// Helper function to write to the JSON file
const writeUsersFile = (data) => {
  return new Promise((resolve, reject) => {
    fs.writeFile(usersFilePath, JSON.stringify(data, null, 2), 'utf8', (err) => {
      if (err) {
        reject(err);
      } else {
        resolve();
      }
    });
  });
};

// Helper function to hash a password with a salt
const hashPassword = (password, salt) => {
  const hash = crypto.createHmac('sha256', salt);
  hash.update(password);
  return hash.digest('hex');
};

// Create the HTTP server
const server = http.createServer(async (req, res) => {
  if (req.method === 'POST' && req.url === '/register') {
    let body = '';

    // Collect the data from the request
    req.on('data', (chunk) => {
      body += chunk.toString();
    });

    req.on('end', async () => {
      try {
        const { username, password } = JSON.parse(body);
        const users = await readUsersFile();

        // Check if the username already exists
        if (users.some((user) => user.username === username)) {
          res.writeHead(400, { 'Content-Type': 'application/json' });
          res.end(JSON.stringify({ message: 'Username already exists' }));
          return;
        }

        // Generate a salt and hash the password
        const salt = crypto.randomBytes(16).toString('hex');
        const hashedPassword = hashPassword(password, salt);

        // Add the new user
        users.push({ username, salt, hashedPassword });
        await writeUsersFile(users);

        res.writeHead(201, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ message: 'User registered successfully' }));
      } catch (error) {
        res.writeHead(500, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ message: 'Internal Server Error', error: error.message }));
      }
    });
  } else if (req.method === 'POST' && req.url === '/login') {
    let body = '';

    // Collect the data from the request
    req.on('data', (chunk) => {
      body += chunk.toString();
    });

    req.on('end', async () => {
      try {
        const { username, password } = JSON.parse(body);
        const users = await readUsersFile();

        // Find the user by username
        const user = users.find((user) => user.username === username);
        if (!user) {
          res.writeHead(401, { 'Content-Type': 'application/json' });
          res.end(JSON.stringify({ message: 'Invalid username or password' }));
          return;
        }

        // Verify the password
        const hashedPassword = hashPassword(password, user.salt);
        if (hashedPassword !== user.hashedPassword) {
          res.writeHead(401, { 'Content-Type': 'application/json' });
          res.end(JSON.stringify({ message: 'Invalid username or password' }));
          return;
        }

        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ message: 'Login successful' }));
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