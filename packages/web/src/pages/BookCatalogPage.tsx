import React, { useEffect } from 'react'
import {
  Container,
  Typography,
  Box,
  TextField,
  InputAdornment,
  CircularProgress,
  Pagination,
  Button,
} from '@mui/material'
import SearchIcon from '@mui/icons-material/Search'
import { useAppDispatch, useAppSelector } from '../store'
import { fetchBooks } from '../store/slices/bookSlice'
import BookCard from '../components/BookCard'

const BookCatalogPage: React.FC = () => {
  const dispatch = useAppDispatch()
  const { books, isLoading } = useAppSelector((state: any) => state.book)

  const [searchTerm, setSearchTerm] = React.useState('')
  const [page, setPage] = React.useState(1)

  useEffect(() => {
    dispatch(fetchBooks({ page, limit: 12, search: searchTerm }))
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dispatch, page])

  const handleSearch = (value: string) => {
    setSearchTerm(value)
    // setPage(1)
  }

  const handlePageChange = (_event: any, value: number) => {
    setPage(value)
  }

  const handleSearchSubmit = (event: any) => {
    event.preventDefault()
    dispatch(fetchBooks({ page, limit: 12, search: searchTerm }))
  }

  if (isLoading) {
    return (
      <Container sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '400px' }}>
        <CircularProgress />
      </Container>
    )
  }

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <Typography variant="h3" component="h1" gutterBottom>
        Books
      </Typography>

      <Box sx={{ mb: 4 }}>
        <form onSubmit={handleSearchSubmit}>
          <Box sx={{ display: 'flex', gap: 2, maxWidth: 600 }}>
            <TextField
              fullWidth
              placeholder="Search books by title or author..."
              value={searchTerm}
              onChange={(e: any) => handleSearch(e.target.value)}
              // onBlur={(e: any) => {
              //   e.target.form?.requestSubmit()
              // }}
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <Button type="submit" variant="text"
                      // disabled={searchTerm.length < 3 || !books?.data?.length}
                      onClick={handleSearchSubmit}
                    >
                      <SearchIcon sx={{ fontSize: 32 }} />
                    </Button>
                  </InputAdornment>
                ),
              }}
            />
          </Box>
        </form>
      </Box>


      {/* Book Listing */}
      {books?.data?.length > 0 ? (
        <>
          <Box 
            sx={{ 
              display: 'grid',
              gridTemplateColumns: {
                xs: '1fr',
                sm: 'repeat(2, 1fr)',
                md: 'repeat(3, 1fr)',
                lg: 'repeat(4, 1fr)',
              },
              gap: 3,
              mb: 4,
            }}
          >
            {books.data.map((book: any) => (
              <BookCard key={book._id} book={book} />
            ))}
          </Box>

          {/* Book Pagination */}
          {books?.meta?.totalPages > 1 && (
            <Box sx={{ display: 'flex', justifyContent: 'center' }}>
              <Pagination
                count={books?.meta?.totalPages}
                page={books?.meta?.currentPage}
                onChange={handlePageChange}
                color="primary"
                size="large"
              />
            </Box>
          )}
        </>
      ) : (
        <Box sx={{ textAlign: 'center', py: 8 }}>
          <Typography variant="h6" color="text.secondary" gutterBottom>
            No books found
          </Typography>
          <Typography variant="body1" color="text.secondary">
            Try adjusting your search terms or browse all books.
          </Typography>
        </Box>
      )}
    </Container>
  )
}

export default BookCatalogPage 