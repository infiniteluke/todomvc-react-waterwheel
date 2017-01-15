import { createStore, applyMiddleware } from 'redux'
import thunk from 'redux-thunk';
import reducer from '../reducers'

export default () => {
  return createStore(reducer, { todos: window.initialTodos }, applyMiddleware(thunk));
};