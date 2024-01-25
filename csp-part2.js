const express = require('express');

const app = express();
const port = 3000;

// Route for serving the provided HTML content
app.get('/', (req, res) => {
  res.send(`
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      <meta http-equiv="Content-Security-Policy" content="script-src 'sha256-r5WnLIRJ30HG3K9JRK/VRVdE687cfB6yBD3r8f7JH0w=';">
      <title>CSP Example with Hashes</title>
    </head>
    <body>
      <h1>Hello, CSP with Hashes!</h1>

      <script>
        console.log('This inline hello script will be allowed because its hash matches the one specified in the CSP policy.');
      </script>
      <!-- This inline script will be allowed because its hash matches the one specified in the CSP policy. -->

      <script>
        console.log('This inline script will be blocked because the hash is incorrect.');
      </script>
      <!-- This inline script will be blocked because its hash does not match the one specified in the CSP policy. -->
    </body>
    </html>
  `);
});

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
