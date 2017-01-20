import React from 'react'
import { Provider } from 'react-redux'
import '../node_modules/waterwheel/dist/waterwheel'
import createStore from './lib/createStore'
import getInitialData from './lib/getInitialData';
import getParamFromHash from './lib/getParamFromHash';
import App from './containers/App'
import config from './config'
import './Main.css';

const { apiURL, client_id } = config;

window.waterwheel = new window.Waterwheel({
  base: apiURL,
  oauth: {
   grant_type: 'password',
   client_id: client_id,
  }
})

export const TodoApp = () => (
  <Provider store={createStore()}>
    <App />
  </Provider>
)

export class Main extends React.Component {
  state = {
    loading: true
  }

  componentDidMount() {
    window.waterwheel.oauth.tokenInformation.access_token = getParamFromHash(window.location.hash, 'access_token')
    const expires_in = getParamFromHash(window.location.hash, 'expires_in')
    let t = new Date();
    t.setSeconds(+t.getSeconds() + expires_in);
    window.waterwheel.oauth.tokenExpireTime = t.getTime();
    if (window.waterwheel.oauth.tokenInformation.access_token) {
      const uid = JSON.parse(atob(window.waterwheel.oauth.tokenInformation.access_token.split('.')[1])).sub;
      getInitialData(uid)
        .then(() => {
          this.setState({loading: false})
        })
        .catch(e => {
          if (e.status === 403) {
            window.location = `${config.apiURL}/oauth/authorize?response_type=token&client_id=${client_id}`            
          }
        })
    } else {
      window.location = `${config.apiURL}/oauth/authorize?response_type=token&client_id=${client_id}`
    }
  }

  render() {
    return (
      this.state.loading ?
        <div className="loader">Loading...</div> :
        <TodoApp />
    )
  }
}

export default Main
