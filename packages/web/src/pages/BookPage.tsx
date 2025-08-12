import React, { useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import {
  Container,
  Typography,
  Box,
  Card,
  CardMedia,
  Button,
  Divider,
  Paper,
  CircularProgress,
  Alert,
} from '@mui/material'
import {
  ArrowBack,
  Person,
  Category,
  CalendarToday,
  Language,
  Star,
  BookmarkBorder,
} from '@mui/icons-material'
import BookReview from '../components/BookReview'
import { useAppDispatch, useAppSelector } from '../store'
import { fetchBook } from '../store/slices/bookSlice'
import { useReadlist } from '../hooks/useReadlist'
import { useAuth } from '../hooks/useAuth'

const defaultCoverUrl = 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcR2GPXDDAv4NU5ydKBwsQslzfYG_GHLZ4tV6Axa1bHDW1JRMIlIlUEzQ3twQqzZjEKNDSA&usqp=CAU'

const BookPage: React.FC = () => {
  const { slug } = useParams<{ slug: string }>()
  const navigate = useNavigate()
  const dispatch = useAppDispatch()
  const { isAuthenticated } = useAuth()
  const { currentBook, isLoading, error } = useAppSelector((state: any) => state.book)
  const { addBookToReadlist, removeBookFromReadlist, isInReadlist } = useReadlist()

  useEffect(() => {
    if (slug) {
      dispatch(fetchBook(slug))
    }
  }, [dispatch, slug])

  const handleBackToBooks = () => navigate('/books')

  if (isLoading) {
    return (
      <Container sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '400px' }}>
        <CircularProgress />
      </Container>
    )
  }

  if (error || !currentBook) {
    return (
      <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
        <Alert severity="error" sx={{ mb: 3 }}>
          {error || 'Book not found'}
        </Alert>
        <Button
          startIcon={<ArrowBack />}
          onClick={handleBackToBooks}
          variant="outlined"
        >
          Back to List
        </Button>
      </Container>
    )
  }

  const book = currentBook?.data

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>      

      <Button
        startIcon={<ArrowBack />}
        onClick={handleBackToBooks}
        variant="outlined"
        sx={{ mb: 3 }}
      >
        Back to Books
      </Button>

      {/* Book Details */}
      <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: '1fr 2fr' }, gap: 4 }}>
        {/* Book Cover */}
        <Box>
          <Card elevation={3}>
            <CardMedia
              component="img"
              height="500"
              image={book.cover_url || defaultCoverUrl}
              alt={book.title}
              sx={{
                objectFit: 'cover',
                borderRadius: 1,
              }}
            />
          </Card>
        </Box>

        {/* Book Information */}
        <Box>
          <Paper elevation={2} sx={{ p: 3 }}>
            {/* Title and Rating */}
            <Box sx={{ mb: 3 }}>
              <Typography variant="h3" component="h1" gutterBottom sx={{ fontWeight: 600 }}>
                {book.title}
              </Typography>
              {book.rating && (
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <Star sx={{ color: 'warning.main' }} />
                  <Typography variant="body1" color="text.secondary">
                    {book.rating}/5
                  </Typography>
                </Box>
              )}
            </Box>

            {/* Author */}
            <Box sx={{ mb: 3 }}>
              <Typography variant="h5" color="primary.main" sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <Person /> by {book.author}
              </Typography>
            </Box>

            {/* Book Details Grid */}
            <Box sx={{ 
              display: 'grid', 
              gridTemplateColumns: { xs: '1fr', sm: 'repeat(2, 1fr)' }, 
              gap: 2, 
              mb: 3,
            }}>
              {book?.category?.display_name && (
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <Category color="action" />
                  <Typography variant="body1">
                    <strong>Category:</strong> {book.category.display_name}
                  </Typography>
                </Box>
              )}
              
              {book.published_at && (
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <CalendarToday color="action" />
                  <Typography variant="body1">
                    <strong>Published On:</strong> {new Date(book.published_at).toLocaleDateString()}
                  </Typography>
                </Box>
              )}

              {book.language && (
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <Language color="action" />
                  <Typography variant="body1">
                    <strong>Language:</strong> {book.language}
                  </Typography>
                </Box>
              )}             
            </Box>

            {/* Description */}
            {book.description && (
              <Box sx={{ mb: 3 }}>
                <Divider sx={{ mb: 2 }} />
                <Typography variant="body1" sx={{ lineHeight: 1.7 }}>
                  {book.description}
                </Typography>
              </Box>
            )}

            {/* Action */}
            <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>              
              <Button
                variant={isInReadlist(book._id) ? 'contained' : 'outlined'}
                size="large"
                sx={{ textTransform: 'none' }}
                startIcon={<BookmarkBorder />}
                onClick={() => isInReadlist(book._id) ? removeBookFromReadlist(book._id) : addBookToReadlist(book._id)}
              >
                Add to Reading List
              </Button>
            </Box>            
          </Paper>
            
          <Divider sx={{ my: 4 }} />
          {/* Review */}
          {isAuthenticated && (
            <Box sx={{ mb: 3 }}>
              <BookReview bookId={book._id} />
            </Box>
          )}
        </Box>
      </Box>
    </Container>
  )
}

export default BookPage
