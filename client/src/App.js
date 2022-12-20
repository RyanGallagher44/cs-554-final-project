import './App.css';
import {BrowserRouter as Router, Route, Routes} from 'react-router-dom';
import { AuthProvider } from './firebase/Auth';
import Account from './components/Account';
import Home from './components/Home';
import Landing from './components/Landing';
import Navigation from './components/Navigation';
import SignIn from './components/SignIn';
import SignUp from './components/SignUp';
import PrivateRoute from './components/PrivateRoute';
import Artist from './components/Artist';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import Album from './components/Album';

const theme = createTheme({
  typography: {
    allVariants: {
      fontFamily: 'Work Sans',
      textTransform: 'none',
    },
  }
});

function App() {
  return (
    <ThemeProvider theme={theme}>
      <AuthProvider>
        <Router>
          <div className="App">
            <header className="App-header">
              <Navigation />
            </header>
          </div>
          <div className='App-body'>
            <Routes>
              <Route path='/' element={<Landing />} />
              <Route path='/home' element={<PrivateRoute />}>
                <Route path='/home' element={<Home />} />
              </Route>
              <Route path='/account' element={<PrivateRoute />}>
                <Route path='/account' element={<Account />} />
              </Route>
              <Route path='/artist/:id' element={<PrivateRoute />}>
                <Route path='/artist/:id' element={<Artist />} />
              </Route>
              <Route path='/album/:id' element={<PrivateRoute />}>
                <Route path='/album/:id' element={<Album />} />
              </Route>
              <Route path='/login' element={<SignIn />} />
              <Route path='/register' element={<SignUp />} />
            </Routes>
          </div>
        </Router>
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;
