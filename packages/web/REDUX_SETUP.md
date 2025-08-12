# Redux Toolkit Setup

This document explains the Redux Toolkit setup in the Book Club web application.

## What's Installed

- `@reduxjs/toolkit` - The official, opinionated Redux toolkit
- `react-redux` - React bindings for Redux
- `@types/react-redux` - TypeScript types for React Redux

## Project Structure

```
src/
├── store/
│   ├── index.ts              # Main store configuration
│   └── slices/
│       ├── authSlice.ts      # Authentication state management
│       └── bookSlice.ts      # Book state management
├── components/
│   └── ReduxExample.tsx      # Example component using Redux
└── App.tsx                   # Wrapped with Redux Provider
```

## Store Configuration

The main store is configured in `src/store/index.ts` with:
- Redux Toolkit's `configureStore`
- Custom typed hooks (`useAppDispatch`, `useAppSelector`)
- Middleware configuration for serialization

## Slices

### Auth Slice (`authSlice.ts`)
Manages authentication state including:
- User information
- Access token
- Authentication status
- Loading states
- Error handling

**Actions:**
- `loginUser` - Async thunk for user login
- `logoutUser` - Async thunk for user logout
- `clearError` - Clear error messages
- `setCredentials` - Set user credentials

### Book Slice (`bookSlice.ts`)
Manages book-related state including:
- List of books
- Current book details
- Pagination information
- Loading states
- Error handling

**Actions:**
- `fetchBooks` - Async thunk for fetching book list
- `fetchBook` - Async thunk for fetching single book
- `clearError` - Clear error messages
- `clearCurrentBook` - Clear current book selection

## Usage Examples

### Using Redux in Components

```tsx
import { useAppDispatch, useAppSelector } from '../store'

const MyComponent = () => {
  const dispatch = useAppDispatch()
  const { user, isAuthenticated } = useAppSelector(state => state.auth)
  
  // Dispatch actions
  const handleLogin = () => {
    dispatch(loginUser({ email: 'user@example.com', password: 'password' }))
  }
  
  return (
    <div>
      {isAuthenticated ? `Welcome, ${user?.name}!` : 'Please log in'}
    </div>
  )
}
```

### Async Thunks

Async thunks handle API calls and automatically manage loading states:

```tsx
// The thunk automatically sets isLoading: true when pending
// and updates the state with the response when fulfilled
dispatch(fetchBooks({ page: 1, limit: 10, search: 'fiction' }))
```

## Type Safety

The store provides full TypeScript support:
- `RootState` - Type for the entire store state
- `AppDispatch` - Type for the store dispatch function
- `useAppDispatch` and `useAppSelector` - Typed versions of Redux hooks

## Adding New Slices

1. Create a new slice file in `src/store/slices/`
2. Use `createSlice` and `createAsyncThunk` from Redux Toolkit
3. Import and add the reducer to the store in `src/store/index.ts`

## Best Practices

- Use async thunks for API calls
- Keep slices focused on specific domains
- Use TypeScript interfaces for state and actions
- Leverage Redux Toolkit's built-in immutability helpers
- Use the provided typed hooks instead of plain Redux hooks

## Next Steps

- Implement actual API integration
- Add more slices as needed (categories, users, etc.)
- Consider adding Redux Persist for state persistence
- Add Redux DevTools for debugging 