import React, { Component } from 'react';
import PropTypes from 'prop-types';
import Dropzone from 'react-dropzone';
import { withStyles } from '@material-ui/core/styles';
import Header from 'components/header/Header';
import Footer from 'components/footer/Footer';
import { grey } from '@material-ui/core/colors';
import { Grid, Button, TextField, Avatar, Typography } from '@material-ui/core';
import Client from 'Client';
import config from 'config/config';
import './Profile.css';

const INPROGRESS = 'inprogress';
const SUCCESS = 'success';
const ERROR = 'error';

const styles = function(theme) {
  return {
    root: {
      height: '100%',
      textAlign: 'center'
    },
    button: {
      marginTop: theme.spacing.unit * 2,
      marginBottom: theme.spacing.unit * 4
    },
    input: {
      color: grey[200]
    }
  };
};


class Profile extends Component {
  state = {
    firstName: '',
    lastName: '',
    phoneNumber: '',
    email: '',
    profileImageURL: '',
    currentPassword: '',
    newPassword: '',
    verifyPassword: '',
    saveProgress: null // null, INPROGRESS, SUCCESS, ERROR
  };


  options = [
    { to: '/dashboard', label: 'Dashboard' },
    { to: '/logout', label: 'Logout' }
  ];

  constructor(props) {
    super(props);

    this.classes = props.classes;
    this.onDrop = this.onDrop.bind(this);
    this.handleChange = this.handleChange.bind(this);
    this.handleUserSubmit = this.handleUserSubmit.bind(this);
    this.handlePasswordSubmit = this.handlePasswordSubmit.bind(this);
  }

  componentDidMount() {
    document.title = `Profile | ${config.app.title}`;

    Client.fetch('/api/users/me').then((data = {}) => {
      this.setState({
        firstName: data.firstName,
        lastName: data.lastName,
        phoneNumber: data.phoneNumber,
        email: data.email,
        profileImageURL: data.profileImageURL
      });
    });
  }

  async handleUserSubmit(event) {
    event.preventDefault();
    this.setState({ saveProgress: INPROGRESS });
    let { firstName, lastName, phoneNumber, email } = this.state;

    try {
      await Client.fetch('/api/users', {
        method: 'PUT',
        body: { firstName, lastName, phoneNumber, email }
      });
      this.setState({ saveProgress: SUCCESS });
    } catch (e) {
      this.setState({ saveProgress: ERROR });
    }
  }

  async handlePasswordSubmit(event) {
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
      <div className="page catalog-page bg-light d-flex flex-column mh-100">
        <Header title="Profile" menuOptions={this.options} />
        <div className="page-content">
          <Grid container className={this.classes.root} justify="center" alignItems="flex-end">
            <Grid item xs={9}>
              <Dropzone
                accept="image/*"
                onDrop={this.onDrop}
                disabled={this.state.saveProgress === INPROGRESS}
                multiple={false}
                maxSize={5 * 1024 * 1024}
              >
                <Avatar alt="Profile Avatar" src={this.state.profileImageURL} />
                <Typography variant="body2">
                  Click to select a new profile image, or drag and drop one on this message.
                </Typography>
              </Dropzone>
            </Grid>
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
                  label="Phone Number"
                  type="phone"
                  autoComplete="gr-phone-number"
                  value={this.state.phoneNumber}
                  onChange={this.handleChange('phoneNumber')}
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
                        className={this.classes.button}
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
                  autoComplete="gr-password"
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
                        className={this.classes.button}
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

export default withStyles(styles)(Profile);
