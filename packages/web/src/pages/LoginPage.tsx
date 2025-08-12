import React, { useState } from 'react'
import { useFormik } from 'formik'
import * as yup from 'yup'
import {
  Box,
  Button,
  TextField,
  Typography,
  Container,
  Paper,
  Alert,
  CircularProgress,
} from '@mui/material'
import { useAppDispatch, useAppSelector } from '../store'
import { loginUser } from '../store/slices/authSlice'
import { NavLink, useNavigate } from 'react-router-dom'
// import { fetchReadList } from '../store/slices/readlistSlice'

const validationSchema = yup.object({
  email: yup
    .string()
    .email('Enter a valid email')
    .required('Email is required'),
  password: yup
    .string()
    .min(5, 'Password should be of atleast 5 characters length')
    .required('Password is required'),
})

const LoginPage: React.FC = () => {
  const dispatch = useAppDispatch()
  const { isLoading } = useAppSelector((state: any) => state.auth)
  const [isSuccess, setIsSuccess] = useState(false)
  const [errorMessage, setErrorMessage] = useState<string | null>(null)
  const navigate = useNavigate()

  const formik = useFormik({
    initialValues: {
      email: '',
      password: '',
    },
    validationSchema: validationSchema,
    onSubmit: async values => {
      try {
        setErrorMessage(null)
        const result = await dispatch(loginUser(values))
        if (loginUser.rejected.match(result)) {
          handleServerValidationErrors(result.payload)
        } else if (loginUser.fulfilled.match(result)) {
          setIsSuccess(true)          
          // redirect to books page after successful login
          setTimeout(() => {
            // dispatch(fetchReadList())
            navigate('/books')
          }, 2000)
        }
      } catch (error) {
        console.error('Login failed:', error)
      }
    },
  })

  // Handle server validation errors
  const handleServerValidationErrors = (error: any) => {
    if (error) {
      setErrorMessage(error?.message || error )
    }
    if (error?.details && Array.isArray(error.details)) {
      formik.setErrors({})    
      error.details.forEach((detail: any) => {
        if (detail.path && detail.message) {
          let fieldName = detail.path        
          if (fieldName.includes('.')) {
            fieldName = fieldName.split('.').pop() || fieldName
          }
          formik.setFieldError(fieldName, detail.message)
        }
      })
    } else if (!error) {
      formik.setErrors({})
    }
  }

  return (
    <Container component="main" maxWidth="sm" sx={{ px: { xs: 2, sm: 3, md: 4 } }}>
      <Box
        sx={{
          marginTop: 5,
          mx: 3,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
        }}
      >
        <Paper
          elevation={3}
          sx={{
            padding: { xs: 3, sm: 4, md: 5 },
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            width: '100%',
            maxWidth: 450,
          }}
        >
          <Typography component="h1" variant="h6" color="primary.main" gutterBottom>
            <b>Login</b>
          </Typography>

          {errorMessage && (
            <Alert severity="error" sx={{ width: '100%', mb: 2 }}>
              {errorMessage}
            </Alert>
          )}       

          {isSuccess && (
            <Alert severity="success" sx={{ width: '100%', mb: 2 }}>
              Login successful! Redirecting to books page...
            </Alert>
          )}

          <Box component="form" onSubmit={formik.handleSubmit} sx={{ width: '100%' }}>
            <TextField
              fullWidth
              name="email"
              label="Email Address"
              value={formik.values.email}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              error={formik.touched.email && Boolean(formik.errors.email)}
              helperText={formik.touched.email && formik.errors.email}
              margin="normal"
              autoComplete="email"
              autoFocus
            />

            <TextField
              fullWidth
              name="password"
              label="Password"
              type="password"
              value={formik.values.password}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              error={formik.touched.password && Boolean(formik.errors.password)}
              helperText={formik.touched.password && formik.errors.password}
              margin="normal"
            />

            <Button
              type="submit"
              fullWidth
              variant="contained"
              sx={{ mt: 3, mb: 2, height: 48 }}
              disabled={isLoading || isSuccess}
            >
              {isLoading ? (
                <CircularProgress size={24} color="inherit" />
              ) : (
                'Login'
              )}
            </Button>

            <Box sx={{ textAlign: 'center' }}>
              <Typography variant="body2" color="text.secondary">
                Don't have an account?{' '}
                <NavLink to="/signup" style={{ textDecoration: 'none' }}>
                  Sign up
                </NavLink>
              </Typography>
            </Box>
          </Box>
        </Paper>
      </Box>
    </Container>
  )
}

export default LoginPage 