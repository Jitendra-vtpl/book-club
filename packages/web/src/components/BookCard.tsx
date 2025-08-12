import { Card, CardContent, CardMedia, Typography, IconButton } from '@mui/material'
import { Bookmark, BookmarkBorder } from '@mui/icons-material'
import { Link } from 'react-router-dom'
import { useReadlist } from '../hooks/useReadlist'
import { useAuth } from '../hooks/useAuth'

const defaultCoverUrl = 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcR2GPXDDAv4NU5ydKBwsQslzfYG_GHLZ4tV6Axa1bHDW1JRMIlIlUEzQ3twQqzZjEKNDSA&usqp=CAU'

const BookCard: React.FC<{ book: any }> = ({ book }) => {
  const { isAuthenticated } = useAuth()
  const { isInReadlist, addBookToReadlist, removeBookFromReadlist } = useReadlist()

  const handleReadlistToggle = (bookId: string) => {    
    if (isInReadlist(book._id)) {
      removeBookFromReadlist(bookId)
    } else {
      addBookToReadlist(bookId)
    }
  }

  return (
    <Link to={`/books/${book.slug}`}>
      <Card
        key={book._id}
        sx={{
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          position: 'relative',
          transition: 'transform 0.2s ease-in-out, box-shadow 0.2s ease-in-out',
          '&:hover': {
            transform: 'translateY(-4px)',
            boxShadow: 4,
          },
        }}
      >
        <CardMedia
          component="img"
          height="250"
          image={book.cover_url || defaultCoverUrl}
          alt={book.title}
          sx={{
            objectFit: 'cover',
            borderBottom: '1px solid',
            borderColor: 'divider',
            position: 'relative',
          }}
        />
        {isAuthenticated && (
          <IconButton
            sx={{ 
              position: 'absolute', 
              top: 2, 
              right: 2, 
              zIndex: 10,
              // backgroundColor: 'rgba(255, 255, 255, 0.8)',
              '&:hover': {
                backgroundColor: 'rgba(255, 255, 255, 1)',
                opacity: 0.9,
              },
            }}
            onClick={(e: any) => {
              e.preventDefault()
              e.stopPropagation()
              handleReadlistToggle(book._id)
            }}
          >
            {isInReadlist(book._id) ? (
              <Bookmark color="success" sx={{ fontSize: '1.8rem' }} />
            ) : (
              <BookmarkBorder color="primary" sx={{ fontSize: '1.7rem' }} />
            )}
          </IconButton>
        )}
        <CardContent sx={{ flexGrow: 1, display: 'flex', flexDirection: 'column', p: 2 }}>
          <Typography
            variant="h6"
            component="h3"
            gutterBottom
            sx={{
              fontWeight: 600,
              lineHeight: 1.3,
              minHeight: '2.4em',
              display: '-webkit-box',
              WebkitLineClamp: 2,
              WebkitBoxOrient: 'vertical',
              overflow: 'hidden',
            }}
          >
            {book.title}
          </Typography>
          <Typography
            variant="body2"
            color="primary.main"
            gutterBottom
            sx={{
              fontWeight: 500,
              fontStyle: 'italic',
            }}
          >
            by {book.author}
          </Typography>
          <Typography
            variant="body2"
            color="text.secondary"
            gutterBottom
            sx={{
              fontSize: '0.875rem',
              mb: 1,
            }}
          >
            {book.category_id?.display_name || 'Uncategorized'}
          </Typography>
          {book.description && (
            <Typography
              variant="body2"
              color="text.secondary"
              sx={{
                mb: 2,
                lineHeight: 1.5,
                display: '-webkit-box',
                WebkitLineClamp: 3,
                WebkitBoxOrient: 'vertical',
                overflow: 'hidden',
                flexGrow: 1,
              }}
            >
              {book.description}
            </Typography>
          )}
        </CardContent>
      </Card>
    </Link>
  )
}

export default BookCard