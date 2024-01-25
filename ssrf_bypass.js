const express = require('express');
const request = require('request');
const dns = require('dns');

const app = express();
const port = 80;

// Function to check if an IP address is localhost
function isLocalhostIP(ip) {
  return ip === '127.0.0.1' || ip === '::1';
}


app.get('/', (req, res) => {
  // HTML response for the root path
  res.send('<h1>You successfully accessed localhost!</h1>');
});


app.get('/fetch', (req, res) => {
  // Extract the 'url' query parameter from the request
  const requestedUrl = req.query.url;

  // Extract the hostname from the requested URL
  const hostname = new URL(requestedUrl).hostname;

  // Perform a DNS resolution to get the IP addresses associated with the hostname
  dns.resolve4(hostname, (err, addresses) => {


    if (err) {
      // If there is an error during DNS resolution, send an error response
      return res.status(500).send('Internal Server Error: Unable to resolve the hostname.');
    }

    // Check if any of the resolved IP addresses are localhost
    const isLocalhost = addresses.some(isLocalhostIP);

    if (isLocalhost) {
      // If the resolved IP address is localhost, return a forbidden message
      return res.status(403).send('Forbidden: Access to localhost URLs is not allowed.');
    } else {
      // If the resolved IP address doesn't belong to localhost, make a request and return the response
      request(requestedUrl, (error, response, body) => {
        if (!error) {
          // If the request is successful, send the response to the end user
          res.send(body);
        } else {
          // If there is an error or the status code is not 200, send an error message
          res.status(500).send('Internal Server Error: Unable to fetch the requested URL.');
        }
      });
    }
  });
});

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
