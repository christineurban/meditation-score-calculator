import React, { Component } from 'react';
import PropTypes from 'prop-types';
import Client from 'Client';

import config from 'config/config';
import { Button, Grid, Snackbar, TextField, Typography } from '@material-ui/core';
import { Redirect } from 'react-router-dom';

const INPROGRESS = 'inprogress';
const SUCCESS = 'success';
const ERROR = 'error';


class Signup extends Component {
  constructor(props) {
    super(props);

    this.state = {
      firstName: '',
      lastName: '',
      email: '',
      password: '',
      signupProgress: null, // null, INPROGRESS, SUCCESS, ERROR
      open: false,
      errorMsg: '',
      disabled: false
    };

    this.classes = props.classes;
  }

  componentDidMount() {
    document.title = `Sign Up | ${config.app.title}`;
  }

  handleSubmit = async (event) => {
    event.preventDefault();
    this.setState({
      signupProgress: INPROGRESS,
      disabled: true
    });

    const { firstName, lastName, email, password } = this.state;

    try {
      const resp = await Client.fetch('/api/auth/signup', {
        method: 'POST',
        body: { firstName, lastName, email, password }
      });

      if (resp.error) {
        this.setState({
          signUpProgress: ERROR,
          errorMsg: resp.error,
          open: true,
          disabled: false
        });
      } else {
        this.setState({ signupProgress: SUCCESS });
      }
    } catch (e) {
      this.setState({ signupProgress: ERROR });
    }
  }

  handleChange = (name) => (event) => {
    this.setState({
      [name]: event.target.value
    });
  }
  ;

  handleClose = (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }

    this.setState({ open: false });
  };

  render() {
    return (
      <div>
        <Grid container justify="center" alignItems="flex-end">
          <Grid item xs={9}>
            <Typography variant="h4" gutterBottom>
              Start Tracking Better Today
            </Typography>
          </Grid>
          <Grid item xs={9}>
            <form onSubmit={this.handleSubmit}>
              <TextField
                required
                fullWidth
                margin="dense"
                label="First Name"
                onChange={this.handleChange('firstName')}
              />
              <TextField
                required
                fullWidth
                margin="dense"
                label="Last Name"
                onChange={this.handleChange('lastName')}
              />
              <TextField
                required
                fullWidth
                margin="dense"
                label="Email"
                type="email"
                autoComplete="gr-email"
                onChange={this.handleChange('email')}
              />
              <TextField
                required
                fullWidth
                margin="dense"
                label="Password"
                type="password"
                autoComplete="gr-password"
                onChange={this.handleChange('password')}
              />
              <Button type="submit"
                      variant="contained"
                      color="secondary"
                      disabled={this.state.disabled}>
                Sign Up
              </Button>
              {this.state.signupProgress === SUCCESS ? <Redirect to="/dashboard" /> : ''}
            </form>
          </Grid>
        </Grid>
        <Snackbar
          anchorOrigin={{
            vertical: 'top',
            horizontal: 'center'
          }}
          open={this.state.open}
          autoHideDuration={7000}
          onClose={this.handleClose}
          ContentProps={{
            'aria-describedby': 'message-id'
          }}
          message={<span id="message-id">{this.state.errorMsg}</span>}
          action={[
            <Button key="undo" color="secondary" size="small" onClick={this.handleClose}>
              CLOSE
            </Button>
          ]}
        />
      </div>
    );
  }
}

Signup.propTypes = {
  classes: PropTypes.object.isRequired
};

export default Signup;
