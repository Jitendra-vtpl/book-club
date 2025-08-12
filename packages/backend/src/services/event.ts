import { EventEmitter } from 'events'

class AppEventEmitter extends EventEmitter {
  constructor() {
    super()
    this.setMaxListeners(1000)
  }
}

export const appEvent = new AppEventEmitter()
export const EVENTS_TYPES = {
  BOOK_REVIEW: {
    NEW_REVIEW: 'NEW_REVIEW',
    UPDATE_REVIEW: 'UPDATE_REVIEW',
    DELETE_REVIEW: 'DELETE_REVIEW',
  },
}

export default appEvent
