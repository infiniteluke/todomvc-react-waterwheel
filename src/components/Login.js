import React from 'react'
import Redirect from 'react-router/Redirect'
import normalizeData from '../lib/normalizeData';

export default class Login extends React.Component {
  state = {
    redirect: false
  }
  
  handleChange = (e) => {
    this.setState({[e.target.name]: e.target.value})
  }

  login = (e) => {
    e.preventDefault();
    const { username, password } = e.target
    Object.assign(window.waterwheel.oauth.tokenInformation, {
      username: username.value,
      password: password.value,
    })
    window.waterwheel.jsonapi.get('node/todo', { sort: '-changed'})
      .then(res => Promise.all([
        Promise.resolve(res),
        window.waterwheel.jsonapi.get('node/likes', {}),
        window.waterwheel.jsonapi.get('user/user', {
          filter: {
            condition: {
              path: 'name',
              value: username.value
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
        window.user = user;
        this.setState({ redirect: true })
      })
      .catch((e) => {
        const message =  e.response ? e.response.data.message : e.message;
        this.setState({ message })
        return Promise.reject(e)
      })
  }

  render() {
    return (
      <div className='login'>
        {this.state.redirect && (
          <Redirect to={'/'}/>
        )}
        {(
          <div>
            <div className='welcomeText'>
              {window.waterwheel.oauth.tokenInformation.access_token ? (
                ''
              ) : (
                <p>Please login with your 4k Waterwheel Training credentials.</p>
              )}
            </div>
            <form onSubmit={this.login}>
              <input type='text' name='username' onChange={this.handleChange} placeholder='username' />
              <input type='password' name='password' onChange={this.handleChange} placeholder='password' />
              <input type='submit' value='Log in' />
              {this.state.message ? <div className='message'><div className='messageText'>{this.state.message}</div></div> : ''}
            </form>
          </div>
        )}
      </div>
    )
  }
}
