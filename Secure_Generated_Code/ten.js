const http = require('http');
const https = require('https');
const url = require('url');

const PORT = 3000;

// Function to fetch content from a URL
function fetchContent(targetUrl, callback) {
    const protocol = targetUrl.startsWith('https') ? https : http;

    protocol.get(targetUrl, (res) => {
        let data = '';

        // Collect data chunks
        res.on('data', (chunk) => {
            data += chunk;
        });

        // On end, return the collected data
        res.on('end', () => {
            callback(null, data);
        });
    }).on('error', (err) => {
        callback(err);
    });
}

// Create the HTTP server
const server = http.createServer((req, res) => {
    if (req.method === 'POST' && req.url === '/fetch') {
        let body = '';

        // Collect incoming data
        req.on('data', (chunk) => {
            body += chunk.toString();
        });

        req.on('end', () => {
            try {
                const { targetUrl } = JSON.parse(body);

                // Validate the URL
                if (!targetUrl || !/^https?:\/\/.+/.test(targetUrl)) {
                    res.writeHead(400, { 'Content-Type': 'application/json' });
                    res.end(JSON.stringify({ success: false, message: 'Invalid URL' }));
                    return;
                }

                // Fetch content from the provided URL
                fetchContent(targetUrl, (err, data) => {
                    if (err) {
                        console.error('Error fetching content:', err);
                        res.writeHead(500, { 'Content-Type': 'application/json' });
                        res.end(JSON.stringify({ success: false, message: 'Failed to fetch content' }));
                    } else {
                        res.writeHead(200, { 'Content-Type': 'application/json' });
                        res.end(JSON.stringify({ success: true, content: data }));
                    }
                });
            } catch (error) {
                console.error('Error processing request:', error);
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