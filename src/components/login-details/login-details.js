import React, { useState } from 'react';
import './login-details.css';
import { useParams,useNavigate } from 'react-router-dom';
import { Tooltip } from 'react-tooltip';

function LoginDetails() {
    const navigate = useNavigate();
  const { userId } = useParams();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [errors, setErrors] = useState({});
  
  
  const handleSubmit = async (e) => {
    e.preventDefault();

    const newErrors = {};

    if (username.length < 8 || username.length > 16) {
      newErrors.username = 'Username must be between 8 and 16 characters';
    }

    if (!/^[a-zA-Z0-9]+$/.test(username)) {
      newErrors.username = 'Username must contain only letters and numbers';
    }

    if (password.length < 8 || password.length > 16) {
      newErrors.password = 'Password must be between 8 and 16 characters';
    }

    if (!/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[a-zA-Z\d@$!%*?&]{8,}$/.test(password)) {
      newErrors.password = 'Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character';
    }

    if (password !== confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }

    setErrors(newErrors);

    if (Object.keys(newErrors).length === 0) {
      try {
        const response = await fetch(`http://localhost:5000/loginDetails/${userId}`, {
          method: "PATCH",
          headers: {
            "Content-type": "application/json",
          },
          body: JSON.stringify({
            login_details: {
              username: username,
              password: password
            }
          }),
        });
        console.log(response);
        navigate(`/registration-success/${userId}`);
      } catch (error) {
        console.error('There was an error submitting the form!', error);
      }
      alert('Form submitted successfully');
    }
  };
  

  return (
    <div className="login-container">
      <form onSubmit={handleSubmit} className="login-form">
        <h2>Fill in your Login Details</h2>
        <div className="login-form-group">
          <label htmlFor="username">Username:</label>
          <input
            type="text"
            id="username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            data-tip="Username must be between 8 and 16 characters, and contain only letters and numbers"
          />
          <Tooltip place="right" type="dark" effect="solid" />
          {errors.username && <span className="error">{errors.username}</span>}
        </div>
        <div className="login-form-group">
          <label htmlFor="password">Password:</label>
          <input
            type="password"
            id="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            data-tip="Password must be between 8 and 16 characters, and contain at least one uppercase letter, one lowercase letter, one number, and one special character"
          />
          <Tooltip place="right" type="dark" effect="solid" />
          {errors.password && <span className="error">{errors.password}</span>}
        </div>
        <div className="login-form-group">
          <label htmlFor="confirmPassword">Confirm Password:</label>
          <input
            type="password"
            id="confirmPassword"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            data-tip="Must match the password"
          />
          <Tooltip place="right" type="dark" effect="solid" />
          {errors.confirmPassword && <span className="error">{errors.confirmPassword}</span>}
        </div>
        <button type="submit">Submit</button>

         {/* Modal component to show registration success */}
      
      </form>
    </div>
  );
}

export default LoginDetails;
