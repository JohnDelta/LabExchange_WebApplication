import React from 'react';
import './App.css';
import Messenger from './Messenger.js';

// import {
//   BrowserRouter as Router,
//   Switch,
//   Route
// } from "react-router-dom";

class App extends React.Component {

  constructor() {
    super();
  }

  render() {
    return (
      <div className="App">
        
        <Messenger />

      </div>
    );
  }

}

export default App;
