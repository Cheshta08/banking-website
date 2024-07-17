import React, { useState } from 'react';
import ChangePasswordPopup from './change-password';
import { useParams} from 'react-router-dom';

const PrivacyAndSecurity = () => {
    const {userId}=useParams();
  const [showPopup, setShowPopup] = useState(false);

  const togglePopup = () => {
    setShowPopup(!showPopup);
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100 p-6">
      <div className="bg-white p-8 rounded shadow-lg w-full max-w-md">
        <h1 className="text-3xl font-bold text-center mb-6 text-gray-800">Privacy and Security</h1>
        <button
          onClick={togglePopup}
          className="bg-blue-500 text-white w-full py-2 rounded hover:bg-blue-600 transition duration-200"
        >
          Change Password
        </button>

        {showPopup && <ChangePasswordPopup  userId={userId}  togglePopup={togglePopup} />}
      </div>
    </div>
  );
};

export default PrivacyAndSecurity;
