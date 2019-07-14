// import createHistory from 'history/createBrowserHistory';
import { createBrowserHistory } from 'history';
import * as React from 'react';
import * as ReactDOM from 'react-dom';
import {Provider} from 'react-redux';
import {Router} from 'react-router';
import {applyMiddleware, combineReducers, createStore} from 'redux';
import {reducer as formReducer} from 'redux-form'
import thunk from 'redux-thunk';
import App from './App';
import * as reducers from './ducks';
import './index.css';
import registerServiceWorker from './registerServiceWorker';
import services from './services'

const history = createBrowserHistory()

const store = createStore(combineReducers({
  ...reducers,
  form: formReducer,
}), applyMiddleware(thunk.withExtraArgument(services)))

ReactDOM.render(
  <Provider store={store}>
    <Router history={history}>
      <App history={history} />
    </Router>
  </Provider>,
  document.getElementById('root') as HTMLElement
);
registerServiceWorker();
