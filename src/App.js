import React, { useState } from 'react'
import '../node_modules/bootstrap/dist/css/bootstrap.min.css'
import './App.css'
import { BrowserRouter as Router, Routes, Route, Link, Navigate } from 'react-router-dom'
import Login from './components/login.component'
import SignUp from './components/signup.component'
import TableDisplay from './components/TableDisplay'
import logo from './logo.png'

const Dashboard = () => {
  const [selectedTable, setSelectedTable] = useState('');

  return (
    <div>
      <h1>Welcome to Your Dashboard</h1>
      <div>
        <button onClick={() => setSelectedTable('TX1')}>TX1</button>
        <button onClick={() => setSelectedTable('CA1')}>CA1</button>
        <button onClick={() => setSelectedTable('CA4')}>CA4</button>
        <button onClick={() => setSelectedTable('SC1')}>SC1</button>
      </div>
      {selectedTable && <TableDisplay tableName={selectedTable} />}
    </div>
  );
};

function App() {
  return (
    <Router>
      <div className="App">
        <nav className="navbar navbar-expand-lg navbar-light fixed-top">
          <div className="container">
            <img className="photo" src={logo} width={75} height={50} alt='Ruiz Foods'/>;
            <div className="collapse navbar-collapse" id="navbarTogglerDemo02">
              <ul className="navbar-nav ml-auto">
                <li className="nav-item">
                  <Link className="nav-link" to={'/log-in'}>
                    Login
                  </Link>
                </li>
                <li className="nav-item">
                  <Link className="nav-link" to={'/sign-up'}>
                    Sign up
                  </Link>
                </li>
              </ul>
            </div>
          </div>
        </nav>
        <div className="auth-wrapper">
          <div className="auth-inner">
          <Routes>
            <Route path="/" element={<Navigate replace to="/log-in" />} />
            <Route path="/log-in" element={<Login />} />
            <Route path="/sign-up" element={<SignUp />} />
            <Route path="/dashboard" element={<Dashboard />} />
          </Routes>
          </div>
        </div>
      </div>
    </Router>
  )
}

export default App