import React, { useEffect } from 'react'
import { Button, Box, Typography, Divider } from '@mui/material'
import { useNavigate, useLocation } from 'react-router-dom'
import { useAppDispatch, resetAllSlices } from '../store'
import { logoutUser } from '../store/slices/authSlice'
import { useAuth } from '../hooks/useAuth'
import { useReadlist } from '../hooks/useReadlist'

const Header: React.FC = () => {
  const { fetchReadlist, bookIds } = useReadlist()
  const { isAuthenticated, isLoading } = useAuth()

  const navigate = useNavigate()
  const location = useLocation()
  const dispatch = useAppDispatch()
  
  const isActive = (path: string) => location.pathname === path

  useEffect(() => {
    if (isAuthenticated && !bookIds.length) {
      fetchReadlist(true)
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isAuthenticated, bookIds.length])

  const handleLogout = async () => {
    try {      
      const result = await dispatch(logoutUser())
      if (logoutUser.fulfilled.match(result)) {
        setTimeout(() => {
          dispatch(resetAllSlices())
          // Redirect to home page after successful logout
          navigate('/')
        }, 1000)
      }
    } catch (error) {
      console.error('Logout failed:', error)
    }
  }

  return (
    <Box sx={{ 
      display: 'flex', 
      justifyContent: 'space-between', 
      alignItems: 'center',
      p: 0.5,
      borderBottom: '1px solid #e0e0e0',
      backgroundColor: '#fafafa',
    }}>
      {/* Brand */}
      <Typography 
        variant="h6" 
        component="div" 
        sx={{ 
          fontWeight: 700,
          color: 'primary.main',
          cursor: 'pointer',
        }}
        onClick={() => navigate('/')}
      >
        Book Club
      </Typography>
      
      {/* Navigation Buttons */}
      <Box sx={{ display: 'flex', alignItems: 'center' }}>
        <Button
          variant="text"
          onClick={() => navigate('/books')}
          sx={{ 
            textTransform: 'none',
            color: isActive('/books') ? 'primary.main' : 'text.secondary',
            fontWeight: isActive('/books') ? 600 : 400,
            '&:hover': {
              backgroundColor: 'transparent',
              color: 'primary.main',
            },
          }}
        >
          Books
        </Button>
        
        {isAuthenticated && (
          <Button
            variant="text"
            onClick={() => navigate('/readlist')}
            sx={{ 
              textTransform: 'none',
              color: isActive('/readlist') ? 'primary.main' : 'text.secondary',
              fontWeight: isActive('/readlist') ? 600 : 400,
              '&:hover': {
                backgroundColor: 'transparent',
                color: 'primary.main',
              },
            }}
          >
            Reading List
          </Button>
        )}
        
        {!isAuthenticated ? (
          <>
            <Divider orientation="vertical" flexItem sx={{ mx: 0.5, height: 35 }} />
            <Button
              size="small"
              variant="text"
              onClick={() => navigate('/signup')}
              sx={{ 
                textTransform: 'none',
                color: isActive('/signup') ? 'primary.main' : 'text.secondary',
                fontWeight: isActive('/signup') ? 600 : 400,
                '&:hover': {
                  backgroundColor: 'transparent',
                  color: 'primary.main',
                },
              }}
            >
              Signup
            </Button>
            <Divider orientation="vertical" flexItem sx={{ mx: 0.5, height: 35 }} />
            <Button
              variant="text"
              onClick={() => navigate('/login')}
              sx={{ 
                textTransform: 'none',
                color: isActive('/login') ? 'primary.main' : 'text.secondary',
                fontWeight: isActive('/login') ? 600 : 400,
                '&:hover': {
                  backgroundColor: 'transparent',
                  color: 'primary.main',
                },
              }}
            >
              Login
            </Button>
          </>
        ) : (
          <>
            <Divider orientation="vertical" flexItem sx={{ mx: 0.5, height: 35 }} />
            <Button
              variant="text"
              onClick={handleLogout}
              disabled={isLoading}
              sx={{ 
                textTransform: 'none',
                color: 'text.secondary',
                '&:hover': {
                  backgroundColor: 'transparent',
                  color: 'error.main',
                },
              }}
            >
              Logout
            </Button>
          </>
        )}
      </Box>
    </Box>
  )
}

export default Header 