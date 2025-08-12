import React from 'react'
import {
  Container,
  Typography,
  Box,
  Card,
  CardContent,
  Grid,
  Button,
} from '@mui/material'
import { Book as BookIcon, Group as GroupIcon, Favorite as FavoriteIcon } from '@mui/icons-material'

const HomePage: React.FC = () => {
  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      {/* Hero Section */}
      <Box sx={{ textAlign: 'center', mb: 6 }}>
        <Typography variant="h2" component="h1" gutterBottom sx={{ fontWeight: 'bold' }}>
          Welcome to Book Club
        </Typography>
        <Typography variant="h5" color="text.secondary" paragraph>
          Discover, share, and discuss your favorite books with fellow readers
        </Typography>
        <Button variant="contained" size="large" sx={{ mt: 2 }}>
          Get Started
        </Button>
      </Box>

      {/* Features Section */}
      {/* <Grid container spacing={4} sx={{ mb: 6 }}>
        <Grid item xs={12} md={4}>
          <Card sx={{ height: '100%', textAlign: 'center' }}>
            <CardContent>
              <BookIcon sx={{ fontSize: 60, color: 'primary.main', mb: 2 }} />
              <Typography variant="h5" component="h3" gutterBottom>
                Discover Books
              </Typography>
              <Typography variant="body1" color="text.secondary">
                Explore our vast collection of books across different genres and categories
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={4}>
          <Card sx={{ height: '100%', textAlign: 'center' }}>
            <CardContent>
              <GroupIcon sx={{ fontSize: 60, color: 'primary.main', mb: 2 }} />
              <Typography variant="h5" component="h3" gutterBottom>
                Join Discussions
              </Typography>
              <Typography variant="body1" color="text.secondary">
                Connect with other readers and share your thoughts on books
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={4}>
          <Card sx={{ height: '100%', textAlign: 'center' }}>
            <CardContent>
              <FavoriteIcon sx={{ fontSize: 60, color: 'primary.main', mb: 2 }} />
              <Typography variant="h5" component="h3" gutterBottom>
                Build Your Library
              </Typography>
              <Typography variant="body1" color="text.secondary">
                Create your personal reading list and track your progress
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid> */}

      {/* About Section */}
      <Box sx={{ textAlign: 'center', py: 4 }}>
        <Typography variant="h4" component="h2" gutterBottom>
          About Book Club
        </Typography>
        <Typography variant="body1" color="text.secondary" paragraph>
          Book Club is a community-driven platform where book lovers can discover new reads, 
          share their favorite books, and engage in meaningful discussions. Whether you're 
          a casual reader or a bookworm, there's something for everyone here.
        </Typography>
      </Box>
    </Container>
  )
}

export default HomePage 