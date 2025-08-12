import React, { useEffect, useState } from 'react'
import {
  Container, Typography, Box, CircularProgress,
  CardMedia,
  Card,
  CardContent,
  IconButton,
} from '@mui/material'
import { Delete as DeleteIcon } from '@mui/icons-material'
import { useReadlist } from '../hooks/useReadlist'
import { useAuth } from '../hooks/useAuth'
import { useAppDispatch } from '../store'
import { fetchReadList } from '../store/slices/readlistSlice'
import { readlistAPI } from '../services/api'

const ReadlistPage: React.FC = () => {
  const dispatch = useAppDispatch()
  const { isAuthenticated } = useAuth()
  const { isLoading, removeBookFromReadlist } = useReadlist()
  const [books, setBooks] = useState([])

  useEffect(() => {
    if (isAuthenticated) {
      dispatch(fetchReadList())
    }
  }, [dispatch, isAuthenticated])

  useEffect(() => {
    if (isAuthenticated) {
      readlistAPI.getReadListBooks().then((res: any) => {
        setBooks(res.data.data || [])
      }).catch((err: any) => {
        console.log('err', err)
      })
    }
  }, [isAuthenticated])

  if (isLoading) {
    return (
      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Box display="flex" justifyContent="center" alignItems="center" minHeight="400px">
          <CircularProgress />
        </Box>
      </Container>
    )
  }

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Typography variant="h4" component="h1" gutterBottom>
        <b>My Reading List</b>
      </Typography>
      
      {!books?.length ? (
        <Box textAlign="center" py={8}>
          <Typography variant="h6" color="text.secondary" gutterBottom>
            Your readlist is empty
          </Typography>
          <Typography variant="body1" color="text.secondary">
            Start adding books to your readlist to see them here!
          </Typography>
        </Box>
      ) : (
        <Box sx={{ 
          display: 'grid', 
          gridTemplateColumns: {
            xs: 'repeat(auto-fill, minmax(150px, 1fr))',
            sm: 'repeat(auto-fill, minmax(180px, 1fr))',
            md: 'repeat(auto-fill, minmax(200px, 1fr))',
            lg: 'repeat(auto-fill, minmax(200px, 1fr))',
          },
          gap: { xs: 1, sm: 1.5, md: 2 },
          justifyContent: 'center',
        }}>
          {books.map((book: any) => (
            <Card
              key={book._id}
              sx={{
                width: '100%',
                height: { xs: 250, sm: 280, md: 300 },
                flexDirection: 'column',
                backgroundColor: 'grey.100',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                borderRadius: 1,
                position: 'relative',
                transition: 'transform 0.2s ease-in-out, box-shadow 0.2s ease-in-out',
                '&:hover': {
                  transform: 'translateY(-4px)',
                  boxShadow: 1,
                },
              }}
            >
              <CardMedia
                component="img"
                image={book.cover_url}
                alt={book.title}
                sx={{
                  height: { xs: 180, sm: 200, md: 230 },
                  objectFit: 'cover',
                  borderBottom: '1px solid',
                  borderColor: 'divider',
                  position: 'relative',
                }}
              />
              <IconButton
                sx={{ position: 'absolute', top: 5, right: 5 }}
                onClick={() => {
                  removeBookFromReadlist(book._id)
                  setBooks(books.filter((b: any) => b._id !== book._id))
                }}
              >
                <DeleteIcon color="error" />
              </IconButton>
              <CardContent sx={{ flexGrow: 1, display: 'flex', flexDirection: 'column', p: { xs: 1, sm: 1.5, md: 2 } }}>
                <Typography 
                  color="text.secondary" 
                  variant="body2"
                  sx={{ 
                    textAlign: 'center',
                    fontSize: { xs: '0.75rem', sm: '0.875rem', md: '1rem' },
                  }}
                >
                  {book.title}
                </Typography>
              </CardContent>
            </Card>
          ))}
        </Box>
      )}
    </Container>
  )
}

export default ReadlistPage 