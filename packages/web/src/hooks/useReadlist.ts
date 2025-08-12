// import { useEffect } from 'react'
import { useAppDispatch, useAppSelector } from '../store'
import { addToReadList, fetchReadList, removeFromReadList } from '../store/slices/readlistSlice'
import { useAuth } from './useAuth'

export const useReadlist = () => {
  const dispatch = useAppDispatch()
  const { bookIds, isLoading, error } = useAppSelector((state: any) => state.readlist)
  const { isAuthenticated } = useAuth() 

  const fetchReadlist = async (fetch: boolean = false) => {
    if (isAuthenticated && !bookIds.length && fetch) {
      await dispatch(fetchReadList())
    }
  }

  const addBookToReadlist = (bookId: string) => {
    dispatch(addToReadList(bookId))
  }

  const removeBookFromReadlist = (bookId: string) => {
    dispatch(removeFromReadList(bookId))
  }

  const isInReadlist = (bookId: string) => {
    return bookIds.includes(bookId)
  }

  return {
    bookIds,
    isLoading,
    error,
    addBookToReadlist,
    removeBookFromReadlist,
    isInReadlist,
    fetchReadlist,
  }
}

export default useReadlist 