import express from 'express';
import { createServer } from 'http';
import path from 'path';
import { WebSocketServer } from './infrastructure/websocket/WebSocketServer';
import { InMemoryGameRepository } from './infrastructure/repositories/InMemoryGameRepository';
import { InMemoryPlayerRepository } from './infrastructure/repositories/InMemoryPlayerRepository';

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