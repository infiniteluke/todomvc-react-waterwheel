import normalizeData from './normalizeData';

export default (username) => {
  return window.waterwheel.jsonapi.get('node/todo', { sort: '-changed'})
  .then(res => Promise.all([
    Promise.resolve(res),
    window.waterwheel.jsonapi.get('node/likes', {}),
    window.waterwheel.jsonapi.get('user/user', {
      filter: {
        condition: {
          path: 'name',
          value: username
        }
      }
    })
  ]))
  .then(res => {
    const todos = res[0].data
    const likes = res[1].data
    const user = res[2].data[0]
    todos.forEach(todo => {
      todo.attributes.likes = likes
        .filter(like => like.relationships.field_todo.data && like.relationships.field_todo.data.id === todo.id)
        .map(like => ({
          id: like.attributes.uuid,
          userId: like.relationships.uid.data.id,
        }))
      todo.attributes.userLiked = todo.attributes.likes.some(like => user.attributes.uuid === like.userId) ? user.attributes.uuid : ''
    })
    window.initialTodos = todos.map(normalizeData)
    window.user = user.attributes;
    delete window.waterwheel.oauth.tokenInformation.password
    localStorage.setItem('tokenExpireTime', window.waterwheel.oauth.tokenExpireTime);
    localStorage.setItem('tokenInformation', JSON.stringify(window.waterwheel.oauth.tokenInformation));
    localStorage.setItem('user', JSON.stringify(user.attributes));
    
  })
}