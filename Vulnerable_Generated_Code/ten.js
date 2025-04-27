const http = require('http');
const https = require('https');
const url = require('url');

// Helper function to fetch external content
const fetchContent = (targetUrl) => {
  return new Promise((resolve, reject) => {
    const client = targetUrl.startsWith('https') ? https : http;
    client.get(targetUrl, (res) => {
      let data = '';
      res.on('data', (chunk) => {
        data += chunk;
      });
      res.on('end', () => resolve(data));
    }).on('error', (err) => reject(err));
  });
};

// Create the HTTP server
const server = http.createServer(async (req, res) => {
  if (req.method === 'GET' && req.url.startsWith('/fetch')) {
    const query = url.parse(req.url, true).query;
    const targetUrl = query.url;

    if (!targetUrl) {
      res.writeHead(400, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ message: 'Missing "url" query parameter' }));
      return;
    }

    try {
      console.log(`Fetching content from: ${targetUrl}`);
      const content = await fetchContent(targetUrl);

      res.writeHead(200, { 'Content-Type': 'text/html' });
      res.end(`<h1>Fetched Content</h1><pre>${content}</pre>`);
    } catch (error) {
      console.error(`Error fetching content from ${targetUrl}:`, error.message);
      res.writeHead(500, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ message: 'Failed to fetch content', error: error.message }));
    }
  } else {
    res.writeHead(404, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({ message: 'Route not found' }));
  }
});

// Start the server
const PORT = 3000;
server.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});