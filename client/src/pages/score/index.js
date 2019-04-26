import React, { Component } from 'react';
import PropTypes from 'prop-types';
import {
  Button,
  Card,
  CardContent,
  Grid,
  Typography
} from '@material-ui/core';
import { withStyles } from '@material-ui/core/styles';

import Client from 'Client';
import config from 'config/config';
import AddMeditation from 'components/meditation/add';

const styles = (theme) => ({
  card: {
    minWidth: 275
  },
  button: {
    margin: theme.spacing.unit
  },
  grid: {
    width: '100%',
    position: 'absolute',
    left: '50%',
    top: '50%',
    transform: 'translate(-50%, -50%)'
  },
  title: {
    fontSize: 14
  },
  pos: {
    marginBottom: 12
  }
});


class Score extends Component {
  constructor(props) {
    super(props);

    this.state = {
      score: '',
      seasonName: '',
      endOfSeasonName: '',
      startDate: '',
      endDate: '',
      open: false
    };

    this.classes = props.classes;
  }

  componentDidMount() {
    document.title = `Score | ${config.app.title}`;

    Client.fetch('/api/currentSeason', {
      method: 'POST',
      body: { date: new Date() }
    }).then((season = {}) => {
      this.setState({
        score: season.score,
        seasonName: season.name,
        endOfSeasonName: season.endOfSeasonName,
        startDate: season.startDate,
        endDate: season.endDate
      });
    });
  }

  handleClickOpen = () => {
    this.setState({ open: true });
  };

  toggleAddMeditation = () => {
    this.setState({ open: !this.state.open });
  };


  render() {
    return (
      <Grid container className={this.classes.grid} justify="space-around"
      >
        <Card className={this.classes.card}>
          <CardContent>
            <Typography className={this.classes.title} align="center" color="textSecondary" gutterBottom>
              Your Meditation Score
            </Typography>
            <Typography variant="h1" component="h2" align="center">
              75
            </Typography>
            <Typography className={this.classes.pos} color="textSecondary" align="center">
              March 23 - June 22
            </Typography>
            <Typography component="p" align="center">
              5 more days until the Summer Solstice
            </Typography>
          </CardContent>
        </Card>
        <Button
          variant="contained"
          className={this.classes.button}
          onClick={this.handleClickOpen}
        >
          Add a Meditation
        </Button>
        {this.state.open ? (
          <AddMeditation
            open={this.state.open}
            toggleAddMeditation={this.toggleAddMeditation}
          />
        ) : null}
      </Grid>
    );
  }
}

Score.propTypes = {
  classes: PropTypes.object.isRequired
};

export default withStyles(styles)(Score);
