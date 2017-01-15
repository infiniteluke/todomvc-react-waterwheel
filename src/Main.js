import React from 'react'
import { Provider } from 'react-redux'
import '../node_modules/waterwheel/dist/waterwheel'
import createStore from './lib/createStore'
import App from './containers/App'
import Login from './components/Login'
import Redirect from 'react-router/Redirect'
import Match from 'react-router/Match'
import Router from 'react-router/BrowserRouter'
import config from './config'
import './Main.css';

const { apiURL, client_id, client_secret } = config;

window.waterwheel = new window.Waterwheel({
  base: apiURL,
  oauth: {
   grant_type: 'password',
   client_id: client_id,
   client_secret: client_secret,
  }
})

export const MatchWhenAuthorized = ({ component: Component, ...rest }) => (
  <Match {...rest} render={props => (
    window.waterwheel.oauth.tokenInformation.access_token ? (
      <Component {...props}/>
    ) : (
      <Redirect to={{ pathname: '/login' }}/>
    )
  )}/>
)

export const TodoApp = () => (
  <Provider store={createStore()}>
    <App />
  </Provider>
)

const Main = () => (
  <Router>
    {({ router }) => (
      <div>
        <MatchWhenAuthorized pattern="/" component={TodoApp}/>
        <Match pattern="/login" component={Login}/>
      </div>
    )}
  </Router>
)

export default Main
