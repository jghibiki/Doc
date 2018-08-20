import React, { Component } from 'react';
import CssBaseline from '@material-ui/core/CssBaseline';
import { BrowserRouter as Router, Route, Link, Prompt } from "react-router-dom";

import { MuiThemeProvider, createMuiTheme } from '@material-ui/core/styles';
import purple from '@material-ui/core/colors/purple';

import TitleBar from './TitleBar.js';
import Content from './Content.js';
import Player from './Player.js';
import Footer from './Footer.js';
import themeManager from './ThemeManager.js';


class App extends Component {

  constructor(props){
    super(props);

    themeManager.setUpdateCallback(()=>{this.forceUpdate()})

  }


  render() {
    var theme = themeManager.theme
    return (
        <Router>
          <div className="App">
            <MuiThemeProvider theme={theme}>
            <CssBaseline />
            <Route exact path="/" component={Client} />
            <Route exact path="/player" component={Player} />
            <Footer />
            </MuiThemeProvider>
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
