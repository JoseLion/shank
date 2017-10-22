if (process.env.NODE_ENV !== 'production') {
  require('dotenv').config();
}

const express = require('express');
const next = require('next');

const PORT = process.env.PORT;

const app = next({ dev: true });
const handle = app.getRequestHandler();

app.prepare()
  .then(() => {
    const server = express();

    // Use next to render pages on all other routes
    server.get('*', (req, res) => handle(req, res));
    
    server.listen(PORT, () => {
      console.log(`Server listening on port ${PORT}`);
    });
  });