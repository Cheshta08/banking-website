import React, { useState, useRef, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import './emailverify.css';
import { useNavigate } from 'react-router-dom';

import Flatpickr from 'react-flatpickr';
import 'flatpickr/dist/flatpickr.min.css';

const EmailVerification = () => {
    const navigate = useNavigate();

    const [email, setEmail] = useState('');
    const [phone, setPhone] = useState('');
    const { userId } = useParams();

    const [otp, setOtp] = useState('');
    const [correctOtp, setCorrectOtp] = useState('');
    const [showOtpInput, setShowOtpInput] = useState(false);
    const [showPhoneOtpInput, setShowPhoneOtpInput] = useState(false);
    
    const [progress, setProgress] = useState(0);
    const [isVerified, setIsVerified] = useState(false);
    const [showResend, setShowResend] = useState(false);
    const [isPhoneVerified, setIsPhoneVerified] = useState(false);
    const [showPhoneResend, setShowPhoneResend] = useState(false);

    const phoneContainerRef = useRef(null); // Ref for scrolling

    useEffect(() => {
        // Scroll to phone container when isVerified becomes true
        if (isVerified && phoneContainerRef.current) {
            phoneContainerRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
    }, [isVerified]);

    const sendOTP = async () => {
        if (email) {
            try {
                const response = await fetch(`http://localhost:5000/send-email`, {
                    method: "POST",
                    headers: {
                        "Content-type": "application/json",
                    },
                    body: JSON.stringify({ email: email }),
                });
                const data = await response.json();
                setCorrectOtp(data.otp);

                setShowOtpInput(true);
                setShowResend(true);
            } catch (error) {
                console.error('There was an error submitting the form!', error);
            }
        } else {
            alert('Please enter a valid email');
        }
    };

    const sendPhoneOTP = async () => {
        if (phone) {
            try {
                const response = await fetch(`http://localhost:5000/send-otp`, {
                    method: "POST",
                    headers: {
                        "Content-type": "application/json",
                    },
                    body: JSON.stringify({ phone: phone }),
                });
                const data = await response.json();
                setCorrectOtp(data.otp);

                setShowPhoneOtpInput(true);
                setShowPhoneResend(true);
            } catch (error) {
                console.error('There was an error submitting the form!', error);
            }
        } else {
            alert('Please enter a valid phone number');
        }
    };
   
    const verifyEmailOTP = async () => {
        if (otp == correctOtp) {
            setIsVerified(true);
            setOtp('');
            setProgress(50);
            alert('OTP Verified Successfully');
        } else {
            alert('Invalid OTP. Please try again.');
        }
    };

    const verifyPhoneOTP = async () => {
        if (otp == correctOtp) {
            setIsPhoneVerified(true);
            setProgress(100);
            try {
                const response = await fetch(`http://localhost:5000/user/${userId}`, {
                    method: "PATCH",
                    headers: {
                        "Content-type": "application/json",
                    },
                    body: JSON.stringify({ contact:{
                        email: email,
                        phoneNumber: phone
                    } }),
                });
                console.log(response);
                navigate(`/employment-details/${userId}`);
            } catch (error) {
                console.error('There was an error submitting the form!', error);
            }
            alert('OTP Verified Successfully');
        } else {
            alert('Invalid OTP. Please try again.');
        }
    };
    
    const resendOTP = () => {
        setShowResend(false);
        sendOTP();
    };

    const resendPhoneOTP = () => {
        setShowPhoneResend(false);
        sendPhoneOTP();
    };

    return (
        <>
            <div className="progress-container">
                <div className="progress-bars">
                    <div className="progress-section">
                        <div className={`progress-bar ${progress >= 50 ? 'filled' : ''}`} id="progress-bar-1">
                            <div className="progress" id="progress1" style={{ width: '100%' }}></div>
                        </div>
                        <label htmlFor="progress1">Personal Details</label>
                    </div>
                    <div className="progress-section">
                        <div className={`progress-bar`} id="progress-bar-2">
                            <div className="progress" id="progress2" style={{ width: `${progress}% ` }}></div>
                        </div>
                        <label htmlFor="progress2">Contact Info</label>
                    </div>
                    <div className="progress-section">
                        <div className={`progress-bar`} id="progress-bar-3">
                            <div className="progress" id="progress3" style={{ width: '0%' }}></div>
                        </div>
                        <label htmlFor="progress3">Other Info</label>
                    </div>
                </div>
            </div>

            <div className="form-container">
                <div className="model">
                    <h1>Email Verification</h1>
                    <input
                        type="email"
                        placeholder="Enter a valid email address..."
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                    />
                    {showOtpInput && !isVerified && (
                        <div className="otp-verify">
                            <input
                                type="text"
                                placeholder="Enter OTP..."
                                value={otp}
                                onChange={(e) => setOtp(e.target.value)}
                            />
                            <button onClick={verifyEmailOTP}>Verify OTP</button>
                        </div>
                    )}
                    {!isVerified && !showResend && <button onClick={sendOTP}>Send OTP</button>}
                    {showResend && !isVerified && (
                        <div>
                            <p>Didn't receive OTP? <button onClick={resendOTP}>Resend OTP</button></p>
                        </div>
                    )}
                    {isVerified && <div>Email Address verified successfully!</div>}
                </div>
            </div>

            {isVerified && (
                <div className="phone-container" ref={phoneContainerRef}>
                    <div className="phone">
                        <h1>Phone Number Verification</h1>
                        <input
                            type="text"
                            placeholder="Enter Phone Number..."
                            value={phone}
                            onChange={(e) => setPhone(e.target.value)}
                        />
                        {showPhoneOtpInput && !isPhoneVerified && (
                            <div className="otp-verify">
                                <input
                                    type="text"
                                    placeholder="Enter OTP..."
                                    value={otp}
                                    onChange={(e) => setOtp(e.target.value)}
                                />
                                <button onClick={verifyPhoneOTP}>Verify OTP</button>
                            </div>
                        )}
                        {!isPhoneVerified && !showPhoneResend && <button onClick={sendPhoneOTP}>Send OTP</button>}
                        {showPhoneResend && !isPhoneVerified && (
                            <div>
                                <p>Didn't receive OTP? <button onClick={resendPhoneOTP}>Resend OTP</button></p>
                            </div>
                        )}
                        {isPhoneVerified && <div>Phone number verified successfully!</div>}
                    </div>
                </div>
            )}
        </>
    );
}

export default EmailVerification;
