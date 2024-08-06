import React, { useState } from 'react'
import axios from 'axios'
import { useNavigate } from 'react-router-dom'

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError('');
    try {
      const response = await axios.post('http://localhost:3001/login', { email, password });
      localStorage.setItem('token', response.data.token); // Store the token
      navigate('/dashboard'); // Redirect to dashboard
    } catch (error) {
      if (error.response) {
        setError(error.response.data.error);
      } else {
        setError('Login failed. Please try again.');
      }
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <h3>Log In</h3>
      <div className="mb-3">
        <label>Email address</label>
        <input
          type="email"
          className="form-control"
          value={email}
          onChange={e => setEmail(e.target.value)}
        />
      </div>
      <div className="mb-3">
        <label>Password</label>
        <input
          type="password"
          className="form-control"
          value={password}
          onChange={e => setPassword(e.target.value)}
        />
      </div>
      <div className="d-grid">
        <button type="submit" className="btn btn-primary">Submit</button>
      </div>
      {error && <div className="alert alert-danger">{error}</div>}
    </form>
  );
}