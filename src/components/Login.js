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
    // Get all todo's here and user object here
    window.waterwheel.jsonapi.get('node/todo', { sort: '-changed'})
      .then(res => {
        const todos = Array.isArray(res.data) ? res.data : Array(res.data)
        window.initialTodos = todos.map(normalizeData)
        this.setState({ redirect: true })
      })
      .catch((e) => {
        const message =  e.response ? e.response.data.message : e.message;
        this.setState({ message })
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
