import { createBrowserHistory }  from 'history'
import {identity} from 'lodash'
import * as React from 'react';
import * as ReactDOM from 'react-dom';
import App from './App';

// import createHistory from 'history/createBrowserHistory'

// Sale este warning al usar import createHistory from 'history/createBrowserHistory
// Warning: Please use `require("history").createBrowserHistory` instead of 
// `require("history/createBrowserHistory")`. Support for the latter will be removed 
// in the next major release.
// Reemplazar 
// createHistory -> createBrowserHistory
// history/createBrowserHistory -> history
// reemplazar estas lineas:
// import createHistory from 'history/createBrowserHistory
// const history = createHistory()
// Por:
// import createBrowserHistory from 'history'
// const history = createBrowserHistory()



const history = createBrowserHistory()

// const history = createHistory()
it('renders without crashing', () => {
  const div = document.createElement('div');
  // no esta permitida lambda por eso  se usa identity de lodash.
  // identity recibe un argumento  y retorna este mismo argumento
  ReactDOM.render(<App loadInitialData = {identity}history={history} />, div);
  ReactDOM.unmountComponentAtNode(div);
});
