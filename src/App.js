import React from 'react';
import './App.css';
import Messenger from './messenger/Messenger';
import Classes from './classComponents/Classes.js';
import Class from './classComponents/Class.js';
import NewPost from './postComponents/NewPost.js';
import MyPosts from './postComponents/MyPosts.js';
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
              path={"/(classes)?"}
              component={Classes}
            />

            <ProtectedRoute
              exact
              path="/class/:id"
              component={Class}
            />

            <ProtectedRoute
              exact
              path="/post/new/:link"
              component={NewPost}
            />

            <ProtectedRoute
              exact
              path="/post/my-posts"
              component={MyPosts}
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
