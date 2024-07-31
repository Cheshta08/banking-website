import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './login.css';

const Login = () => {
    const navigate=useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = async(e) => {
    e.preventDefault();

    if(email&&password)
    {
        try {
            const response = await fetch(`https://banking-website-backend-1.vercel.app/login`, {
                method: "POST",
                headers: {
                    "Content-type": "application/json",
                },
                body: JSON.stringify({  email: email, password:password
                    
                } ),
            });
            console.log(response);
            if(!response.ok)
            {
                alert("invalid credentials entered");

            }
            else
            {
                const data = await response.json(); // Parse response body as JSON
            console.log(data); // Check what data you received from the server
          
            // Assuming the server response is { id: savedUser._id }
        
            alert("Login Successful....Moving to next page....")
          

            navigate(`/account-info/${data.id}`);

            }
            
        } catch (error) {
            console.error('There was an error submitting the form!', error);
        }
        
    }
    else
    {
        alert('please fill in all the fields');
    }
    
  };

  return (
    <div className="logins-container">
       
      <form onSubmit={handleSubmit} className="logins-form">
        <h1> Login Form </h1>
        <div className="l-form-group">
          <label htmlFor="email">Email:</label>
          <input
            type="email"
            id="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>
        <div className="l-form-group">
          <label htmlFor="password">Password:</label>
          <input
            type="password"
            id="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>
        <button type="submit">Login</button>
        <div className="login-options">
          <Link to="/forgot-password">Forgot Password?</Link>
          <br></br>
          <span>Don't have an account? <Link to="/register">Register here</Link></span>
        </div>
      </form>
    </div>
  );
};

export default Login;
