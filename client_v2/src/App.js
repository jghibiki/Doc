import React, { Component } from 'react';
import CssBaseline from '@material-ui/core/CssBaseline';
import { BrowserRouter as Router, Route, Link, Prompt } from "react-router-dom";
import TitleBar from './TitleBar.js';
import Content from './Content.js';
import Player from './Player.js';
import Footer from './Footer.js';

class App extends Component {
  render() {
    return (
        <Router>
          <div className="App">
            <CssBaseline />
            <Route exact path="/" component={Client} />
            <Route exact path="/player" component={Player} />
            <Footer />
          </div>
        </Router>
    );
  }
}

const Client = () => {
    return ( 
        <div>
            <TitleBar />
            <Content ws_client={this.ws_client} />
        </div>
    )
}


export default App;
