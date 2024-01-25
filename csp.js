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

// Route for rendering a page with inline script (for testing)
app.get('/', (req, res) => {
  res.send(`
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      <title>CSP Example</title>
      <script>
        console.log('This inline script will be reported if there is a policy violation.');
      </script>
    </head>
    <body>
      <h1>Hello, CSP with Report-Uri!</h1>
    </body>
    </html>
  `);
});

// Endpoint to receive CSP violation reports
app.post('/csp-violation-report', (req, res) => {
  //console.log('CSP Violation Report:', req.body);
  res.sendStatus(200);
});

// Endpoint to handle user input from query parameters and embed it into HTML
app.get('/user-input', (req, res) => {
  const userInput = req.query.userInput;

  const htmlResponse = `
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      <title>User Input Example</title>
    </head>
    <body>
      <h1>User Input Example</h1>
      <p>User Input: ${userInput}</p>
    </body>
    </html>
  `;

  res.send(htmlResponse);
});

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
