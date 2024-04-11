# Utilor Backend Readme.
This backend is built on the Node.js Express framework

## Tools
- Prisma
- BCrypt
- Cookie-Parser
- Express
- JOI
- Morgan
- Database: Postgresql

## Commands
- `npm run dev`: Run the backend codebase in development mode
- `npm run build`: Compile the backend code
- `npm run test`: Test the code
- `node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"`: Generate a JWT Secret Key

## Folder Structure
- /build: compiled typescript
- /src: code folder
	- /utils: utility functions
	- /primsa: Prisma Schemas

## Instructions
1. Ensure all keys in `.env` file are valid. Keys can be found in `/src/server.ts`
2. Start Prisma:
	`npx prisma db push`: Sync database with Prisma Schema
	`npx prisma generate`: Generate Prisma Types
	(optional)`npx prisma studio`: To interact with prisma in the browser