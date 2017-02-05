import * as types from '../constants/ActionTypes'
import normalizeData from '../lib/normalizeData';
import { MSG_TIMEOUT } from '../constants/Misc'
import Promise from 'bluebird';
import { showMessages } from '../config'

let timeout;
export const showMessage = (text, type, dispatch) => {
  if (showMessages) {
    if (timeout) {
      clearTimeout(timeout);
    }
    dispatch({
      type: types.SHOW_MESSAGE,
      message: { text, type },
    })
    timeout = setTimeout(() => dispatch({type: types.HIDE_MESSAGE}), MSG_TIMEOUT);
  }
}

export const handleError = (e, action, dispatch) => {
  showMessage(
    `You do not have access to ${action} this todo.`,
    'error',
    dispatch
  )
  return Promise.reject(e)
}

export const addTodo = text => (dispatch, getState) => {
  return window.waterwheel.jsonapi.post('node/todo', {
    data: { 'attributes': { 'title': text } }
  })
  .then(res => {
    dispatch({ type: types.ADD_TODO, todo: normalizeData(res.data) });
    showMessage('Todo saved succesfully.', 'success', dispatch);
  })
  .catch(e => handleError(e, 'add', dispatch))
}

export const deleteTodo = id => (dispatch, getState) => {
  return window.waterwheel.jsonapi.delete('node/todo', id)
  .then(res => {
    dispatch ({ type: types.DELETE_TODO, id });
    showMessage('Todo deleted succesfully.', 'success', dispatch);
  })
  .catch(e => handleError(e, 'delete', dispatch))
}

export const editTodo = (id, text) => (dispatch, getState) => {
  return window.waterwheel.jsonapi.patch(`node/todo/${id}`, {
    data: {
      id,
      'attributes': { 'title': text },    
    }
  })
  .then(res => {
    const { id, text } = normalizeData(res.data);
    dispatch({ type: types.EDIT_TODO, id, text });
    showMessage('Todo edited succesfully.', 'success', dispatch);
  })
  .catch(e => handleError(e, 'edit', dispatch))
}

export const completeTodo = (id, text) => (dispatch, getState) => {
  const completeToggle = getState().todos.filter((todo) => todo.id === id)[0].completed
  return window.waterwheel.jsonapi.patch(`node/todo/${id}`, {
    data: {
      id,
      'attributes': { 'field_completed': Number(!completeToggle) },    
    }
  })
  .then(res => {
    dispatch({ type: types.COMPLETE_TODO, id })
    showMessage('Todo marked completed succesfully.', 'success', dispatch);
  })
  .catch(e => handleError(e, 'complete', dispatch))
}

export const completeAll = () => (dispatch, getState) => {
  const areAllComplete = getState().todos.every(todo => todo.completed)
  const todos = getState().todos.filter(todo => areAllComplete || !todo.completed)

  return Promise.map(todos, ({id, completed}) => (
      window.waterwheel.jsonapi.patch(`node/todo/${id}`, {
        data: {
          id,
          'attributes': { 'field_completed': Number(!completed) },
        }
      })
    ), { concurrency: 2 })
  .then(res => {
    dispatch({ type: types.COMPLETE_ALL })
    showMessage('All todos marked completed succesfully.', 'success', dispatch);
  })
  .catch(e => handleError(e, 'complete', dispatch))
}

export const clearCompleted = () => (dispatch, getState) => {
  const todos = getState().todos.filter(todo => todo.completed)

  return Promise.map(todos, ({id}) => (
      window.waterwheel.jsonapi.delete(`node/todo`, id)
    ), { concurrency: 2 })
  .then(res => {
    dispatch({ type: types.CLEAR_COMPLETED })
    showMessage('All completed todos deleted succesfully.', 'success', dispatch);
  })
  .catch(e => handleError(e, 'delete', dispatch))
}

export const likeTodo = (id) => (dispatch, getState) => {
  const todo = getState().todos.filter(todo => todo.id === id)[0]
  const like = todo.likes.find(like => like.userId === todo.userLiked)
  if (!todo.userLiked) {
    return window.waterwheel.jsonapi.post('node/likes', {
      data: {
        'attributes': { 'title': `Like for ${todo.id}` },
        'relationships': { 'field_todo': { data: { id, type: 'node--todo' } } }
      }
    })
    .then(res => {
      dispatch({ type: types.LIKE_TODO, todoId: todo.id, id: res.data.id, userLiked: res.data.relationships.uid.data.id });
      showMessage('Todo liked succesfully', 'success', dispatch);
    })
    .catch(e => handleError(e, dispatch))
  } else {
    return window.waterwheel.jsonapi.delete('node/likes', like.id)
    .then(res => {
      dispatch({ type: types.UNLIKE_TODO, todoId: id, id: like.id });
      showMessage('Todo like removed succesfully.', 'success', dispatch);
    })
    .catch(e => handleError(e, 'like', dispatch))
  }
}
