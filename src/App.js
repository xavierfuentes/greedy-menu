import React, { Component } from 'react';

import GreedyMenu from './GreedyMenu';

const pageStyle = {};

const menuStyle = {
  margin: '0 auto',
  width: '1000px',
  maxWidth: '1000px',
};

class App extends Component {
  render() {
    return (
      <div style={pageStyle}>
        <GreedyMenu style={menuStyle}>
          <button className="ftw-group__child">Greek Super League</button>
          <button className="ftw-group__child">English Premier</button>
          <button className="ftw-group__child">Ligue 1</button>
          <button className="ftw-group__child">German Basketball League</button>
          <button className="ftw-group__child">Maryborough Child 1</button>
          <button className="ftw-group__child">English Cup</button>
          <button className="ftw-group__child">Maryborough Child 2</button>
          <button className="ftw-group__child">Greek Cup</button>
          <button className="ftw-group__child">Alexandra Park Child 1</button>
          <button className="ftw-group__child">Alexandra Park Child 2</button>
          <button className="ftw-group__child">Dapto Child 1</button>
          <button className="ftw-group__child">Dapto Child 2</button>
          <button className="ftw-group__child">Hobart Child 1</button>
          <button className="ftw-group__child">Hobart Child 2</button>
        </GreedyMenu>
      </div>
    );
  }
}

export default App;
