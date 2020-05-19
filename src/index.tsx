import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './components/App';
import Firebase from './components/Firebase';
import { FirebaseContext } from './components/Firebase/context';
import { createMuiTheme, ThemeProvider } from '@material-ui/core/styles';

const customTheme = createMuiTheme({
  palette: {
    type: 'light',
  },
});

ReactDOM.render(
  <ThemeProvider theme={customTheme}>
    <FirebaseContext.Provider value={new Firebase()}>
      <App />
    </FirebaseContext.Provider>
  </ThemeProvider>,
  document.getElementById('root')
);
