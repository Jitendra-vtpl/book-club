import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import { booksAPI } from '../../services/api'

// List books
export const fetchBooks = createAsyncThunk(
  'books/fetchBooks',
  async (params: { page?: number; limit?: number; search?: string } = {}, { rejectWithValue }) => {
    try {
      const response = await booksAPI.getAll(params)
      return response.data
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message || error.message || 'Failed to fetch books',
      )
    }
  },
)

// Get book by slug
export const fetchBook = createAsyncThunk(
  'books/fetchBook',
  async (slug: string, { rejectWithValue }) => {
    try {
      const response = await booksAPI.getBySlug(slug)
      return response.data
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message || error.message || 'Failed to fetch book',
      )
    }
  },
)

const bookSlice = createSlice({
  name: 'books',
  initialState: {
    books: [],
    currentBook: null,
    isLoading: false,
    error: null,
  },
  reducers: {
    clearError: state => {
      state.error = null
    },
    clearCurrentBook: state => {
      state.currentBook = null
    },
    resetState: state => {
      state.books = []
      state.currentBook = null
      state.isLoading = false
      state.error = null
    },
  },
  extraReducers: builder => {
    builder
      // Fetch Books
      .addCase(fetchBooks.pending, state => {
        state.isLoading = true
        state.error = null
      })
      .addCase(fetchBooks.fulfilled, (state, action: any) => {
        state.isLoading = false
        state.books = action.payload.books || action.payload
        state.error = null
      })
      .addCase(fetchBooks.rejected, (state, action: any) => {
        state.isLoading = false
        state.error = action.payload
      })
      // Fetch Single Book
      .addCase(fetchBook.pending, state => {
        state.isLoading = true
        state.error = null
      })
      .addCase(fetchBook.fulfilled, (state, action: any) => {
        state.isLoading = false
        state.currentBook = action.payload
        state.error = null
      })
      .addCase(fetchBook.rejected, (state, action: any) => {
        state.isLoading = false
        state.error = action.payload
      })
  },
})

export const { clearError, clearCurrentBook, resetState } = bookSlice.actions
export default bookSlice.reducer 