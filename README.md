# Backend Template

A production-ready Express.js backend template with TypeScript, PostgreSQL, WebSockets, and comprehensive security features.

## Features

- ✅ **TypeScript** - Full type safety
- ✅ **Express.js** - Web framework
- ✅ **PostgreSQL** - Database with connection pooling
- ✅ **JWT Authentication** - Secure token-based auth with Bearer token support
- ✅ **WebSockets** - Real-time communication
- ✅ **Request Validation** - Zod schemas for input validation
- ✅ **Error Handling** - Centralized error handling middleware
- ✅ **Security** - Helmet.js, CORS, rate limiting
- ✅ **Logging** - Morgan HTTP request logger
- ✅ **Service Layer** - Clean architecture pattern
- ✅ **Graceful Shutdown** - Proper cleanup on termination

## Template Basic Requirements

The node version required is **Node v22.21.1 or higher**.

The project uses `pnpm` for dependency management.

```bash
pnpm install
```

## Installation

1. Clone the repository
2. Install dependencies:
```bash
pnpm install
```

3. Copy `.env.example` to `.env` and configure:
```bash
cp .env.example .env
```

4. Update the `.env` file with your configuration
5. Set up your database (see Database Setup below)

## Running the Application

### Development
```bash
pnpm start
```

### Build
```bash
pnpm build
```

### Production
```bash
node dist/index.js
```

## Database Setup

Run the SQL schema from `src/db/database.sql` in your PostgreSQL database.

Example table for projects:
```sql
CREATE TABLE IF NOT EXISTS projects (
  id SERIAL PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  description TEXT,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);
```

## Environment Variables

See `.env.example` for all available configuration options:

- **NODE_ENV**: Environment (development/production)
- **PORT**: Server port (default: 5000)
- **UI_URL**: Frontend URL for CORS
- **ACCESS_TOKEN_SECRET**: JWT secret key (min 32 chars for production)
- **LIMITER_TIME**: Rate limit time window in milliseconds
- **LIMITER_MAX_REQUESTS**: Max requests per time window
- **DB_HOST**, **DB_USER**, **DB_PORT**, **DB_PASSWORD**, **DB_DATABASE**: Individual database params
- **DATABASE_URL**: PostgreSQL connection URL (takes precedence if set)

## Project Structure

```
src/
├── controllers/       # Request handlers
├── db/               # Database configuration
├── middlewares/      # Express middlewares
│   └── jwtToken/    # JWT utilities
├── routes/          # API routes
├── services/        # Business logic layer
├── types/           # TypeScript type definitions
├── utils/           # Utility functions
├── validators/      # Zod validation schemas
├── websockets/      # WebSocket server
├── app.ts          # Express app configuration
├── constants.ts    # Environment variables
└── index.ts        # Entry point
```

## API Endpoints

### Public
- `GET /` - Welcome message
- `GET /health` - Health check with timestamp

### Protected (require JWT token)
- `GET /api/v1/test` - Test endpoint
- `POST /api/v1/projects` - Create project
- `GET /api/v1/projects` - Get all projects
- `GET /api/v1/projects/:id` - Get project by ID
- `PATCH /api/v1/projects/:id` - Update project
- `DELETE /api/v1/projects/:id` - Delete project

## Authentication

Include JWT token in Authorization header:
```
Authorization: Bearer <your-token>
```

## Response Format

### Success Response
```json
{
  "success": true,
  "message": "Optional message",
  "data": {}
}
```

### Error Response
```json
{
  "success": false,
  "message": "Error message",
  "errors": []
}
```

## Security Features

- **Helmet.js** - Security headers
- **CORS** - Configured for specific origin
- **Rate Limiting** - Per IP address
- **JWT Validation** - Bearer token support
- **Request Size Limits** - 50MB max
- **Input Validation** - Zod schemas
- **Error Handling** - Centralized middleware

## Template Structure Details

### Express

The template is based on the `Express` framework for creating HTTP APIs. It includes examples of authentication middleware using JWT (JSON Web Tokens) and IP rate limiting middleware to restrict the number of requests from the same IP within a specific timeframe. The `express-rate-limit` library is used for implementing the rate limiting.

Additionally, the template provides an example of defining a GET endpoint and its associated controller.

https://expressjs.com/

CORS is managed in the project through `cors` library. The configuration for this template is only allow request from a specific-url. This url is set through env variables.

### PostgreSQL

The template is designed for use with a relational database, specifically PostgreSQL. In the db folder, there is a `connectionDb` file where all connection parameters are imported from the .env file. The database connection can be configured either through a single `DATABASE_URL` or by specifying individual parameters. The `pg` library is used to manage database connections.

https://github.com/brianc/node-postgres/tree/master/packages/pg


To streamline database management, a `docker-compose` file is included, allowing easy setup of a PostgreSQL database in a Docker container. Each time a new container is run, the SQL queries defined in `database.sql` are executed within the container, initializing the database structure. Importantly, data persists across sessions by storing it in a Docker volume named `postgres_data`, which is automatically created.

The docker-compose file also spins up a pgAdmin instance, accessible at `localhost:80` in any browser, providing a user-friendly UI for database management and configuration. This setup allows for efficient development and simplified database handling.


### Websockets

The template also included a websocket simple server which allows handle client connections and messages. It the intial point to build a more complex websocket server. For this feature, the `ws` library is used.

### Prettier

The template has a basic prettier configuration to format code. This configuration could be easily changed in `.prettierc.json` file.

https://prettier.io/