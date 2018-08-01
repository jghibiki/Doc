import React from 'react';

import { MuiThemeProvider, createMuiTheme } from '@material-ui/core/styles';
import green from '@material-ui/core/colors/green';


class ThemeManager {

    constructor(){
        this.loadTheme();

        this.buildTheme();
        console.log(this.theme)
        this.updateCallback = ()=>{}
    }

    buildTheme(){
        this.theme = createMuiTheme(this.rawTheme)
    }

    updateTheme(newTheme){
        this.rawTheme = newTheme;
        this.saveTheme();
        this.buildTheme();
        this.updateCallback();
    }

    getTheme(){
        return this.theme;
    }

    setUpdateCallback(updateCallback){
        this.updateCallback = updateCallback;
    }

    loadTheme(){
        var serializedTheme = localStorage.getItem("theme")

        if (serializedTheme === null){
            serializedTheme = {
                palette: {
                  primary: { main: green[500] }, 
                  secondary: { main: '#11cb5f' }, // This is just green.A700 as hex.
                  type: "light",
                },
            }
        }
        else {
            serializedTheme = JSON.parse(serializedTheme);
        }

        this.rawTheme = serializedTheme;
        this.saveTheme();
    }

    saveTheme(){

        var serializedTheme = JSON.stringify(this.rawTheme);
        localStorage.setItem("theme", serializedTheme);

    }
}

const themeManager = new ThemeManager()

export default themeManager
