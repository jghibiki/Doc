/*
 * Based on https://github.com/mui-org/material-ui/blob/master/docs/src/pages/style/color/ColorTool.js
 *
 */

import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import * as colors from '@material-ui/core/colors';
import Grid from '@material-ui/core/Grid';
import Input from '@material-ui/core/Input';
import Radio from '@material-ui/core/Radio';
import Tooltip from '@material-ui/core/Tooltip';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';
import CheckIcon from '@material-ui/icons/Check';
import Slider from '@material-ui/lab/Slider';
import FormGroup from '@material-ui/core/FormGroup';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Switch from '@material-ui/core/Switch';
import { rgbToHex } from '@material-ui/core/styles/colorManipulator';
import { capitalize } from '@material-ui/core/utils/helpers';

import themeManager from './ThemeManager.js';

const hues = Object.keys(colors).slice(1, 17);
const shades = [900, 800, 700, 600, 500, 400, 300, 200, 100, 50, 'A700', 'A400', 'A200', 'A100'];

const styles = theme => ({
  radio: {
    width: 48,
    height: 48,
  },
  radioSelected: {
    width: 48,
    height: 48,
    border: '1px solid white',
    color: theme.palette.common.white,
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
  },
  swatch: {
    width: 192,
  },
  sliderContainer: {
    display: 'flex',
    alignItems: 'center',
    marginTop: theme.spacing.unit * 2,
    marginBottom: theme.spacing.unit,
  },
  slider: {
    width: 'calc(100% - 80px)',
  },
  colorBar: {
    marginTop: theme.spacing.unit * 2,
  },
  colorSquare: {
    width: 64,
    height: 64,
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
  },
});

class ColorTool extends React.Component {
  state = {
    primary: themeManager.rawTheme.palette.primary.main,
    secondary: themeManager.rawTheme.palette.secondary.main,
    primaryInput: '#2196f3',
    secondaryInput: '#f50057',
    primaryHue: 'blue',
    secondaryHue: 'pink',
    primaryShade: 4,
    secondaryShade: 11,
    darkTheme: false,
  };

  handleChangeColor = name => event => {
    const isRgb = string => /#?([0-9a-f]{6})/i.test(string);

    const {
      target: { value: color },
    } = event;

    this.setState({
      [`${name}Input`]: color,
    });

    if (isRgb(color)) {
      this.setState({
        [name]: color,
      });
    }
  };

  handleChangeHue = name => event => {
    const {
      target: { value: hue },
    } = event;

    this.setState(state => {
      const color = colors[hue][shades[state[`${name}Shade`]]];
      return {
        [`${name}Hue`]: hue,
        [name]: color,
        [`${name}Input`]: color,
      };
    });
  };

  handleChangeShade = name => (event, shade) => {
    this.setState(state => {
      const color = colors[state[`${name}Hue`]][shades[shade]];
      return {
        [`${name}Shade`]: shade,
        [name]: color,
        [`${name}Input`]: color,
      };
    });
  };

  handleChangeDocsColors = () => {
    themeManager.updateTheme({
        palette: {
          primary: { main: this.state.primary }, // Purple and green play nicely together.
          secondary: { main: this.state.secondary }, // This is just green.A700 as hex.
          type: this.state.isDark ? "dark": "light",
        },
    });
  };

  handleChangeDark = () => {
    this.setState({
        isDark: !this.state.isDark
    })
  }

  render() {
    const { classes, theme } = this.props;
    const { primaryShade, secondaryShade } = this.state;

    const colorBar = color => {
      const background = { main: color };
      theme.palette.augmentColor(background);

      return (
        <Grid container className={classes.colorBar}>
          {['dark', 'main', 'light'].map(key => (
            <div
              className={classes.colorSquare}
              style={{ backgroundColor: background[key] }}
              key={key}
            >
              <Typography
                variant="caption"
                style={{ color: theme.palette.getContrastText(background[key]) }}
              >
                {rgbToHex(background[key])}
              </Typography>
            </div>
          ))}
        </Grid>
      );
    };

    const colorPicker = intent => {
      const intentInput = this.state[`${intent}Input`];
      const intentShade = this.state[`${intent}Shade`];
      const color = this.state[`${intent}`];

      return (
        <Grid item xs={12} sm={6} md={4}>
          <Typography gutterBottom variant="title">
            {capitalize(intent)}
          </Typography>
          <Input
            id={intent}
            value={intentInput}
            onChange={this.handleChangeColor(intent)}
            inputProps={{
              'aria-label': `${capitalize(intent)} color`,
            }}
            fullWidth
          />
          <div className={classes.sliderContainer}>
            <Typography id={`${intent}ShadeSliderLabel`}>Shade:</Typography>
            <Slider
              className={classes.slider}
              value={intentShade}
              min={0}
              max={13}
              step={1}
              onChange={this.handleChangeShade(intent)}
              aria-labelledby={`${intent}ShadeSliderLabel`}
            />
            <Typography>{shades[intentShade]}</Typography>
          </div>
          <div className={classes.swatch}>
            {hues.map(hue => {
              const shade = intent === 'primary' ? shades[primaryShade] : shades[secondaryShade];
              const backgroundColor = colors[hue][shade];

              return (
                <Tooltip placement="right" title={hue} key={hue}>
                  <Radio
                    color="default"
                    checked={this.state[intent] === backgroundColor}
                    onChange={this.handleChangeHue(intent)}
                    value={hue}
                    name={intent}
                    aria-labelledby={`tooltip-${intent}-${hue}`}
                    icon={<div className={classes.radio} style={{ backgroundColor }} />}
                    checkedIcon={
                      <div className={classes.radioSelected} style={{ backgroundColor }}>
                        <CheckIcon style={{ fontSize: 30 }} />
                      </div>
                    }
                  />
                </Tooltip>
              );
            })}
          </div>
          {colorBar(color)}
        </Grid>
      );
    };

    return (
        <div>
      <Grid container spacing={40} className={classes.root}>
        {colorPicker('primary')}
        {colorPicker('secondary')}
        <Grid item xs={12} sm={6} md={4}>
        </Grid>
        <Grid item xs={12}>
           <FormControlLabel
              control={
                <Switch
                  checked={this.state.isDark}
                  onChange={this.handleChangeDark}
                  value="isDark"
                  color="primary"
                />
              }
              label="Dark Theme?"
            />   
        </Grid>
        <Grid item xs={12}>
          <Button variant="contained" color="primary" onClick={this.handleChangeDocsColors}>
            Set Docs Colors
          </Button>
        </Grid>
        </Grid>
        </div>
    );
  }
}

ColorTool.propTypes = {
  classes: PropTypes.object.isRequired,
  dispatch: PropTypes.func.isRequired,
  theme: PropTypes.object.isRequired,
};

export default 
  withStyles(styles, { withTheme: true })(ColorTool);
