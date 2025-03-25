# Rock Paper Scissors Game

A real-time multiplayer Rock Paper Scissors game built with Node.js, TypeScript, and WebSocket.

## Features

- Real-time multiplayer gameplay
- Player status tracking (in-game, made choice, out-of-game)
- Score tracking
- Game state management
- Clean architecture implementation

## Prerequisites

- Node.js (v14 or higher)
- npm (v6 or higher)

## Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd rock-paper-scissors
```

2. Install dependencies:
```bash
npm install
```

## Development

Run the development server:
```bash
npm run dev
```

The server will start on port 3000 by default.

## Building for Production

Build the project:
```bash
npm run build
```

Start the production server:
```bash
npm start
```

## WebSocket API

### Connection
Connect to the WebSocket server at `ws://localhost:3000`

### Messages

#### Join Game
```json
{
  "type": "join",
  "username": "player1"
}
```

#### Make Choice
```json
{
  "type": "choice",
  "choice": "rock" | "paper" | "scissors"
}
```

#### Reset Game
```json
{
  "type": "reset"
}
```

### Server Responses

#### Game State Update
```json
{
  "type": "gameState",
  "game": {
    "id": "game-id",
    "player1": {
      "id": "player1-id",
      "username": "player1",
      "status": "in-game" | "made-choice" | "out-of-game",
      "choice": "rock" | "paper" | "scissors",
      "score": 0
    },
    "player2": {
      // same structure as player1
    },
    "status": "waiting" | "in-progress" | "finished"
  }
}
```

#### Error Response
```json
{
  "type": "error",
  "message": "Error message"
}
``` 