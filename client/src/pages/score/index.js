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
import moment from 'moment';

import Client from 'Client';
import config from 'config/config';
import AddMeditation from 'components/meditation/add';

const styles = (theme) => ({
  card: {
    minWidth: 275
  },
  button: {
    marginTop: theme.spacing.unit
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
      daysUntilEndOfSeason: '',
      open: false
    };

    this.classes = props.classes;
  }

  componentDidMount() {
    document.title = `Score | ${config.app.title}`;

    const date = new Date();

    Client.fetch('/api/getCurrentSeason', {
      method: 'POST',
      body: { date, tz: -(date.getTimezoneOffset() / 60) }
    }).then((season = {}) => {
      this.setState({
        score: season.score,
        seasonName: season.name,
        endOfSeasonName: season.endOfSeasonName,
        startDate: this.parseDatetoString(season.startDate),
        endDate: this.parseDatetoString(season.endDate),
        daysUntilEndOfSeason: this.getDaysUntilEndOfSeason(season.endDate)
      });
    });
  }

  handleClickOpen = () => {
    this.setState({ open: true });
  };

  toggleAddMeditation = () => {
    this.setState({ open: !this.state.open });
  };

  parseDatetoString = (date) => {
    const months = [
      'January',
      'February',
      'March',
      'April',
      'May',
      'June',
      'July',
      'August',
      'September',
      'October',
      'November',
      'December'
    ];
    const month = Math.floor(date / 100) % 100 - 1;
    const day = date % 100;

    return `${months[month]} ${day}`;
  }

  getDaysUntilEndOfSeason = (endDate) => {
    if (endDate) {
      const curr = new moment().set({ hour: 0, minute: 0, second: 0, millisecond: 0 });
      const year = Math.floor(endDate / 10000)
      const month = Math.floor(endDate / 100) % 100 - 1;
      const day = endDate % 100;
      const end = moment(`${year}-${month}-${day}`);

      return (end - curr) / (60 * 60 * 24 * 1000);
    }
  }

  render() {
    return (
      <Grid
        container
        className={this.classes.grid}
        direction="column"
        justify="center"
        alignItems="center"
      >
        {this.state.score === '' ? (
          <div></div>
        ) : (
          <div>
            <Grid item xs={12}>
              <Card className={this.classes.card}>
                <CardContent>
                  <Typography className={this.classes.title} align="center" color="textSecondary" gutterBottom>
                    Your Meditation Score
                  </Typography>
                  <Typography variant="h1" component="h2" align="center">
                    {this.state.score}
                  </Typography>
                  <Typography className={this.classes.pos} color="textSecondary" align="center">
                    {this.state.startDate} - {this.state.endDate}
                  </Typography>
                  <Typography component="p" align="center">
                    {this.state.daysUntilEndOfSeason} more days until the {this.state.endOfSeasonName}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
            <Grid item xs={12}>
              <Button
                variant="contained"
                className={this.classes.button}
                onClick={this.handleClickOpen}
                fullWidth
              >
                Add a Meditation
              </Button>
            </Grid>
            {this.state.open ? (
              <AddMeditation
                open={this.state.open}
                toggleAddMeditation={this.toggleAddMeditation}
              />
            ) : null}
          </div>
        )}
      </Grid>
    );
  }
}

Score.propTypes = {
  classes: PropTypes.object.isRequired
};

export default withStyles(styles)(Score);
