const http = require('http');

// Simple test server
const server = http.createServer((req, res) => {
  res.writeHead(200, { 'Content-Type': 'text/plain' });
  res.end('Backend server is running! 🚀\n');
});

const PORT = 5000;
server.listen(PORT, () => {
  console.log(`✅ Test server running on http://localhost:${PORT}`);
});

// Test if main dependencies exist
try {
  require('express');
  require('socket.io');
  require('cors');
  console.log('✅ All dependencies are installed');
} catch (error) {
  console.log('❌ Missing dependencies:', error.message);
}
