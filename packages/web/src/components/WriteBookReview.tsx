import {
  Box,
  Typography,
  Paper,
  TextField,
  Button,
  Rating,
  Alert,
} from '@mui/material'
import { useFormik } from 'formik'
import * as yup from 'yup'
import { Star as StarIcon } from '@mui/icons-material'
import { reviewsAPI } from '../services/api'
import { useState } from 'react'

const WriteBookReview: React.FC<{
  bookId: string, setRefreshReviews: (date: Date) => void
}> = ({ bookId, setRefreshReviews }) => {
  const [isLoading, setIsLoading] = useState(false)
  const [isSuccess, setIsSuccess] = useState(false)
  const [errorMessage, setErrorMessage] = useState('')
  
  const formik = useFormik({
    initialValues: {
      rating: 0,
      comment: '',
    },
    validationSchema: yup.object({
      rating: yup.number()
        .min(1, 'Rating is required')
        .max(5, 'Rating must be between 1 and 5')
        .required('Rating is required'),
      comment: yup.string().trim()
        .min(10, 'Comment must be at least 10 characters')
        .max(500, 'Comment must not exceed 500 characters')
        .required('Comment is required'),
    }),
    onSubmit: async (values: any) => {
      try {
        setIsLoading(true)
        await reviewsAPI.addReview(bookId, values)
        // console.log('response', response)
        setIsLoading(false)
        setIsSuccess(true)
        // setTimeout(() => {
        //   setRefreshReviews(new Date())
        // }, 1000)
      } catch (error: any) {
        setIsLoading(false)
        setErrorMessage(error?.response?.data?.message || 'Failed to submit review')
        console.error('Error adding review', error)
      }
    },
  })

  return (
    <Paper elevation={1} sx={{ p: 2.5, mb: 2, borderRadius: 2 }}>
      <Typography variant="subtitle1" gutterBottom sx={{ fontWeight: 600 }}>
        Write a Review
      </Typography>
      
      <Box component="form" onSubmit={formik.handleSubmit}>
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2.5 }}>
          <Box>
            <Rating
              name="rating"
              value={formik.values.rating}
              onChange={(_, value) => formik.setFieldValue('rating', value || 0)}
              size="medium"
              icon={<StarIcon sx={{ fontSize: 32 }} />}
              emptyIcon={<StarIcon sx={{ fontSize: 32, color: 'grey.300' }} />}
            />
            {formik.touched.rating && formik.errors.rating && (
              <Typography color="error" variant="caption" sx={{ mt: 1, display: 'block' }}>
                {formik.errors.rating as string}
              </Typography>
            )}
          </Box>
          
          <TextField
            fullWidth
            multiline
            rows={3}
            name="comment"
            label="Your Review"                
            value={formik.values.comment}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            error={formik.touched.comment && Boolean(formik.errors.comment)}
            helperText={formik.touched.comment && formik.errors.comment as string}
            inputProps={{ maxLength: 500 }}
            size="small"
          />
          
          {isSuccess &&
            <Alert severity="success">
              Your review successfully submitted!
            </Alert>
          }
          {errorMessage && (
            <Alert severity="error" sx={{ width: '100%', mb: 2 }}>
              {errorMessage}
            </Alert>
          )}
          <Box sx={{ display: 'flex', gap: 1.5, justifyContent: 'flex-end' }}>
            <Button
              type="submit"
              variant="contained"
              disabled={formik.isSubmitting || isLoading || isSuccess}
              size="small"
            >
              { isSuccess ? 'Review Submitted' :
                (formik.isSubmitting || isLoading) ? 'Submitting...'
                  : 'Submit Review'
              }
            </Button>
          </Box>
        </Box>
      </Box>
    </Paper>
  )
}

export default WriteBookReview