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
import { MuiPickersUtilsProvider, DateTimePicker } from 'material-ui-pickers';
import DateFnsUtils from '@date-io/date-fns';
import moment from 'moment';

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
      open: false
    };

    this.classes = props.classes;
  }

  render() {
    return (
      <Dialog
        open={this.props.open}
        aria-labelledby="form-dialog-title"
        onBackdropClick={this.props.toggleAddMeditation}
      >
        <DialogTitle id="form-dialog-title">How many minutes was your meditation?</DialogTitle>
        <form onSubmit={this.props.handleSubmit}>
          <Grid
            container
            className={this.classes.grid}
            direction="column"
            justify="center"
            alignItems="center"
          >
            <Grid item xs={12}>
              <TextField
                id="outlined-number"
                label="Minutes"
                onChange={this.props.handleMinutesChange}
                type="number"
                className={this.classes.textField}
                InputLabelProps={{
                  shrink: true
                }}
                margin="normal"
                variant="outlined"
                required
              />
            </Grid>
            <Grid item xs={12}>
              <MuiPickersUtilsProvider utils={DateFnsUtils}>
                <DateTimePicker
                  margin="normal"
                  label="Date and Time"
                  variant="outlined"
                  value={this.state.dateTime}
                  onChange={this.props.handleDateTimeChange}
                  format="MMM dd yyyy, h:mm a"
                  showTodayButton
                  disableFuture
                />
              </MuiPickersUtilsProvider>
            </Grid>
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
  toggleAddMeditation: PropTypes.func.isRequired,
  handleSubmit: PropTypes.func.isRequired,
  handleMinutesChange: PropTypes.func.isRequired,
  handleDateTimeChange: PropTypes.func.isRequired
};

export default withStyles(styles)(AddMeditation);
