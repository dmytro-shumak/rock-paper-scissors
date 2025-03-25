import { createServer } from 'node:http';
import path from 'node:path';
import express from 'express';
import { InMemoryGameRepository } from './infrastructure/repositories/InMemoryGameRepository';
import { InMemoryPlayerRepository } from './infrastructure/repositories/InMemoryPlayerRepository';
import { WebSocketServer } from './infrastructure/websocket/WebSocketServer';

const app = express();
const server = createServer(app);

// Serve static files from the public directory
app.use(express.static(path.join(__dirname, '../public')));

const gameRepository = new InMemoryGameRepository();
const playerRepository = new InMemoryPlayerRepository();

const wss = new WebSocketServer(server, gameRepository, playerRepository);

const PORT = process.env.PORT || 3000;

server.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
  console.log(`Open http://localhost:${PORT} in your browser to play`);
});
