import React, { Component } from 'react';
import PropTypes from 'prop-types';
import Client from 'Client';

import config from 'config/config';
import meditation from 'images/landing.jpeg';
import { Grid, Button, Typography } from '@material-ui/core';
import { Link } from 'react-router-dom';
import './Landing.css';


class Landing extends Component {
  constructor(props) {
    super(props);
    this.classes = props.classes;

    if (props.match.path === '/logout') {
      Client.fetch('/api/auth/signout');
    }
  }

  render() {
    return (
      <Grid container className="page landing-page" direction="column">
        <Grid item xs={4}>
          <img src={meditation} alt="Meditation" />
        </Grid>
        <Grid item xs={4}></Grid>
        <Grid item xs={3}>
          <Typography variant="h5" gutterBottom>
            {`Welcome to ${config.app.title}`}
          </Typography>
          <Typography variant="subtitle1">
            Meditation Score Calculator <br />
          </Typography>
        </Grid>
        <Grid container
              item xs={1}
              bg-primary-blue
              alignItems="center"
              justify="space-around"
        >
          <Button component={Link} to="/signin">
            Sign In
          </Button>
          <Button component={Link} to="/signup">
            Sign Up
          </Button>
        </Grid>
      </Grid>
    );
  }
}

Landing.propTypes = {
  classes: PropTypes.object.isRequired,
  match: PropTypes.object
};


export default Landing;
