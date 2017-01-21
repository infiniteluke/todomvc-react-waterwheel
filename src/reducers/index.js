import { combineReducers } from 'redux'
import todos from './todos'
import message from './message'

const rootReducer = combineReducers({
  todos,
  message
})

export default rootReducer
