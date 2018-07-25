import React, { Component } from 'react';
import CssBaseline from '@material-ui/core/CssBaseline';
import TitleBar from './TitleBar.js';
import Content from './Content.js';
import Footer from './Footer.js';

class App extends Component {
  render() {
    return (
      <div className="App">
       <CssBaseline />
        <TitleBar />
        <Content ws_client={this.ws_client} />
        <Footer />
      </div>
    );
  }
}

export default App;
