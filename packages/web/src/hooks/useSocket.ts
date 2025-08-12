import { useEffect, useRef, useCallback, useState } from 'react'
import { io, Socket } from 'socket.io-client'
import { useAuth } from './useAuth'
import { CONSTANTS } from '../config/constants'

const { API_BASE_URL } = CONSTANTS

interface IUseSocket {
  bookId?: string
  onNewReview?: (review: any) => void
  onUpdateReview?: (review: any) => void
  onDeleteReview?: (review: any) => void
  onError?: (error: any) => void
}

interface ISocketState {
  isConnected: boolean
  error: string | null
}

export const useSocket = ({ 
  bookId,
  onNewReview, 
  onUpdateReview, 
  onDeleteReview,
  onError, 
}: IUseSocket) => {
  const { accessToken } = useAuth()
  const socketRef = useRef<Socket | null>(null)
  const [socketState, setSocketState] = useState<ISocketState>({
    isConnected: false,
    error: null,
  })

  const connect = useCallback(() => {
    if (!accessToken) {
      setSocketState(prev => ({ ...prev, error: 'No access token available' }))
      return null
    }

    if (socketRef.current?.connected) {
      return socketRef.current
    }

    setSocketState(prev => ({ ...prev, error: null }))
    console.log('Connecting to socket...')

    socketRef.current = io(API_BASE_URL, {
      auth: { token: accessToken },
      reconnection: true,
      reconnectionAttempts: 5,
      reconnectionDelay: 1000,
      timeout: 20000,
    })

    // Connection events
    socketRef.current.on('connect', () => {
      console.log('Socket connected successfully')
      setSocketState(prev => ({ 
        ...prev, 
        isConnected: true,
        error: null, 
      }))
    })

    socketRef.current.on('disconnect', reason => {
      console.log('Socket disconnected:', reason)
      setSocketState(prev => ({ ...prev, isConnected: false }))
    })

    socketRef.current.on('connect_error', error => {
      console.error('Socket connection error:', error)
      setSocketState(prev => ({ ...prev, error: error?.message || 'Connection failed' }))
      onError?.(error)
    })

    // Room management events
    // socketRef.current.on('joined-book', data => {
    //   console.log(`Successfully joined book room: ${data.bookId}`, data)
    // })

    // socketRef.current.on('left-book', data => {
    //   console.log(`Left book room: ${data.bookId}`, data)
    // })

    // Review events
    if (onNewReview) {
      socketRef.current.on('NEW_REVIEW', data => {
        // console.log('New review received:', data.data)
        onNewReview(data.data)
      })
    }

    if (onUpdateReview) {
      socketRef.current.on('UPDATE_REVIEW', data => {
        // console.log('Review updated:', data.data)
        onUpdateReview(data.data)
      })
    }

    if (onDeleteReview) {
      socketRef.current.on('DELETE_REVIEW', data => {
        // console.log('Review deleted:', data.data)
        onDeleteReview(data.data)
      })
    }

    // Error handling
    socketRef.current.on('error', error => {
      console.error('Socket error:', error)
      setSocketState(prev => ({ ...prev, error: error.message || 'Socket error' }))
      onError?.(error)
    })

    return socketRef.current
  }, [accessToken, onNewReview, onUpdateReview, onDeleteReview, onError])

  const disconnect = useCallback(() => {
    if (socketRef.current) {
      socketRef.current.disconnect()
      socketRef.current = null
      setSocketState(prev => ({ ...prev, isConnected: false }))
    }
  }, [])

  const reconnect = useCallback(() => {
    disconnect()
    setTimeout(() => {
      connect()
    }, 1000)
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [disconnect])

  const joinBookRoom = useCallback((bookId: string) => {
    if (socketRef.current?.connected && bookId) {
      socketRef.current.emit('join-book', bookId)
      // console.log(`Joining book room: ${bookId}`)
    }
  }, [])

  const leaveBookRoom = useCallback((bookId: string) => {
    if (socketRef.current?.connected && bookId) {
      socketRef.current.emit('leave-book', bookId)
      // console.log(`Leaving book room: ${bookId}`)
    }
  }, [])

  // Auto-join book room when bookId changes
  useEffect(() => {
    if (bookId && socketRef.current?.connected) {
      joinBookRoom(bookId)
    }
  }, [bookId, joinBookRoom])

  // Auto-leave book room when bookId changes or component unmounts
  useEffect(() => {
    return () => {
      if (bookId && socketRef.current?.connected) {
        leaveBookRoom(bookId)
      }
    }
  }, [bookId, leaveBookRoom])

  // Main connection effect
  useEffect(() => {
    const socket = connect()
    
    return () => {
      if (socket) {
        socket.disconnect()
      }
    }
  }, [connect])

  return {
    // instance
    socket: socketRef.current,
    
    // state
    isConnected: socketState.isConnected,
    error: socketState.error,
    
    // Actions
    connect,
    disconnect,
    reconnect,
    joinBookRoom,
    leaveBookRoom,    
  }
}
