import React, { Component } from 'react';
import TitleBar from './TitleBar.js';
import Content from './Content.js';
import Footer from './Footer.js';

class App extends Component {
  render() {
    return (
      <div className="App">
        <TitleBar />
        <Content ws_client={this.ws_client} />
        <Footer />
      </div>
    );
  }
}

export default App;
