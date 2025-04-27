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

// Create the HTTP server
const server = http.createServer(async (req, res) => {
  if (req.method === 'PUT' && req.url.startsWith('/update-profile')) {
    let body = '';

    // Collect the data from the request
    req.on('data', (chunk) => {
      body += chunk.toString();
    });

    req.on('end', async () => {
      try {
        const updatedUser = JSON.parse(body); // Parse the incoming JSON
        const users = await readUsersFile(); // Read the current users

        // Find the user by ID
        const userIndex = users.findIndex((user) => user.id === updatedUser.id);
        if (userIndex === -1) {
          res.writeHead(404, { 'Content-Type': 'application/json' });
          res.end(JSON.stringify({ message: 'User not found' }));
          return;
        }

        // Update the user's profile
        users[userIndex] = { ...users[userIndex], ...updatedUser };

        // Write the updated data back to the file
        await writeUsersFile(users);

        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ message: 'Profile updated successfully', user: users[userIndex] }));
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