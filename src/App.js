import React from 'react';
import './App.css';
import Messenger from './messenger/Messenger';
import Home from './Home';
import ProtectedRoute from './authentication/ProtectedRoute';
import SignUp from './authentication/SignUp';
import Login from './authentication/Login';

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
              component={Home}
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
              component={()=>"404 NOT FOUND"}
            />
          
          </Switch>
        </Router>

      </div>
    );
  }

}

export default App;
