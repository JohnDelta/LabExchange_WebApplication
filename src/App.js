import React from 'react';
import './App.css';
import Messenger from './messenger/Messenger';
import Posts from './PostComponents/Posts.js';
import ProtectedRoute from './authentication/ProtectedRoute';
import SignUp from './authentication/SignUp';
import Login from './authentication/Login';
import NotFound from './UIComponents/NotFound.js';

import {
  BrowserRouter as Router,
  Switch,
  Route
} from "react-router-dom";

class App extends React.Component {

  constructor() {
    super();
  }

  render() {

    return (
      <div className="App">
        
        <Router>
          <Switch>

            <ProtectedRoute
              exact
              path="/"
              component={Posts}
            />

            <Route 
              exact 
              path="/login" 
              component={Login} 
            />

            <Route 
              exact 
              path="/signup" 
              component={SignUp} 
            />
          
            <ProtectedRoute
              exact
              path="/messenger"
              component={Messenger}
            />

            <Route 
              path="*"
              component={NotFound}
            />
          
          </Switch>
        </Router>

      </div>
    );
  }

}

export default App;
