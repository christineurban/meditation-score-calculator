import React, { Component } from 'react';
import PropTypes from 'prop-types';
import Client from 'Client';

import config from 'config/config';
import Footer from 'components/footer/Footer';
import Header from 'components/header/Header';
import { Grid, Button, TextField } from '@material-ui/core';
import './Profile.css';

const INPROGRESS = 'inprogress';
const SUCCESS = 'success';
const ERROR = 'error';


class Profile extends Component {
  state = {
    firstName: '',
    lastName: '',
    email: '',
    profileImageURL: '',
    currentPassword: '',
    newPassword: '',
    verifyPassword: '',
    saveProgress: null // null, INPROGRESS, SUCCESS, ERROR
  };


  options = [
    { to: '/logout', label: 'Logout' }
  ];

  constructor(props) {
    super(props);

    this.classes = props.classes;
  }

  componentDidMount() {
    document.title = `Profile | ${config.app.title}`;

    Client.fetch('/api/users/me').then((data = {}) => {
      this.setState({
        firstName: data.firstName,
        lastName: data.lastName,
        email: data.email
      });
    });
  }

  handleUserSubmit = async (event) => {
    event.preventDefault();
    this.setState({ saveProgress: INPROGRESS });
    let { firstName, lastName, email } = this.state;

    try {
      await Client.fetch('/api/users', {
        method: 'PUT',
        body: { firstName, lastName, email }
      });
      this.setState({ saveProgress: SUCCESS });
    } catch (e) {
      this.setState({ saveProgress: ERROR });
    }
  }

  handlePasswordSubmit = async (event) => {
    event.preventDefault();
    this.setState({ saveProgress: INPROGRESS });
    let { currentPassword, newPassword, verifyPassword } = this.state;

    try {
      await Client.fetch('/api/users/password', {
        method: 'POST',
        body: { currentPassword, newPassword, verifyPassword }
      });
      this.setState({ saveProgress: SUCCESS });
    } catch (e) {
      this.setState({ saveProgress: ERROR });
    }
  }

  handleChange = (name) => {
    return (event) => {
      this.setState({
        [name]: event.target.value
      });
    };
  };

  onDrop(acceptedFiles, rejectedFiles) {
    let formData = new FormData();

    formData.append('newProfilePicture', acceptedFiles[0]);
    let requestOptions = {
      method: 'POST',
      body: formData,
      credentials: 'same-origin'
    };

    Client.fetch('/api/users/picture', requestOptions, true).then((data = {}) => {
      this.setState({
        profileImageURL: data.profileImageURL
      });
    });
  }

  render() {
    return (
      <div className="page catalog-page">
        <Header title="Profile" menuOptions={this.options} />
        <div className="page-content">
          <Grid container justify="center" alignItems="flex-end">
            <Grid item xs={9}>
              <form onSubmit={this.handleUserSubmit}>
                <TextField
                  required
                  fullWidth
                  margin="dense"
                  label="First Name"
                  autoComplete="gr-first-name"
                  value={this.state.firstName}
                  onChange={this.handleChange('firstName')}
                />
                <TextField
                  required
                  fullWidth
                  margin="dense"
                  label="Last Name"
                  autoComplete="gr-last-name"
                  value={this.state.lastName}
                  onChange={this.handleChange('lastName')}
                />
                <TextField
                  required
                  fullWidth
                  margin="dense"
                  label="Email"
                  type="email"
                  autoComplete="gr-email"
                  value={this.state.email}
                  onChange={this.handleChange('email')}
                />
                <Button type="submit"
                        variant="contained"
                        color="secondary"
                        disabled={this.state.saveProgress === INPROGRESS}>
                  Update User Details
                </Button>
              </form>
              <form onSubmit={this.handlePasswordSubmit}>
                <TextField
                  required
                  fullWidth
                  margin="dense"
                  label="Current Password"
                  type="password"
                  onChange={this.handleChange('currentPassword')}
                />
                <TextField
                  required
                  fullWidth
                  margin="dense"
                  label="New Password"
                  type="password"
                  autoComplete="off"
                  onChange={this.handleChange('newPassword')}
                />
                <TextField
                  required
                  fullWidth
                  margin="dense"
                  label="Verify Password"
                  type="password"
                  autoComplete="off"
                  onChange={this.handleChange('verifyPassword')}
                />
                <Button type="submit"
                        variant="contained"
                        color="secondary"
                        disabled={this.state.saveProgress === INPROGRESS}>
                  Update Password
                </Button>
              </form>
            </Grid>
          </Grid>
        </div>
        <Footer active="/profile" />
      </div>
    );
  }
}

Profile.propTypes = {
  classes: PropTypes.object.isRequired
};

export default Profile;
