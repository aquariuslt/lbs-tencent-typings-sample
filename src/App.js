import './App.css';

import React, { Component } from 'react';
import LocationAutoComplete from './components/LocationAutoComplete';

import logo from './logo.svg';

class App extends Component {
  render() {
    return (
      <div className="App">
        <header className="App-header">
          <img src={logo} className="App-logo" alt="logo"/>
          <h1 className="App-title">Tencent LBS JavaScript API Example</h1>
        </header>

        <div className="App-content">
          <LocationAutoComplete/>
        </div>
      </div>
    );
  }
}

export default App;
