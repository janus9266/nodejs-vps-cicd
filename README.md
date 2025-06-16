# WebPhone Backend

A TypeScript-based Express backend service for the WebPhone application.

## Prerequisites

- Node.js (v16 or higher)
- npm or yarn

## Setup

1. Install dependencies:
```bash
npm install
```

2. Create a `.env` file in the root directory with the following content:
```
PORT=3000
NODE_ENV=development
```

## Development

To start the development server with hot-reload:
```bash
npm run dev
```

## Building

To compile the TypeScript code:
```bash
npm run build
```

## Production

To start the production server:
```bash
npm start
```

## Available Scripts

- `npm run dev` - Start development server with hot-reload
- `npm run build` - Build the project
- `npm start` - Start the production server
- `npm run lint` - Run ESLint
- `npm test` - Run tests

## API Endpoints

### Health Check
- GET `/api/health` - Returns the service health status

## Project Structure

```
.
├── src/
│   ├── index.ts          # Application entry point
│   ├── routes/           # Route definitions
│   └── middleware/       # Custom middleware
├── dist/                 # Compiled JavaScript files
├── .env                  # Environment variables
├── package.json          # Project dependencies and scripts
└── tsconfig.json        # TypeScript configuration
``` 