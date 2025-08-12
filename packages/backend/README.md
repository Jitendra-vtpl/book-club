# Backend API

Express.js backend server for the Book Club app.

## What it does

- User authentication (login/signup)
- Book management (CRUD operations)
- Review system
- Reading lists
- Real-time updates with Socket.io
- MongoDB database with Mongoose

## Quick start

```bash
# Install dependencies
yarn install

# Set up environment variables
cp .env.example .env
# Edit .env with your database and JWT settings

# Run in development mode
yarn dev

# Seed database with sample data
yarn seed
```

## Environment variables

```bash
PORT=7000
APP_ENV=development
MONGO_DB_URI=mongodb://mongodb:27017
MONGO_DB_NAME=book_club_dev
JWT_ACCESS_SECRET=jwt-access-secret
JWT_REFRESH_SECRET=jwt-refresh-secret
WEB_APP_URL=http://localhost:7001
```

## API endpoints

### Health
- `GET /health` - Health check endpoint

### Authentication
- `POST /api/auth/signup` - User registration
- `POST /api/auth/login` - User login
- `POST /api/auth/logout` - User logout

### Books
- `GET /api/books` - Get all books
- `GET /api/books/:id` - Get book by ID
- `POST /api/books` - Create new book
- `PUT /api/books/:id` - Update book
- `DELETE /api/books/:id` - Delete book

### Reviews
- `GET /api/reviews` - Get all reviews
- `GET /api/reviews/:id` - Get review by ID
- `POST /api/reviews` - Create new review
- `PUT /api/reviews/:id` - Update review
- `DELETE /api/reviews/:id` - Delete review

### Reading Lists
- `GET /api/readlist` - Get user's reading list
- `POST /api/readlist` - Add book to reading list
- `DELETE /api/readlist/:id` - Remove book from list

## Database models

- **User**: Authentication and profile data
- **Book**: Book information and metadata
- **Review**: User book reviews and ratings
- **ReadingList**: User's personal reading lists
- **Category**: Book categories/genres

## Development

```bash
# Run with hot reload
yarn dev

# Build TypeScript
yarn build

# Run production server
yarn start

# Lint code
yarn lint

# Fix linting issues
yarn lint:fix

# Type check
yarn build:test
```

## Testing

```bash
# Run all tests
yarn test:commit

# This runs:
# - ESLint
# - TypeScript compilation check
```

## Database seeding

```bash
# Seed with sample data
yarn seed

# This creates:
# - Sample users
# - Sample books
# - Sample categories
# - Sample reviews
```

## Project structure

```
src/
├── config/                   # Configuration files
│   ├── app.ts                # App configuration 
│   ├── database.ts           # Database connection 
│   └── environment.ts        # Environment variables
├── controllers/              # business logic
│   ├── auth.ts               # Authentication 
│   └── *
├── errors/                   # Error handling
│   └── http.ts
├── helpers/                  # Utility functions
│   ├── common.ts             # Common utility f
│   └── *
├── interfaces/                # TypeScript interfaces
│   ├── express.d.ts          # Express type extensions
│   └── models/               # Model interfaces
│       ├── book.ts           # Book model interface
│       └── *
├── middleware/                # Express middleware
│   ├── auth.ts               # JWT authentication 
│   └── *
├── models/                    # Database models
│   ├── user.ts               # User schema and model
│   └── *
├── repository/                # Data access layer
│   ├── user.ts               # User data operations
│   └── *
├── routes/                    # API routes
│   ├── auth.ts               # Authentication routes
│   └── *
├── seeds/                     # Database seeding
│   ├── user.ts               # Sample user data
│   └── *
├── services/                  # Business logic services
│   ├── event.ts              # Event handling service
│   └── socket.ts             # Socket.io real-time service
├── validations/               # Input validation schemas
│   ├── auth.ts               # Authentication validation
│   └── *
├── app.ts                     # Express app setup and middleware
└── server.ts                  # Server entry point and startup
```

## Error handling

The app uses centralized error handling with:
- HTTP status codes
- Consistent error response format
- Logging for debugging
- User-friendly error messages

## Authentication

- JWT tokens for stateless auth
- Secure password hashing with bcrypt
- Token refresh mechanism
- Role-based access control

## CORS configuration

Configured to allow:
- Local development (localhost:8001)
- Production domains (configurable)
- Credentials (cookies, auth headers)

## Logging

Uses Winston for logging:
- Request/response logging
- Error logging
