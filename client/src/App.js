import React, { Component } from 'react';
import { BrowserRouter as Router, Route } from 'react-router-dom';
import { MuiThemeProvider, createMuiTheme } from '@material-ui/core/styles';
import CssBaseline from '@material-ui/core/CssBaseline';
import Landing from './pages/landing/Landing';
import Signup from './pages/auth/signup/Signup';
import Signin from './pages/auth/signin/Signin';
import Profile from './pages/profile/Profile';


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
        </MuiThemeProvider>
      </Router>
    );
  }
}

export default App;
