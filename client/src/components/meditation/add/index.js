import React, { Component } from 'react';
import PropTypes from 'prop-types';
import Client from 'Client';
import {
  Button,
  Dialog,
  DialogActions,
  DialogTitle,
  Grid,
  TextField
} from '@material-ui/core';
import { withStyles } from '@material-ui/core/styles';
import DateFnsUtils from '@date-io/date-fns';
import { MuiPickersUtilsProvider, DateTimePicker } from 'material-ui-pickers';

const styles = (theme) => ({
  button: {
    margin: theme.spacing.unit
  },
  grid: {
    width: '100%',
    paddingBottom: 20
  },
  textField: {
    align: 'center'
  },
  title: {
    fontSize: 14
  }
});


class AddMeditation extends Component {
  constructor(props) {
    super(props);

    this.state = {
      open: false,
      minutes: 0,
      date: new Date(),
      time: new Date()
    };

    this.classes = props.classes;
  }

  handleMinutesChange = (evt) => {
    this.setState({ minutes: evt.target.value });
  }

  handleDateChange = (date) => {
    this.setState({ date });
  };

  handleTimeChange = (time) => {
    this.setState({ time });
  };

  handleSubmit = () => {
    console.log(this.state);
    this.props.toggleAddMeditation();
  }

  handleSubmit = (evt) => {
    evt.preventDefault();

    const { minutes, date, time } = this.state;

    Client.fetch('/api/meditations', {
      method: 'POST',
      body: { minutes, date, time }
    }).then(() => {
      this.props.toggleAddMeditation();
    });
  }

  render() {
    return (
      <Dialog
        open={this.props.open}
        aria-labelledby="form-dialog-title"
        onBackdropClick={this.props.toggleAddMeditation}
      >
        <DialogTitle id="form-dialog-title">How many minutes was your meditation?</DialogTitle>
        <form onSubmit={this.handleSubmit}>
          <Grid container className={this.classes.grid} justify="space-around">
            <TextField
              id="outlined-number"
              label="Minutes"
              onChange={this.handleMinutesChange}
              type="number"
              className={this.classes.textField}
              InputLabelProps={{
                shrink: true
              }}
              margin="normal"
              variant="outlined"
              required
            />
            <MuiPickersUtilsProvider utils={DateFnsUtils}>
              <DateTimePicker
                margin="normal"
                label="Date and Time"
                variant="outlined"
                value={this.state.time}
                onChange={this.handleTimeChange}
                format="MMM dd yyyy, h:mm a"
                showTodayButton
                disableFuture
              />
            </MuiPickersUtilsProvider>
          </Grid>
          <DialogActions>
            <Button type="submit" color="primary">
              Submit
            </Button>
            <Button onClick={this.props.toggleAddMeditation} color="primary">
              Cancel
            </Button>
          </DialogActions>
        </form>
      </Dialog>
    );
  }
}

AddMeditation.propTypes = {
  classes: PropTypes.object.isRequired,
  open: PropTypes.bool.isRequired,
  toggleAddMeditation: PropTypes.func.isRequired
};

export default withStyles(styles)(AddMeditation);
