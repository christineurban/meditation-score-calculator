import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';
import DeleteIcon from '@material-ui/icons/Delete';
import IconButton from '@material-ui/core/IconButton';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemSecondaryAction from '@material-ui/core/ListItemSecondaryAction';
import ListItemText from '@material-ui/core/ListItemText';
import TextField from '@material-ui/core/TextField';
import Client from 'Client';
import config from 'config/config';

const INPROGRESS = 'inprogress';
const SUCCESS = 'success';
const ERROR = 'error';

const styles = (theme) => ({
  root: {
    width: '100%',
    backgroundColor: theme.palette.background.paper
  },
  button: {
    margin: theme.spacing.unit
  },
  form: {
    margin: theme.spacing.unit
  },
  textField: {
    marginLeft: theme.spacing.unit,
    paddingRight: 16
  },
  dense: {
    marginTop: 16
  }
});


class UserManagement extends Component {
  state = {
    admins: [],
    users: [],
    myEmail: null,
    view: 'list',
    showDeleteBtns: false,
    saveProgress: null // null, INPROGRESS, SUCCESS, ERROR
  };

  constructor(props) {
    super(props);

    this.classes = props.classes;
    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  componentDidMount() {
    document.title = `User Management | ${config.app.title}`;

    Client.fetch('/api/organization').then((data = {}) => {
      this.setState({
        admins: data.admins,
        users: data.users,
        myEmail: data.email
      });
    });
  }

  onEditClick = () => {
    this.setState({
      showDeleteBtns: !this.state.showDeleteBtns
    });
  };

  onAddClick = () => {
    this.setState({ view: 'add' });
  };

  deleteUser = async (event) => {
    const userId = event.currentTarget.value;

    this.setState({ saveProgress: INPROGRESS });

    try {
      await Client.fetch('/api/organization/users', {
        method: 'DELETE',
        body: { userId }
      });
      this.setState({ saveProgress: SUCCESS });
    } catch (e) {
      this.setState({ saveProgress: ERROR });
    }
  };

  async handleSubmit(event) {
    event.preventDefault();
    this.setState({ saveProgress: INPROGRESS });
    let { firstName, lastName, email } = this.state;

    try {
      await Client.fetch('/api/organization/users', {
        method: 'POST',
        body: { firstName, lastName, email }
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

  render() {
    if (this.state.view === 'list') {
      return (
        <div className="page usermanagement-page bg-light d-flex flex-column mh-100">
          <header className="page-header card pt-4 bg-primary-blue text-light">
            <div className="d-flex align-items-center px-2 pt-4 mt-2">
              <h1 id="page-title" className="mr-auto h5 pt-2 pl-3">User Management</h1>
            </div>
          </header>
          <div className={this.classes.root}>
            <Button variant="raised"
                    color="secondary"
                    className={this.classes.button}
                    onClick={this.onEditClick}>
              Edit Users
            </Button>
            <Button variant="raised"
                    color="secondary"
                    className={this.classes.button}
                    disabled={this.state.saveProgress === INPROGRESS}
                    onClick={this.onAddClick}>
              Add New User
            </Button>
            <List component="nav">
              {this.state.users.map((user) => {
                return (
                  <div key={user._id}>
                    <ListItem>
                      <ListItemText primary={`${user.firstName} ${user.lastName}`}
                                    secondary={user.email} />
                      { this.state.showDeleteBtns && user.email !== this.state.myEmail &&
                        <ListItemSecondaryAction>
                          <IconButton aria-label="Delete"
                                      onClick={this.deleteUser}
                                      value={user._id}
                          >
                            <DeleteIcon />
                            {this.state.saveProgress === SUCCESS ? window.location.reload() : ''}
                          </IconButton>
                        </ListItemSecondaryAction>
                      }
                    </ListItem>
                  </div>
                );
              })}
            </List>
          </div>
        </div>
      );
    } else if (this.state.view === 'add') {
      return (
        <div className="page usermanagement-page bg-light d-flex flex-column mh-100">
          <header className="page-header card pt-4 bg-primary-blue text-light">
            <div className="d-flex align-items-center px-2 pt-4 mt-2">
              <h1 id="page-title" className="mr-auto h5 pt-2 pl-3">User Management</h1>
            </div>
          </header>
          <form onSubmit={this.handleSubmit}>
            <TextField
              required
              fullWidth
              id="standard-name"
              className={this.classes.textField}
              margin="dense"
              label="First Name"
              onChange={this.handleChange('firstName')}
            />
            <br />
            <TextField
              required
              fullWidth
              id="standard-name"
              className={this.classes.textField}
              margin="dense"
              label="Last Name"
              onChange={this.handleChange('lastName')}
            />
            <br />
            <TextField
              required
              fullWidth
              id="standard-name"
              className={this.classes.textField}
              margin="dense"
              label="Email"
              type="email"
              onChange={this.handleChange('email')}
            />
            <br />
            <Button type="submit"
                    variant="raised"
                    color="secondary"
                    className={this.classes.button}
                    disabled={this.state.saveProgress === INPROGRESS}>
              Save
            </Button>
            {this.state.saveProgress === SUCCESS ? window.location.reload() : ''}
          </form>
        </div>
      );
    }
  }
}

UserManagement.propTypes = {
  classes: PropTypes.object.isRequired
};


export default withStyles(styles)(UserManagement);
