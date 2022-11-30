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

function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="App">
          <header className="App-header">
            <Navigation />
          </header>
        </div>
        <Routes>
          <Route path='/' element={<Landing />} />
          <Route path='/home' element={<PrivateRoute />}>
            <Route path='/home' element={<Home />} />
          </Route>
          <Route path='/account' element={<PrivateRoute />}>
            <Route path='/account' element={<Account />} />
          </Route>
          <Route path='/login' element={<SignIn />} />
          <Route path='/register' element={<SignUp />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;
