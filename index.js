import { createServer } from 'vite';

const port = parseInt(process.env.PORT || '8080', 10);

createServer()
  .then(server => {
    return server.listen(port).then(() => {
      console.log(`Vite dev server running on port ${port}`);
    });
  })
  .catch(err => {
    console.error('Failed to start Vite dev server:', err);
    process.exit(1);
  });
