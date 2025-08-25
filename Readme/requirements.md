# Project Requirements

## General
- Do not include your name or Affordmed anywhere in the repository, README, or commit messages.
- Use production-grade coding standards, clear folder structure, and appropriate comments.
- No plagiarism.

## Backend
- Use Node.js with Express and TypeScript.
- Implement a URL shortener microservice with:
  - POST `/shorturls` to create a short URL (with optional validity and custom shortcode).
  - GET `/shorturls/:shortcode` to get stats for a short URL.
  - GET `/:shortcode` to redirect to the original URL.
- Integrate a reusable logging middleware that logs to the evaluation server.
- Use CORS to allow frontend access.
- Store data in-memory (or extend to persistent storage if required).
- Run backend on port 4000.

## Frontend
- Use React (with TypeScript) and Material UI.
- Provide a form to create short URLs and display the result.
- Allow users to get stats for a shortcode.
- Implement a separate statistics page listing all created short URLs in the session, with click details (timestamp, referrer, IP, geo if available).
- Use React Router for navigation.
- Run frontend on port 3000 and proxy API requests to backend on port 4000.

## Logging Middleware
- Implement as a reusable TypeScript package.
- Expose a function to log events to the evaluation server using the provided API and access token.

## Other
- Use `.gitignore` to exclude `node_modules`, `dist`, and `.env` files.
- Document all setup and usage steps in a README if required.



commands to run project
npm run build
npm run dev

npx vite