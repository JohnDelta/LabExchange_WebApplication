import React from 'react';
import './App.css';
import Messenger from './StudentViews/messenger/Messenger';
import Classes from './StudentViews/classComponents/Classes';
import Class from './StudentViews/classComponents/Class';
import NewPost from './StudentViews/postComponents/NewPost';
import MyPosts from './StudentViews/postComponents/MyPosts';
import Applications from './StudentViews/postComponents/Applications';
import ProtectedRoute from './authentication/ProtectedRoute';
import Login from './authentication/Login';
import NotFound from './UIComponents/NotFound';
import BasicModels from './Tools/BasicModels';
import ProfessorClasses from './ProfessorViews/ProfessorClasses';
import ProfessorClass from './ProfessorViews/ProfessorClass';
import ProfessorLab from './ProfessorViews/ProfessorLab';

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
              requiredUserType={BasicModels.UserTypeProfessor()}
              component={ProfessorClass}
            />

            <ProtectedRoute
              exact
              path="/professor/class/:id"
              requiredUserType={BasicModels.UserTypeProfessor()}
              component={ProfessorClasses}
            />

            <ProtectedRoute
              exact
              path="/professor/lab/:link"
              requiredUserType={BasicModels.UserTypeProfessor()}
              component={ProfessorLab}
            />

            <ProtectedRoute
              exact
              path={"/student/(classes)?"}
              requiredUserType={BasicModels.UserTypeStudent()}
              component={Classes}
            />

            <ProtectedRoute
              exact
              path="/student/class/:id"
              requiredUserType={BasicModels.UserTypeStudent()}
              component={Class}
            />

            <ProtectedRoute
              exact
              path="/student/post/new/:link"
              requiredUserType={BasicModels.UserTypeStudent()}
              component={NewPost}
            />

            <ProtectedRoute
              exact
              path="/student/post/my-posts"
              requiredUserType={BasicModels.UserTypeStudent()}
              component={MyPosts}
            />

            <ProtectedRoute
              exact
              path="/student/post/applications"
              requiredUserType={BasicModels.UserTypeStudent()}
              component={Applications}
            />

            <Route 
              exact 
              path="/login" 
              component={Login} 
            />
          
            <ProtectedRoute
              exact
              path="/student/messenger"
              requiredUserType={BasicModels.UserTypeStudent()}
              component={Messenger}
            />

            <ProtectedRoute
              exact
              path="/student/messenger/user/:username?"
              requiredUserType={BasicModels.UserTypeStudent()}
              component={Messenger}
            />

            <ProtectedRoute
              exact
              path="/student/messenger/chatroom/:chatroomId?"
              requiredUserType={BasicModels.UserTypeStudent()}
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
