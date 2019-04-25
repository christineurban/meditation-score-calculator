import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import { withStyles } from '@material-ui/core/styles';
import { grey } from '@material-ui/core/colors';
import { Icon, IconButton, Menu, MenuItem } from '@material-ui/core';

const styles = function(theme) {
  return {
    root: {
      maxHeight: '73vh'
    },
    light: {
      color: grey[100]
    }
  };
};

const options = [
  { to: '/signin', label: 'Sign In' },
  { to: '/signup', label: 'Sign Up' },
  { to: '/profile', label: 'Profile' },
  { to: '/dashboard', label: 'Dashboard' },
  { to: '/estimates', label: 'Estimates' },
  { to: '/new-estimate', label: 'New Estimate' },
  { to: '/catalog', label: 'Catalog' },
  { to: '/estimatePDF', label: 'EstimatePDF' },
  { to: '/invoicePDF', label: 'InvoicePDF' },
  { to: '/logout', label: 'Logout' }
];

class HeaderMenu extends Component {
  state = {
    anchorEl: null
  };

  constructor(props) {
    super(props);

    this.classes = this.props.classes;
  }

  handleClick = (event) => {
    this.setState({ anchorEl: event.currentTarget });
  };

  handleClose = () => {
    this.setState({ anchorEl: null });
  };

  options = () => {
    if (this.props.options) {
      return this.props.options;
    } else {
      return options;
    }
  };

  optionClickHandler = (handler) => {
    this.handleClose();
    if (typeof handler === 'function') {
      handler();
    }
  }

  render() {
    const { anchorEl } = this.state;

    return (
      <div className={this.classes.root}>
        <IconButton
          aria-label="More"
          aria-owns={anchorEl ? 'header-menu' : null}
          aria-haspopup="true"
          onClick={this.handleClick}
        >
          <Icon className={this.classes.light}>more_vert</Icon>
        </IconButton>
        <Menu
          id="header-menu"
          anchorEl={anchorEl}
          open={Boolean(anchorEl)}
          onClose={this.handleClose}
        >
          {this.options().map((option) => option.to ? (
            <MenuItem
              component={Link}
              to={option.to}
              key={option.label}
              onClick={this.handleClose}
            >
              {option.label}
            </MenuItem>
          ) : (
            <MenuItem
              key={option.label}
              onClick={() => this.optionClickHandler(option.handler)}
            >
              {option.label}
            </MenuItem>
          ))}
        </Menu>
      </div>
    );
  }
}

HeaderMenu.propTypes = {
  classes: PropTypes.object.isRequired,
  options: PropTypes.array
};


export default withStyles(styles)(HeaderMenu);
