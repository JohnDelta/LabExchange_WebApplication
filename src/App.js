import React from 'react';
import './App.css';
import Messenger from './messenger/Messenger';
import Labs from './LabComponents/Labs.js';
import Lab from './LabComponents/Lab.js';
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
              path={"/(labs)?"}
              component={Labs}
            />

            <ProtectedRoute
              exact
              path="/lab/:id"
              component={Lab}
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
