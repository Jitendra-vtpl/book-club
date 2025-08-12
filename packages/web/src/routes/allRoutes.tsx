import LoginPage from '../pages/LoginPage'
import SignupPage from '../pages/SignupPage'
import BookCatalogPage from '../pages/BookCatalogPage'
import BookPage from '../pages/BookPage'
import ReadlistPage from '../pages/ReadlistPage'

export const authProtectedRoutes = [
  { path: '/readlist', component: <ReadlistPage /> },
]

export const publicRoutes = [
  { path: '/', component: <BookCatalogPage /> },
  { path: '/login', component: <LoginPage /> },
  { path: '/signup', component: <SignupPage /> },
  { path: '/books', component: <BookCatalogPage /> },
  { path: '/books/:slug', component: <BookPage /> },
]