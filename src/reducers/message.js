import { SHOW_MESSAGE, HIDE_MESSAGE } from '../constants/ActionTypes'

export default function todos(state = {}, action) {
  switch (action.type) {
    case SHOW_MESSAGE:
      return { ...state, type: action.message.type, text: action.message.text, showMessage: true }
    case HIDE_MESSAGE:
      return { ...state, showMessage: false }
    default:
      return state
  }
}