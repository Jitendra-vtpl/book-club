import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import { readlistAPI } from '../../services/api'

// Fetch reading list
export const fetchReadList = createAsyncThunk(
  'readlist/fetchReadList',
  async (_, { rejectWithValue }) => {
    try {
      const response = await readlistAPI.getReadList()
      return response.data
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message || error.message || 'Failed to fetch readlist',
      )
    }
  },
)

// Add book to reading list
export const addToReadList = createAsyncThunk(
  'readlist/addToReadList',
  async (bookId: string, { rejectWithValue }) => {
    try {
      const response = await readlistAPI.addToReadList(bookId)
      return response.data
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message || error.message || 'Failed to add book to readlist',
      )
    }
  },
)

// Remove book from reading list
export const removeFromReadList = createAsyncThunk(
  'readlist/removeFromReadList',
  async (bookId: string, { rejectWithValue }) => {
    try {
      const response = await readlistAPI.removeFromReadList(bookId)
      return response.data
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message || error.message || 'Failed to remove book from readlist',
      )
    }
  },
)

const readlistSlice = createSlice({
  name: 'readlist',
  initialState: {
    bookIds: [] as string[] | [],
    isLoading: false as boolean,
    error: null as string | null,
  },
  reducers: {
    clearError: state => {
      state.error = null
    },
    clearReadList: state => {
      state.bookIds = []
    },
    resetState: state => {
      state.bookIds = []
      state.isLoading = false
      state.error = null
    },
  },
  extraReducers: builder => {
    builder
      // Fetch Readlist
      .addCase(fetchReadList.pending, state => {
        state.isLoading = true
        state.error = null
      })
      .addCase(fetchReadList.fulfilled, (state, action: any) => {
        state.isLoading = false
        state.bookIds = action.payload?.data || []
        state.error = null
      })
      .addCase(fetchReadList.rejected, (state, action: any) => {
        state.isLoading = false
        state.error = action.payload
      })
      // Add to Readlist
      .addCase(addToReadList.fulfilled, (state, action: any) => {
        // Update the readlist with the new book ID
        state.bookIds = action.payload?.data || []
      })
      // Remove from Readlist
      .addCase(removeFromReadList.fulfilled, (state, action: any) => {
        // Update the readlist after removing the book
        state.bookIds = action.payload?.data || []
      })
  },
})

export const { clearError, clearReadList, resetState } = readlistSlice.actions
export default readlistSlice.reducer