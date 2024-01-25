const express = require('express');
const app = express();
const port = 3000;

// Middleware for setting up CSP with report-uri
function setCSPHeader(cspHeaderValue) {
  return (req, res, next) => {
    res.setHeader('Content-Security-Policy', cspHeaderValue);
    next();
  };
}

const cspHeaderValue = "script-src 'self'; report-uri http://localhost:3000/csp-violation-report";

app.use(setCSPHeader(cspHeaderValue));

// Route for rendering a page with inline script from the same origin
app.get('/', (req, res) => {
  res.send(`
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      <title>CSP Example</title>
      <script src="/same-origin-script.js"></script>
    </head>
    <body>
      <h1>Hello, CSP with Report-Uri!</h1>
    </body>
    </html>
  `);
});

// Endpoint to serve a JavaScript file from the same origin
app.get('/same-origin-script.js', (req, res) => {
  res.set({
    'Content-Type': 'application/javascript',
  });

  // This script is from the same origin and complies with the content security policy
  res.send('console.log("Script from the same origin!");');
});

// Endpoint to receive CSP violation reports
app.post('/csp-violation-report', (req, res) => {
  // Handle CSP violation reports as needed
  console.log('CSP Violation Report:', req.body);
  res.sendStatus(200);
});

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
