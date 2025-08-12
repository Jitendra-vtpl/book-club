# Frontend App

React frontend for the Book Club app with TypeScript and Redux Toolkit.

## What it does

- User authentication and profile management
- Browse and search books
- Create and manage reading lists
- Write and read book reviews
- Real-time updates and notifications
- Responsive design with Material-UI

## Quick start

```bash
# Install dependencies
yarn install

# Start development server
yarn dev

# Build for production
yarn build

# Run tests
yarn test

# Lint code
yarn lint

# Fix linting issues
yarn lint:fix
```

## Environment variables

Create a `.env` file in the root:

```bash
PORT=7001
REACT_APP_API_URL=http://localhost:7000/api
REACT_APP_ENVIRONMENT=development
```

## Features

### Authentication
- User registration and login
- JWT token management
- Protected routes
- User profile management

### Book Management
- Book catalog with search
- Book details and information
- Add books to reading lists
- Book recommendations

### Reviews & Ratings
- Write book reviews
- Rate books (1-5 stars)
- View other users' reviews
- Review moderation

### Reading Lists
- Create personal reading lists
- Add/remove books
- Share lists with friends
- Track reading progress

### Real-time Features
- Live notifications
- Real-time activity feed
- Instant updates
- Socket.io integration

## Project structure

```
src/
├── components/        # Reusable UI components
│   ├── Header.tsx
│   └── *
├── config/           # Configuration files
│   ├── axios.ts      # HTTP client setup
│   └── constants.ts  # App constants
├── hooks/            # Custom React hooks
│   ├── useAuth.ts
│   └── *
├── layouts/          # Page layouts
│   ├── AuthLayout.tsx
│   └── PublicLayout.tsx
├── pages/            # Page components
│   ├── LoginPage.tsx
│   └── *
├── routes/           # Routing configuration
│   ├── allRoutes.tsx
│   ├── authProtected.tsx
│   ├── index.tsx
│   └── public.tsx
├── services/         # API services
│   └── api.ts
├── store/            # Redux store
│   ├── index.ts
│   └── slices/
│       ├── authSlice.ts
│       └── *
├── App.tsx           # Main app component
└── index.tsx         # App entry point
```

## Development server

```bash
yarn dev
```

## State management

Uses Redux Toolkit with slices

## API integration

- Axios for HTTP requests
- Automatic token handling
- Error interceptors
- Request/response logging

## Real-time features

- Socket.io client integration
- Real-time updates
- Connection management

## Styling

- Material-UI components

## Linting

```bash
# Check for issues
yarn lint

# Auto-fix issues
yarn lint:fix
```

ESLint configuration includes:
- React best practices
- TypeScript rules
- Code formatting
- Accessibility checks

