import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './forgot-password.css';

const ForgotPassword = () => {
    const Navigate=useNavigate();
    const [step, setStep] = useState(1);
    const [email, setEmail] = useState('');
    const [otp, setOtp] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [passwordErrors, setPasswordErrors] = useState([]);
    const [correctOtp, setCorrectOtp] = useState('');

    const handleEmailSubmit = async (e) => {
        e.preventDefault();
        if (email) {
            try {
                const response = await fetch(`https://banking-website-backend-1.vercel.app/verify-email`, {
                    method: "POST",
                    headers: {
                        "Content-type": "application/json",
                    },
                    body: JSON.stringify({ email: email }),
                });
                if (!response.ok) {
                    alert('Invalid email entered');
                } else {
                    const data = await response.json();
                    alert('OTP sent successfully!!')
                    setCorrectOtp(data.otp);
                    setStep(2);
                }
            } catch (error) {
                console.error('There was an error submitting the form!', error);
            }
        } else {
            alert('Please enter a valid email');
        }
    };

    const handleOtpSubmit = async (e) => {
        e.preventDefault();
        if (otp == correctOtp) {
            alert('Email verified');
            setStep(3);
        } else {
            alert('Invalid OTP');
        }
    };

    const handleResendOtp = async () => {
        if (email) {
            try {
                const response = await fetch(`https://banking-website-backend-1.vercel.app/verify-email`, {
                    method: "POST",
                    headers: {
                        "Content-type": "application/json",
                    },
                    body: JSON.stringify({ email: email }),
                });
                if (!response.ok) {
                    alert('Invalid email entered');
                } else {
                    const data = await response.json();
                    setCorrectOtp(data.otp);
                    alert('OTP has been resent to your email');
                }
            } catch (error) {
                console.error('There was an error resending the OTP!', error);
            }
        } else {
            alert('Please enter a valid email');
        }
    };

    const validatePassword = (password) => {
        const errors = [];
        if (password.length < 8) {
            errors.push('Password must be at least 8 characters long.');
        }
        if (!/[A-Z]/.test(password)) {
            errors.push('Password must contain at least one uppercase letter.');
        }
        if (!/[a-z]/.test(password)) {
            errors.push('Password must contain at least one lowercase letter.');
        }
        if (!/[0-9]/.test(password)) {
            errors.push('Password must contain at least one number.');
        }
        if (!/[!@#$%^&*]/.test(password)) {
            errors.push('Password must contain at least one special character (!@#$%^&*).');
        }
        return errors;
    };

    const handlePasswordSubmit = async (e) => {
        e.preventDefault();
        const errors = validatePassword(newPassword);
        setPasswordErrors(errors);

        if (errors.length === 0 && newPassword === confirmPassword) { 
            console.log('Set new password for:', email);
            try {
                const response = await fetch(`https://banking-website-backend-1.vercel.app/forgot-password`, {
                    method: "PATCH",
                    headers: {
                        "Content-type": "application/json",
                    },
                    body: JSON.stringify({ email: email, password:newPassword }),
                });
                if (!response.ok) {
                    alert('Invalid details entered');
                } else {
                    alert('Password reset successful!.....Moving to home page for login');
                    Navigate(`/`)
                    
                }
            } catch (error) {
                console.error('There was an error!', error);
            }

        } else if (newPassword !== confirmPassword) {
            alert('Passwords do not match!');
        }
    };

    return (
        <div className="forgot-password-container">
            {step === 1 && (
                <form onSubmit={handleEmailSubmit} className="forgot-password-form">
                    <h1>Email Verification</h1>
                    <div className="f-form-group">
                        <label htmlFor="email">Enter the registered Email Address:</label>
                        <input
                            type="email"
                            id="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                        />
                    </div>
                    <button type="submit">Send OTP</button>
                    <div className="forgot-password-options">
                        <span>Don't have an account? <Link to="/">Register here</Link></span>
                    </div>
                </form>
            )}

            {step === 2 && (
                <form onSubmit={handleOtpSubmit} className="forgot-password-form">
                    <h1>Enter OTP</h1>
                    <div className="f-form-group">
                        <label htmlFor="otp">OTP:</label>
                        <input
                            type="text"
                            id="otp"
                            value={otp}
                            onChange={(e) => setOtp(e.target.value)}
                            required
                        />
                    </div>
                    <button type="submit">Verify OTP</button>
                    
                    <span>Didn't receive OTP? <button onClick={handleResendOtp}>Resend OTP</button></span>
                    
                </form>
            )}

            {step === 3 && (
                <form onSubmit={handlePasswordSubmit} className="forgot-password-form">
                    <h1>Set New Password</h1>
                    <div className="f-form-group">
                        <label htmlFor="newPassword">New Password:</label>
                        <input
                            type="password"
                            id="newPassword"
                            value={newPassword}
                            onChange={(e) => setNewPassword(e.target.value)}
                            required
                        />
                    </div>
                    <div className="f-form-group">
                        <label htmlFor="confirmPassword">Confirm New Password:</label>
                        <input
                            type="password"
                            id="confirmPassword"
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                            required
                        />
                    </div>
                    {passwordErrors.length > 0 && (
                        <ul className="password-errors">
                            {passwordErrors.map((error, index) => (
                                <li key={index}>{error}</li>
                            ))}
                        </ul>
                    )}
                    <button type="submit">Reset Password</button>
                </form>
            )}

            
        </div>
    );
};

export default ForgotPassword;
