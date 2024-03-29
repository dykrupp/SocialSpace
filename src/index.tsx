import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './components/App';
import Firebase from './components/Firebase';
import { FirebaseContext } from './components/Firebase/context';
import { createMuiTheme, ThemeProvider } from '@material-ui/core/styles';
import CssBaseline from '@material-ui/core/CssBaseline';
import * as serviceWorker from './serviceWorker';

const customTheme = createMuiTheme({
  palette: {
    background: {
      default: '#e9ebee',
    },
  },
  typography: {
    fontFamily: [
      '-apple-system',
      'BlinkMacSystemFont',
      'Segoe UI',
      'Roboto',
      'Oxygen',
      'Ubuntu',
      'Cantarell',
      'Fira Sans',
      'Droid Sans',
      'Helvetica Neue',
      'sans-serif',
    ].join(','),
  },
});

ReactDOM.render(
  <ThemeProvider theme={customTheme}>
    <CssBaseline>
      <FirebaseContext.Provider value={new Firebase()}>
        <App />
      </FirebaseContext.Provider>
    </CssBaseline>
  </ThemeProvider>,
  document.getElementById('root')
);

serviceWorker.register();
