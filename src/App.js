import React, { Component } from 'react';

import './App.css';
import GreedyMenu from './GreedyMenu';

const appStyle = {
  padding: '10px',
};

const menuStyle = {
  margin: '10px auto',
  width: '1000px',
  maxWidth: '1000px',
  border: '1px dotted blue',
};

class App extends Component {
  render() {
    return (
      <div style={appStyle}>
        <GreedyMenu style={menuStyle}>
          <button className="menu-button btn btn-secondary">Greek Super League</button>
          <button className="menu-button btn btn-secondary">English Premier</button>
          <button className="menu-button btn btn-secondary">Ligue 1</button>
          <button className="menu-button btn btn-secondary">German Basketball League</button>
          <button className="menu-button btn btn-secondary">Maryborough Child 1</button>
          <button className="menu-button btn btn-secondary">English Cup</button>
          <button className="menu-button btn btn-secondary">Maryborough Child 2</button>
          <button className="menu-button btn btn-secondary">Greek Cup</button>
          <button className="menu-button btn btn-secondary">Alexandra Park Child 1</button>
          <button className="menu-button btn btn-secondary">Alexandra Park Child 2</button>
          <button className="menu-button btn btn-secondary">Dapto Child 1</button>
          <button className="menu-button btn btn-secondary">Dapto Child 2</button>
          <button className="menu-button btn btn-secondary">Hobart Child 1</button>
          <button className="menu-button btn btn-secondary">Hobart Child 2</button>
        </GreedyMenu>
      </div>
    );
  }
}

export default App;
