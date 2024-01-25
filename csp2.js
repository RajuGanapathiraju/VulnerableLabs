const express = require('express');

const app = express();

// Middleware to generate a nonce and set it in res.locals
app.use((req, res, next) => {
  res.locals.nonce = Buffer.from(`${Math.random()}`).toString('base64');
  next();
});

// Route for rendering the HTML page with inline script
app.get('/', (req, res) => {
  // Set CSP header manually
  res.setHeader('Content-Security-Policy', `script-src 'self' 'nonce-${res.locals.nonce}'`);

  res.set({
    'Content-Type': 'text/html',
  });

  res.send(`
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>CSP Demo</title>
      <!-- Inline script with nonce attribute -->
      <script nonce="${res.locals.nonce}">
        console.log('Inline script executed!');
      </script>
    </head>
    <body>
      <h1>CSP Demo</h1>
    </body>
    </html>
  `);
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
