import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import HeaderMenu from 'components/header/HeaderMenu';
import { Link } from 'react-router-dom';
import { Fab, Icon, IconButton } from '@material-ui/core';

const styles = (theme) => ({
  root: {
    width: '100%',
    backgroundColor: theme.palette.background.paper
  }
});

class Header extends Component {
  render() {
    return (
      <header className="page-header card pt-4 bg-primary-blue text-light">
        <div className="d-flex align-items-center px-2 pt-4 mt-2">
          <h1 id="page-title" className="mr-auto h5 pt-2 pl-3">{this.props.title}</h1>
          {
            this.props.searchClick &&
            <IconButton onClick={() => { this.props.searchClick(); }} aria-label="Search">
              <Icon className="text-light">search</Icon>
            </IconButton>
          }
          {this.props.menuOptions && <HeaderMenu options={this.props.menuOptions}/>}
        </div>
        <div className="m-4 pt-4 text-right">
          <Fab className={'secondary-button'}
               component={Link} to="/newestimates"
               size="small"
               color="secondary"
               aria-label="new estimate"
          >
            <Icon>add</Icon>
          </Fab>
        </div>
      </header>
    );
  }
}

Header.propTypes = {
  searchClick: PropTypes.func,
  menuOptions: PropTypes.array,
  title: PropTypes.string
};

export default withStyles(styles)(Header);
