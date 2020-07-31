import React, { Component } from 'react';
import { BrowserRouter, Route } from 'react-router-dom'
import NavBar from './components/layout/NavBar'
import Dashboard from './components/Dashboard'
import About from './components/About'
import Recommender from './components/Recommender';


class App extends Component {
  render() {
    return (
      <BrowserRouter>
        <div className="App">
          <NavBar />
          <Route exact path='/' component={Dashboard} />
          <Route path='/about' component={About} />
          <Route path='/recommender' component={Recommender} />  
        </div>
      </BrowserRouter>
    );
  }
}

export default App;
 