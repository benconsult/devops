const http = require('http');
const mysql = require('mysql2/promise');
const axios = require('axios');

//Db parameter
const pool = mysql.createPool({
  host: 'localhost',
  user: 'root',
  password: 'root',
  database: 'test'
});

//server config
const server = http.createServer(async (req, res) => {
  try {
    const response = await axios.get('https://api.ipify.org?format=json');
    const clientIP = response.data.ip;
    const reversedIP = clientIP.split('.').reverse().join('.');

    console.log('Received request from:', clientIP);
    console.log('Reversed IP:', reversedIP);

    // Save IP to MySQL database
    await pool.query('INSERT INTO ip_addresses (ip_address, reversed_ip) VALUES (?, ?)', [clientIP, reversedIP]);

    res.writeHead(200, {'Content-Type': 'text/html'});
    res.write(`<p>Your Public IP Address: ${clientIP}</p>`);
    res.write(`<p>Reversed IP Address: ${reversedIP}</p>`);
    res.end();
  } catch (error) {
    console.error('Error fetching or saving IP:', error);
    res.writeHead(500, {'Content-Type': 'text/plain'});
    res.end('Error fetching or saving IP');
  }
});

server.listen(3000, () => {
  console.log('Server listening on port 3000');
});
