import React, { Component } from 'react';
import PropTypes from 'prop-types';
import Client from 'Client';

import config from 'config/config';
import { Card, CardContent, Typography } from '@material-ui/core';
import { withStyles } from '@material-ui/core/styles';

const styles = {
  card: {
    minWidth: 275
  },
  bullet: {
    display: 'inline-block',
    margin: '0 2px',
    transform: 'scale(0.8)'
  },
  title: {
    fontSize: 14
  },
  pos: {
    marginBottom: 12
  },
};


class Score extends Component {
  state = {
    score: '',
    quarter: '',
    open: false,
    errorMsg: '',
    disabled: false
  };

  constructor(props) {
    super(props);

    this.classes = props.classes;
  }

  render() {
    return (
      <Card className={this.classes.card}>
        <CardContent>
          <Typography className={this.classes.title} color="textSecondary" gutterBottom>
            Your Meditation Score
          </Typography>
          <Typography variant="h1" component="h2">
            75
          </Typography>
          <Typography className={this.classes.pos} color="textSecondary">
            March 23 - June 22
          </Typography>
          <Typography component="p">
            5 more days until the Summer Solstice
          </Typography>
        </CardContent>
      </Card>
    );
  }
}

Score.propTypes = {
  classes: PropTypes.object.isRequired
};

export default withStyles(styles)(Score);
