import React, { Component } from 'react';
import PropTypes from 'prop-types';
import Client from 'Client';

import { Grid, Button, Snackbar, TextField, Typography } from '@material-ui/core';
import { Redirect } from 'react-router-dom';
import config from 'config/config';

const INPROGRESS = 'inprogress';
const SUCCESS = 'success';
const ERROR = 'error';


class Signin extends Component {
  state = {
    email: '',
    password: '',
    signinProgress: null, // null, INPROGRESS, SUCCESS, ERROR
    open: false,
    errorMsg: '',
    disabled: false
  };

  constructor(props) {
    super(props);

    this.classes = props.classes;
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  async handleSubmit(event) {
    event.preventDefault();
    this.setState({
      signinProgress: INPROGRESS,
      disabled: true
    });

    let { email, password } = this.state;

    try {
      const resp = await Client.fetch('/api/auth/signin', {
        method: 'POST',
        body: { email, password }
      });

      if (resp.error) {
        this.setState({
          signinProgress: ERROR,
          errorMsg: resp.error,
          open: true,
          disabled: false
        });
      } else {
        this.setState({ signinProgress: SUCCESS });
      }
    } catch (e) {
      this.setState({
        signinProgress: ERROR,
        errorMsg: 'Error logging in - please check your email and password',
        open: true,
        disabled: false
      });
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

  componentDidMount() {
    document.title = `Signin | ${config.app.title}`;
  }

  render() {
    return (
      <div>
        <Grid container justify="center" alignItems="flex-end">
          <Grid item xs={9}>
            <Typography variant="h4" gutterBottom>
              Sign Up
            </Typography>
          </Grid>
          <Grid item xs={9}>
            <form className="form-signin" onSubmit={this.handleSubmit}>
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
                Sign In
              </Button>
              {this.state.signinProgress === SUCCESS ? <Redirect to="/dashboard" /> : ''}
            </form>
            <Snackbar
              anchorOrigin={{
                vertical: 'bottom',
                horizontal: 'left'
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
          </Grid>
        </Grid>
      </div>
    );
  }
}

Signin.propTypes = {
  classes: PropTypes.object.isRequired
};


export default Signin;
