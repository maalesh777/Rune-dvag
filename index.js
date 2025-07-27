import { createServer } from 'vite';

const port = process.env.PORT || 8080;

createServer({
  server: {
    port: Number(port),
    host: true,
  },
}).then((server) => {
  server.listen();
  console.log(`Vite dev server running on port ${port}`);
}).catch((err) => {
  console.error('Failed to start Vite dev server:', err);
  process.exit(1);
});
