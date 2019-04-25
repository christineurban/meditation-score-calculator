import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import Icon from '@material-ui/core/Icon';
import './Footer.css';

const NAVIGATION = [
  { to: '/dashboard', label: 'Home', icon: 'home' },
  { to: '/estimates', label: 'Estimates', icon: 'mode_comment' },
  { to: '/invoices', label: 'Invoices', icon: 'receipt' },
  { to: '/catalog', label: 'Catalog', icon: 'import_contacts' },
  { to: '/financing', label: 'Financing', icon: 'attach_money' }
];

class Footer extends Component {
  render() {
    const links = NAVIGATION.map((nav) => {
      return (
        <Link className={`nav-item nav-link ${this.props.active === nav.to ? 'active' : ''} pb-2`}
              to={nav.to}
              key={nav.to}
        >
          <button type="button" className="btn bmd-btn-icon bmd-btn-icon-sm">
            <Icon>{nav.icon}</Icon>
          </button>
          <br />
          <span>{nav.label}</span>
        </Link>
      );
    });

    return (
      <footer className="page-footer bg-primary-blue">
        <nav className="nav nav-pills nav-justified w-100">
          {links}
        </nav>
      </footer>
    );
  }
}

Footer.propTypes = {
  active: PropTypes.string
};


export default Footer;
