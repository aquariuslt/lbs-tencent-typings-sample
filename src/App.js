import './App.css';

import React, { Component } from 'react';
import LocationAutoComplete from './components/LocationAutoComplete';

import logo from './logo.svg';
import LocationUISelector from './components/LocationUISelector';

class App extends Component {

  state = {
    selectedLocation: {}
  };

  onLocationChange = (newLocation) => {
    let $this = this;
    console.log('new location:', newLocation);
    $this.setState({
      selectedLocation: newLocation
    });
  };

  render() {
    let $this = this;
    return (
      <div className="App">
        <header className="App-header">
          <img src={logo} className="App-logo" alt="logo"/>
          <h1 className="App-title">Tencent LBS JavaScript API Example</h1>
        </header>

        <div className="App-content">
          <div>
            <LocationAutoComplete
              onChange={$this.onLocationChange}
            />
            <LocationUISelector
              {...$this.state.selectedLocation}
            />
          </div>
        </div>
      </div>
    );
  }
}

export default App;
