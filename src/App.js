import React from 'react';
import './App.css';
import Messenger from './StudentViews/messenger/Messenger';
import Classes from './StudentViews/classComponents/Classes.js';
import Class from './StudentViews/classComponents/Class.js';
import NewPost from './StudentViews/postComponents/NewPost.js';
import MyPosts from './StudentViews/postComponents/MyPosts.js';
import Applications from './StudentViews/postComponents/Applications.js';
import ProtectedRoute from './authentication/ProtectedRoute';
import SignUp from './authentication/SignUp';
import Login from './authentication/Login';
import NotFound from './UIComponents/NotFound.js';
import BasicModels from './Tools/BasicModels.js';
import ProfessorClasses from './ProfessorViews/ProfessorClasses.js';
import ProfessorClass from './ProfessorViews/ProfessorClass.js';

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
              path={"/professor/(classes)?"}
              requiredUserType={BasicModels.UserTypeProfessor}
              component={ProfessorClass}
            />

            <ProtectedRoute
              exact
              path="/professor/class/:id"
              requiredUserType={BasicModels.UserTypeProfessor}
              component={ProfessorClasses}
            />

            <ProtectedRoute
              exact
              path={"/student/(classes)?"}
              requiredUserType={BasicModels.UserTypeStudent}
              component={Classes}
            />

            <ProtectedRoute
              exact
              path="/student/class/:id"
              requiredUserType={BasicModels.UserTypeStudent}
              component={Class}
            />

            <ProtectedRoute
              exact
              path="/student/post/new/:link"
              requiredUserType={BasicModels.UserTypeStudent}
              component={NewPost}
            />

            <ProtectedRoute
              exact
              path="/student/post/my-posts"
              requiredUserType={BasicModels.UserTypeStudent}
              component={MyPosts}
            />

            <ProtectedRoute
              exact
              path="/student/post/applications"
              requiredUserType={BasicModels.UserTypeStudent}
              component={Applications}
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
              path="/student/messenger"
              requiredUserType={BasicModels.UserTypeStudent}
              component={Messenger}
            />

            <ProtectedRoute
              exact
              path="/student/messenger/user/:username?"
              requiredUserType={BasicModels.UserTypeStudent}
              component={Messenger}
            />

            <ProtectedRoute
              exact
              path="/student/messenger/chatroom/:chatroomId?"
              requiredUserType={BasicModels.UserTypeStudent}
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
