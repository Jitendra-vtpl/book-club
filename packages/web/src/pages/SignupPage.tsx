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
import { signupUser } from '../store/slices/authSlice'
import { NavLink, useNavigate } from 'react-router-dom'

const validationSchema = yup.object({
  name: yup.string().trim()
    .min(2, 'Name should be at least 2 characters')
    .required('Name is required'),
  email: yup.string().trim()
    .email('Enter a valid email')
    .required('Email is required'),
  password: yup.string().trim()
    .min(5, 'Password should be at least 5 characters')
    .required('Password is required'),
  confirmPassword: yup.string().trim()
    .oneOf([yup.ref('password')], 'Passwords must match')
    .required('Confirm password is required'),
})

const SignupPage: React.FC = () => {
  const dispatch = useAppDispatch()
  const { isLoading } = useAppSelector((state: any) => state.auth)
  const [isSuccess, setIsSuccess] = useState(false)
  const [errorMessage, setErrorMessage] = useState<string | null>(null)
  const navigate = useNavigate()
  
  const formik = useFormik({
    initialValues: {
      name: '',
      email: '',
      password: '',
      confirmPassword: '',
    },
    validationSchema: validationSchema,
    onSubmit: async values => {
      try {
        const result = await dispatch(signupUser(values))
        
        if (signupUser.rejected.match(result)) {
          handleServerValidationErrors(result.payload)
        } else if (signupUser.fulfilled.match(result)) {
          setIsSuccess(true)
          setTimeout(() => {
            navigate('/login')
          }, 3000)
        }
      } catch (error) {
        console.error('Signup failed:', error)
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
          <Typography component="h1" variant="h5" color="primary.main" gutterBottom>
            <b>Join Book Club</b>
          </Typography>

          {errorMessage && (
            <Alert severity="error" sx={{ width: '100%', mb: 2 }}>
              {errorMessage}
            </Alert>
          )}

          {isSuccess && (
            <Alert severity="success" sx={{ width: '100%', mb: 2 }}>
              Signup successful! Welcome to Gravity Book Club. Redirecting to login page...
            </Alert>
          )}

          <Box component="form" onSubmit={formik.handleSubmit} sx={{ width: '100%' }}>
            <TextField
              fullWidth
              name="name"
              label="Name"
              value={formik.values.name}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              error={formik.touched.name && Boolean(formik.errors.name)}
              helperText={formik.touched.name && formik.errors.name}
              margin="normal"
              autoComplete="name"
              autoFocus
            />

            <TextField
              fullWidth
              name="email"
              label="Email"
              value={formik.values.email}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              error={formik.touched.email && Boolean(formik.errors.email)}
              helperText={formik.touched.email && formik.errors.email}
              margin="normal"
              autoComplete="email"
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
              autoComplete="new-password"
            />

            <TextField
              fullWidth
              name="confirmPassword"
              label="Confirm Password"
              type="password"
              value={formik.values.confirmPassword}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              error={formik.touched.confirmPassword && Boolean(formik.errors.confirmPassword)}
              helperText={formik.touched.confirmPassword && formik.errors.confirmPassword}
              margin="normal"
              autoComplete="new-password"
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
                'Signup'
              )}
            </Button>

            <Box sx={{ textAlign: 'center' }}>
              <Typography variant="body2" color="text.secondary">
                Already have an account?{' '}
                <NavLink to="/login" style={{ textDecoration: 'none' }}>
                  Sign in
                </NavLink>
              </Typography>
            </Box>
          </Box>
        </Paper>
      </Box>
    </Container>
  )
}

export default SignupPage 