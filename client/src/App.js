import React, { Component } from 'react';
import { BrowserRouter as Router, Route } from 'react-router-dom';
import { MuiThemeProvider, createMuiTheme } from '@material-ui/core/styles';
import CssBaseline from '@material-ui/core/CssBaseline';

import Landing from 'pages/landing';
import Signup from 'pages/auth/signup';
import Signin from 'pages/auth/signin';
import Profile from 'pages/profile';
import Score from 'pages/score';
import Meditations from 'pages/meditations';
import Days from 'pages/days';
import Seasons from 'pages/seasons';


const theme = createMuiTheme({
  typography: {
    useNextVariants: true
  }
});

class App extends Component {
  render() {
    return (
      <Router>
        <MuiThemeProvider theme={theme}>
          <CssBaseline />
          <Route path="/" exact={true} component={Landing} />
          <Route path="/signup" component={Signup} />
          <Route path="/signin" component={Signin} />
          <Route path="/logout" component={Landing} logout={true} />
          <Route path="/profile" component={Profile} />
          <Route path="/score" component={Score} />
          <Route path="/meditations" component={Meditations} />
          <Route path="/days" component={Days} />
          <Route path="/seasons" component={Seasons} />
        </MuiThemeProvider>
      </Router>
    );
  }
}

export default App;
