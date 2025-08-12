import React, { useState, useEffect, useCallback } from 'react'
import {
  Box,
  Container,
  Typography,
  Paper,
  Rating,  
  CircularProgress,
  Avatar,
  Card,
  CardContent,
  IconButton,
} from '@mui/material'
import {
  Delete as DeleteIcon,
  Person as PersonIcon,
} from '@mui/icons-material'
import { useAuth } from '../hooks/useAuth'
import WriteBookReview from './WriteBookReview'
import { reviewsAPI } from '../services/api'
import { useSocket } from '../hooks/useSocket'

const BookReview: React.FC<{bookId: string}> = ({ bookId }) => {
  const { isAuthenticated, user } = useAuth()
  const [isLoading, setIsLoading] = useState(false)
  const [reviews, setReviews] = useState<any[]>([])
  const [refreshReviews, setRefreshReviews] = useState(new Date())
  const [userReview, setUserReview] = useState(false)
  const [averageRating, setAverageRating] = useState(0)

  useEffect(() => {
    const fetchReviews = async () => {      
      try {
        setIsLoading(true)
        const response = await reviewsAPI.getReviews(bookId) as any
        setReviews(response?.data?.data || [])
        setIsLoading(false)
      } catch (error: any) {
        console.error('Error fetching reviews', error)
      }
    }
    if (bookId) {
      fetchReviews()
    }
  }, [bookId, refreshReviews])

  useEffect(() => {
    if (user) {
      const isUserReview = reviews.find((review: any) => review.user_id?._id === user?.id)
      setUserReview(!!isUserReview)
    }
    const averageRating = reviews.length ?
      reviews.reduce((sum: number, review: any) => sum + review.rating, 0) / reviews.length : 0
    
    setAverageRating(averageRating)

  }, [user, reviews])

  const handleDeleteReview = async (reviewId: string) => {
    // eslint-disable-next-line no-restricted-globals
    if (!confirm('Are you sure you want to delete this review?')) return

    try {
      await reviewsAPI.deleteReview(reviewId)
      // setRefreshReviews(new Date())
    } catch (error: any) {
      console.error('Error deleting review', error)
    }
  }
  
  // socket: on someone added a review
  const handleNewComment = useCallback((data: any) => {
    // console.log('New comment received:', data)
    setReviews((prev: any[]) => [data, ...prev])
  }, [])

  // socket: on someone deleted a review
  const handleCommentDeleted = useCallback((data: any) => {
    // console.log('Review deleted:', data)
    setReviews((prev: any[]) => prev.filter((review: any) => review._id !== data._id))
  }, [])
  
  const { isConnected, joinBookRoom, leaveBookRoom } = useSocket({
    bookId,
    onNewReview: handleNewComment,
    onDeleteReview: handleCommentDeleted,
  })

  useEffect(() => {
    joinBookRoom(bookId)
    return () => {
      leaveBookRoom(bookId)
      // console.log('Left book room')
    }
  }, [isConnected, bookId, joinBookRoom, leaveBookRoom])

  return (
    <Container maxWidth="sm" sx={{ py: 1 }}>      
      {/* Header */}
      <Box sx={{ mb: 3, textAlign: 'center' }}>
        <Typography variant="h5" component="h1" gutterBottom>
          Reviews
        </Typography>
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 1 }}>
          <Rating value={averageRating} precision={0.1} readOnly size="medium" />
          <Typography variant="body1" color="text.secondary">
            ({averageRating.toFixed(1)}) • {reviews.length} reviews
          </Typography>
        </Box>
      </Box>

      {/* Review Form */}
      {isAuthenticated && !userReview && (
        <WriteBookReview bookId={bookId} setRefreshReviews={setRefreshReviews} />
      )}

      {/* Reviews List */}
      <Box>
        <Typography variant="subtitle1" gutterBottom sx={{ fontWeight: 600, mb: 2 }}>
          All Reviews ({reviews.length})
        </Typography>
        
        {isLoading ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', py: 3 }}>
            <CircularProgress size={24} />
          </Box>
        ) : reviews.length === 0 ? (
          <Paper sx={{ p: 3, textAlign: 'center', borderRadius: 2 }}>
            <Typography color="text.secondary" variant="body2">
              No reviews yet. Be the first to share your thoughts!
            </Typography>
          </Paper>
        ) : (
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5 }}>
            {reviews.map((review: any) => (
              <Card
                key={review._id}
                elevation={0}
                sx={{ border: '1px solid', borderColor: 'divider', borderRadius: 2 }}
              >
                <CardContent sx={{ p: 2 }}>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 1.5 }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                      <Avatar sx={{ bgcolor: 'primary.main', width: 32, height: 32 }}>
                        <PersonIcon sx={{ fontSize: 18 }} />
                      </Avatar>
                      <Box>
                        <Typography variant="body2" fontWeight="medium">
                          {review.user_id?.name}
                        </Typography>
                        <Typography variant="caption" color="text.secondary">
                          {new Date(review.created_at).toLocaleDateString('en-US', {
                            year: 'numeric',
                            month: 'short',
                            day: 'numeric',
                          })}
                          {review.updated_at !== review.created_at && ' (edited)'}
                        </Typography>
                      </Box>
                    </Box>
                    
                    {isAuthenticated && user?.id === review.user_id?._id && (
                      <Box sx={{ display: 'flex', gap: 0.5 }}>
                        <IconButton
                          size="small"
                          onClick={() => handleDeleteReview(review?._id)}
                          color="error"
                          sx={{ p: 0.5 }}
                        >
                          <DeleteIcon sx={{ fontSize: 18 }} />
                        </IconButton>
                      </Box>
                    )}
                  </Box>
                  
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 1.5 }}>
                    <Rating value={review.rating} readOnly size="small" />
                    <Typography variant="caption" color="text.secondary" sx={{ ml: 1 }}>
                      {review.rating} out of 5
                    </Typography>
                  </Box>
                  
                  <Typography variant="body2" sx={{ lineHeight: 1.5, color: 'text.primary' }}>
                    {review.comment}
                  </Typography>
                </CardContent>
              </Card>
            ))}
          </Box>
        )}
      </Box>      
    </Container>
  )
}

export default BookReview