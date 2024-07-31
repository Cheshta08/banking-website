import React, { useState,useRef } from 'react';
import ReactDOM from 'react-dom';
import Flatpickr from 'react-flatpickr';
import 'flatpickr/dist/flatpickr.min.css';
import { useNavigate } from 'react-router-dom';


import ScrollToBottom, { useScrollToBottom, useSticky } from 'react-scroll-to-bottom';
import './PDindex.css'
const PD = () => {
  const navigate = useNavigate();
 
  const [formData, setFormData] = useState({
    firstName: '',
    middleName: '',
    lastName: '',
    dob: ''
  });
  const [userId, setUserId] = useState('');
  const scrollToBottom = useScrollToBottom();
  const [progress, setProgress] = useState(0);

  const handleChange = (e) => {
    const { id, value } = e.target;
    setFormData({ ...formData, [id]: value });
  };

  const handleDateChange = (date) => {
    setFormData({ ...formData, dob: date[0] });
  };

  const is18YearsOldOrAbove = (dob) => {
    const today = new Date();
    const birthDate = new Date(dob);
    const age = today.getFullYear() - birthDate.getFullYear();
    const monthDifference = today.getMonth() - birthDate.getMonth();
    if (monthDifference < 0 || (monthDifference === 0 && today.getDate() < birthDate.getDate())) {
      return age - 1;
    }
    return age;
  };
  function formatDate(date) {
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const year = date.getFullYear();
  
    return `${day}/${month}/${year}`;
  }
 const bottomRef = useRef(null)
  const handleSubmitPersonal = (e) => {
    e.preventDefault();
    if (formData.firstName && formData.lastName && formData.dob) {
      const age = is18YearsOldOrAbove(formData.dob);
      if (age >= 18) {
        setProgress(50);
         // Fill the progress bar to 50%
         formData.dob=formatDate(formData.dob)
        Setvisible(true)
       setTimeout(() => {
        window.scrollTo({ top: document.body.scrollHeight, behavior: 'smooth' });
       }, 1000);
      } else {
        alert('You must be 18 years or older.');
        
      }
    } else {
      alert('Please fill in all required fields.');
    }
  };  const [livedDuration, setLivedDuration] = useState('');
  const [isManualPopupVisible, setManualPopupVisible] = useState(false);
  const [isChangePopupVisible, setChangePopupVisible] = useState(false);
  const [query, setQuery] = useState('');
  const [addresses, setAddresses] = useState([]);
  const [selectedAddress, setSelectedAddress] = useState(null);

  const API_KEY = process.env.REACT_APP_API_KEY;

  const handleSearch = async (e) => {
    const value = e.target.value;
    setQuery(value);

    if (value.length > 2) {
      try {
        const url = 'https://api.everythinglocation.com/address/complete';
        const params = new URLSearchParams({
          lqtkey: API_KEY,
          query: value,
          country: 'USA'
        });

        const response = await fetch(`${url}?${params.toString()}`);
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        const data = await response.json();
        setAddresses(data.metadata);
      } catch (error) {
        console.log(error);
      }
    } else {
      setAddresses([]);
    }
  };

  const handleSelectAddress = (address) => {
    setSelectedAddress(address);
    setQuery('');
    setAddresses([]);
  };

  const [manualAddress, setManualAddress] = useState({
    houseName: '',
    houseNumber: '',
    streetName: '',
    townCity: '',
    postcode: ''
  });
  const [changeAddress, setChangeAddress] = useState({
    houseName: '',
    houseNumber: '',
    streetName: '',
    townCity: '',
    postcode: ''
  });
  const [manualErrors, setManualErrors] = useState({
    houseName: '',
    houseNumber: '',
    streetName: '',
    townCity: '',
    postcode: ''
  });
  const [changeErrors, setChangeErrors] = useState({
    houseName: '',
    houseNumber: '',
    streetName: '',
    townCity: '',
    postcode: ''
  });

  const handleAddressChange = (event) => {
    setSelectedAddress(event.target.value);
  };

  const handleDurationChange = (event) => {
    setLivedDuration(event.target.value);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    let isValid = true;

    if (!selectedAddress) {
      isValid = false;
    }
    if (!livedDuration) {
      isValid = false;
    }

    if (isValid) {
      
      const userData = {
        personal:formData,
        address: {
          premise: selectedAddress.Premise,
          thoroughfare: selectedAddress.Thoroughfare,
          locality: selectedAddress.Locality,
          postalCode: selectedAddress.PostalCode,
          livedDuration: livedDuration,
        },
      };
      console.log(userData)

      try {
        const response = await fetch("https://banking-website-backend-1.vercel.app/user", {
            method: "POST",
            headers: {
              "Content-type": "application/json",
            },
            body: JSON.stringify(userData),
          });
          
          if (!response.ok) {
            // Handle error if fetch request fails
            console.error('Failed to fetch:', response.statusText);
          } else {
            const data = await response.json(); // Parse response body as JSON
            console.log(data); // Check what data you received from the server
          
            // Assuming the server response is { id: savedUser._id }
            setUserId(data.id); 
            console.log(userId)// Update state with the received ID

            setProgress(100)
      navigate(`/email-verification/${data.id}`);
          }

      } catch (error) {
        console.error('There was an error submitting the form!', error);
      }

      
      
    } else {
      alert('Please fill out all fields.');
    }
  };

  const toggleManualPopup = () => {
    setManualAddress({
      houseNumber: '',
      streetName: '',
      townCity: '',
      postcode: '',
      houseName: '' // Assuming house number is not part of selected address
    });
    setTimeout(() => {
      window.scrollTo({ top: document.body.scrollHeight, behavior: 'smooth' });
     }, 300);
    setManualPopupVisible(!isManualPopupVisible);
  };

  const toggleChangePopup = () => {
    if (!selectedAddress) {
      alert('Please select an address first.');
      return;
    }
    // const addressParts = selectedAddress.split(', ');
    if (selectedAddress.length < 5) {
      alert('Invalid address format.');
      return;
    }
    setChangeAddress({
      houseNumber: selectedAddress.Premise,
      streetName: selectedAddress.Thoroughfare,
      townCity: selectedAddress.Locality,
      postcode: selectedAddress.PostalCode,
      houseName: selectedAddress.Name // Assuming house number is not part of selected address
    });
    setChangePopupVisible(!isChangePopupVisible);
  };

  const handleManualAddressSubmit = (event) => {
    event.preventDefault();
    let isValid = true;
    const errors = {
      houseName: '',
      houseNumber: '',
      streetName: '',
      townCity: '',
      postcode: ''
    };

    if (!manualAddress.houseName) {
      isValid = false;
      errors.houseName = 'House or Building Name is required.';
    }
    if (!manualAddress.houseNumber) {
      isValid = false;
      errors.houseNumber = 'House or Building Number is required.';
    }
    if (!manualAddress.streetName) {
      isValid = false;
      errors.streetName = 'Street Name is required.';
    }
    if (!manualAddress.townCity) {
      isValid = false;
      errors.townCity = 'Town or City is required.';
    }
    if (!manualAddress.postcode) {
      isValid = false;
      errors.postcode = 'Postcode is required.';
    }

    if (isValid) {
      alert('Manual address submitted successfully!');
      setSelectedAddress({
        Premise: manualAddress.houseNumber,
        Name: manualAddress.houseName,
        Thoroughfare: manualAddress.streetName,
        Locality: manualAddress.townCity,
        PostalCode: manualAddress.postcode
      });
      setManualPopupVisible(false);
    } else {
      setManualErrors(errors);
    }
  };

  const handleChangeAddressSubmit = (event) => {
    event.preventDefault();
    let isValid = true;
    const errors = {
      houseName: '',
      houseNumber: '',
      streetName: '',
      townCity: '',
      postcode: ''
    };

    if (!changeAddress.houseName) {
      isValid = false;
      errors.houseName = 'House or Building Name is required.';
    }
    if (!changeAddress.houseNumber) {
      isValid = false;
      errors.houseNumber = 'House or Building Number is required.';
    }
    if (!changeAddress.streetName) {
      isValid = false;
      errors.streetName = 'Street Name is required.';
    }
    if (!changeAddress.townCity) {
      isValid = false;
      errors.townCity = 'Town or City is required.';
    }
    if (!changeAddress.postcode) {
      isValid = false;
      errors.postcode = 'Postcode is required.';
    }

    if (isValid) {
      alert('Address changed successfully!');
      setSelectedAddress({
        Premise: changeAddress.houseNumber,
        Name: changeAddress.houseName,
        Thoroughfare: changeAddress.streetName,
        Locality: changeAddress.townCity,
        PostalCode: changeAddress.postcode
      });
      setChangePopupVisible(false);
    } else {
      setChangeErrors(errors);
    }
  };

  const handleRemoveAddress = () => {
    setSelectedAddress(null);
  }
const [visible,Setvisible] = useState(false)

  return (
   <> <div>
      <div className="progress-bars">
        <div className="progress-section">
          <div className={`progress-bar ${progress >= 50 ? 'filled' : ''}`} id="progress-bar-1">
            <div className="progress" id="progress1" style={{ width: `${progress}%` }}></div>
          </div>
          <label htmlFor="progress1">Personal Details</label>
        </div>
        <div className="progress-section">
          <div className={`progress-bar`} id="progress-bar-2">
            <div className="progress" id="progress2" style={{ width: '0%' }}></div>
          </div>
          <label htmlFor="progress2">Account Info</label>
        </div>
        <div className="progress-section">
          <div className={`progress-bar`} id="progress-bar-3">
            <div className="progress" id="progress3" style={{ width: '0%' }}></div>
          </div>
          <label htmlFor="progress3">Other Info</label>
        </div>
      </div>
      <br /><br /><br /><br /><br />
      <div className="text" id="journey-text">
        <div className="text1">Your savings journey starts from here</div>
        <br />
        <div className="text2">Set up your <span style={{ color: 'purple' }}>Easy access account</span></div>
      </div>
      <hr style={{ width: '50%', margin: '15px auto' }} />

      <div className="details-container">
        <div className="box">
          <form id="personal-form" onSubmit={handleSubmitPersonal}>
            <div className="header">
              <div className="num">01</div>
              <div className="per">Personal Details</div>
            </div>
            <br />
            <p>Tell us a bit about yourself</p>
            <br />
            <div className="form-group">
              <label htmlFor="firstName">First Name</label>
              <input
                type="text"
                id="firstName"
                placeholder="First Name"
                value={formData.firstName}
                onChange={handleChange}
                required
              />
            </div>
            <div className="form-group">
              <label htmlFor="middleName">Middle Name (Optional)</label>
              <input
                type="text"
                id="middleName"
                placeholder="Middle Name"
                value={formData.middleName}
                onChange={handleChange}
              />
            </div>
            <div className="form-group">
              <label htmlFor="lastName">Last Name</label>
              <input
                type="text"
                id="lastName"
                placeholder="Last Name"
                value={formData.lastName}
                onChange={handleChange}
                required
              />
            </div>
            <div className="form-group">
              <label htmlFor="dob">Date Of Birth</label>
              <Flatpickr
                id="dob"
                value={formData.dob}
                onChange={handleDateChange}
                options={{ dateFormat: 'd-m-Y' }}
                placeholder="DD-MM-YYYY"
                required
              />
            </div>
            <button type="submit" className="btn"  >Continue</button>
          </form>
        </div>
      </div>
    </div>
    <div ref={bottomRef}>
    {visible&&<div className="max-w-4xl mx-auto my-20 bg-blue-50 p-16 rounded-lg shadow-lg relative">
      <h1 className="text-2xl font-bold text-left mb-4">Home Address</h1>
      <p className="text-left mb-4 text-gray-800">Please provide your current India Home Address:</p>
      <hr className="mb-4" />

      <div className="mb-4">

        {!selectedAddress ? (
          <>
            <div className="search-container flex flex-col w-[350px]">
              <input type="search" value={query} className="input bg-white text-[#242424] py-1 px-2 min-h-[40px] rounded-md outline-none leading-[1.15] shadow-[0px_10px_20px_-18px_rgba(0,0,0,0.1)] mt-[10px] border-2 border-[rgb(182,182,182)] border-solid" placeholder="Enter Address" onChange={handleSearch} autoComplete="off" />
            </div>
            {addresses.length > 2 && (
              <ul className="search-wrap absolute rounded-lg bg-[rgb(253,253,253)] mt-0 pt-1 pb-1 max-h-[150px] shadow-lg overflow-y-auto flex flex-col w-[350px]">
                {addresses.map((address, index) => (
                  <li key={index} onClick={() => handleSelectAddress(address)} className="search-result flex relative bg-[rgb(253,253,253)] p-1 rounded-lg h-auto font-[Gill Sans] text-[#464646] cursor-pointer">
                    {address.Premise} {address.Thoroughfare} {address.Locality} {address.PostalCode}
                  </li>
                ))}
              </ul>
            )}
          </>
        ) : (
          <>

            <div id="selectedAddress" className="w-full p-2 border border-gray-300 rounded mt-2 whitespace-pre-line flex flex-row-reverse justify-between">
              <div className="hover:underline cursor-pointer" onClick={handleRemoveAddress}>
                Remove Address
              </div>

              Address: {selectedAddress.Premise} {selectedAddress.Name} {selectedAddress.Thoroughfare} {selectedAddress.Locality} {selectedAddress.PostalCode}{"\n"}Lived Duration: {livedDuration}

            </div>

            <a href="#" id="changeAddressLink" className="block text-left mt-4 text-blue-500 hover:underline" onClick={toggleChangePopup}>Change Address</a>
          </>
        )}
      </div>

      {!selectedAddress && (
        <>
          <p id="manualEntryText" className="text-left mb-4 text-red-500">
            Please select an address or enter manually using the link below:
          </p>
          <a href="#" id="manualEntryLink" className="block text-left text-blue-500 hover:underline mb-4" onClick={toggleManualPopup}>
            Prefer to enter address manually
          </a>
        </>
      )}

      <hr className="mb-4" />

      <div className="mb-4">
        <label htmlFor="livedDuration" className="block text-gray-700 text-left mb-4">How long have You lived at This Address?</label>
        <select id="livedDuration" name="livedDuration" className="w-full p-2 border border-gray-300 rounded mt-2" value={livedDuration} onChange={handleDurationChange}>
          <option value="">Select</option>
          <option value="6months">6 months</option>
          <option value="less6months">Less than 6 months</option>
          <option value="morethan6months">more than 6 months</option>
        </select>
      </div>

      <button id="submitButton" className="bg-blue-500 text-white p-2 rounded" onClick={handleSubmit}>Submit</button>

      <p className="text-sm text-gray-600 mt-4 text-center">
        Please check your details above. You won't be able to change it once submitted.
      </p>

      {isManualPopupVisible && (
        <div id="popupFormManual" className="fixed inset-0 bg-gray-800 bg-opacity-50 flex items-center justify-center">
          <div className="bg-white p-8 rounded shadow-lg max-w-md w-full relative " style={{ width: '80%' }}>
            <button id="closeButtonManual" className="absolute top-2 right-2 text-gray-500 hover:text-gray-700" onClick={toggleManualPopup}>&times;</button>
            <h2 className="text-xl font-bold mb-4">Enter Address Manually</h2>
            <form id="manualAddressForm" onSubmit={handleManualAddressSubmit}>
              <div className="mb-4">
                <label htmlFor="houseBuildingNameManual" className="block text-gray-700">House or Building Name:</label>
                <input
                  type="text"
                  id="houseBuildingNameManual"
                  name="houseBuildingNameManual"
                  className={`w-full p-2 border border-gray-300 rounded mt-2 ${manualErrors.houseName ? 'border-red-500' : ''}`}
                  value={manualAddress.houseName}
                  onChange={(e) => setManualAddress({ ...manualAddress, houseName: e.target.value })}
                />
                {manualErrors.houseName && (
                  <p className="text-red-500 text-sm mt-1">{manualErrors.houseName}</p>
                )}
              </div>
              <div className="mb-4">
                <label htmlFor="houseBuildingNumberManual" className="block text-gray-700">House or Building Number:</label>
                <input
                  type="text"
                  id="houseBuildingNumberManual"
                  name="houseBuildingNumberManual"
                  className={`w-full p-2 border border-gray-300 rounded mt-2 ${manualErrors.houseNumber ? 'border-red-500' : ''}`}
                  value={manualAddress.houseNumber}
                  onChange={(e) => setManualAddress({ ...manualAddress, houseNumber: e.target.value })}
                />
                {manualErrors.houseNumber && (
                  <p className="text-red-500 text-sm mt-1">{manualErrors.houseNumber}</p>
                )}
              </div>
              <div className="mb-4">
                <label htmlFor="streetNameManual" className="block text-gray-700">Street Name:</label>
                <input
                  type="text"
                  id="streetNameManual"
                  name="streetNameManual"
                  className={`w-full p-2 border border-gray-300 rounded mt-2 ${manualErrors.streetName ? 'border-red-500' : ''}`}
                  value={manualAddress.streetName}
                  onChange={(e) => setManualAddress({ ...manualAddress, streetName: e.target.value })}
                />
                {manualErrors.streetName && (
                  <p className="text-red-500 text-sm mt-1">{manualErrors.streetName}</p>
                )}
              </div>
              <div className="mb-4">
                <label htmlFor="townCityManual" className="block text-gray-700">Town or City:</label>
                <input
                  type="text"
                  id="townCityManual"
                  name="townCityManual"
                  className={`w-full p-2 border border-gray-300 rounded mt-2 ${manualErrors.townCity ? 'border-red-500' : ''}`}
                  value={manualAddress.townCity}
                  onChange={(e) => setManualAddress({ ...manualAddress, townCity: e.target.value })}
                />
                {manualErrors.townCity && (
                  <p className="text-red-500 text-sm mt-1">{manualErrors.townCity}</p>
                )}
              </div>
              <div className="mb-4">
                <label htmlFor="postcodeManual" className="block text-gray-700">Postcode:</label>
                <input
                  type="text"
                  id="postcodeManual"
                  name="postcodeManual"
                  className={`w-full p-2 border border-gray-300 rounded mt-2 ${manualErrors.postcode ? 'border-red-500' : ''}`}
                  value={manualAddress.postcode}
                  onChange={(e) => setManualAddress({ ...manualAddress, postcode: e.target.value })}
                />
                {manualErrors.postcode && (
                  <p className="text-red-500 text-sm mt-1">{manualErrors.postcode}</p>
                )}
              </div>
              <div className="flex justify-end">
                <button type="button" id="cancelButtonManual" className="bg-gray-300 text-gray-700 p-2 rounded mr-2" onClick={toggleManualPopup}>Cancel</button>
                <button type="submit" className="bg-blue-500 text-white p-2 rounded">Submit</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Change Address Popup */}
      {isChangePopupVisible && (
        <div id="popupFormChange" className="fixed inset-0 bg-gray-800 bg-opacity-50 flex items-center justify-center">
          <div className="bg-white p-8 rounded shadow-lg max-w-md w-full relative">
            <button id="closeButtonChange" className="absolute top-2 right-2 text-gray-500 hover:text-gray-700" onClick={toggleChangePopup}>&times;</button>
            <h2 className="text-xl font-bold mb-4">Change Address</h2>
            <form id="changeAddressForm" onSubmit={handleChangeAddressSubmit}>
              <div className="mb-4">
                <label htmlFor="houseBuildingNameChange" className="block text-gray-700">House or Building Name:</label>
                <input
                  type="text"
                  id="houseBuildingNameChange"
                  name="houseBuildingNameChange"
                  className={`w-full p-2 border border-gray-300 rounded mt-2 ${changeErrors.houseName ? 'border-red-500' : ''}`}
                  value={changeAddress.houseName}
                  onChange={(e) => setChangeAddress({ ...changeAddress, houseName: e.target.value })}
                />
                {changeErrors.houseName && (
                  <p className="text-red-500 text-sm mt-1">{changeErrors.houseName}</p>
                )}
              </div>
              <div className="mb-4">
                <label htmlFor="houseBuildingNumberChange" className="block text-gray-700">House or Building Number:</label>
                <input
                  type="text"
                  id="houseBuildingNumberChange"
                  name="houseBuildingNumberChange"
                  className={`w-full p-2 border border-gray-300 rounded mt-2 ${changeErrors.houseNumber ? 'border-red-500' : ''}`}
                  value={changeAddress.houseNumber}
                  onChange={(e) => setChangeAddress({ ...changeAddress, houseNumber: e.target.value })}
                />
                {changeErrors.houseNumber && (
                  <p className="text-red-500 text-sm mt-1">{changeErrors.houseNumber}</p>
                )}
              </div>
              <div className="mb-4">
                <label htmlFor="streetNameChange" className="block text-gray-700">Street Name:</label>
                <input
                  type="text"
                  id="streetNameChange"
                  name="streetNameChange"
                  className={`w-full p-2 border border-gray-300 rounded mt-2 ${changeErrors.streetName ? 'border-red-500' : ''}`}
                  value={changeAddress.streetName}
                  onChange={(e) => setChangeAddress({ ...changeAddress, streetName: e.target.value })}
                />
                {changeErrors.streetName && (
                  <p className="text-red-500 text-sm mt-1">{changeErrors.streetName}</p>
                )}
              </div>
              <div className="mb-4">
                <label htmlFor="townCityChange" className="block text-gray-700">Town or City:</label>
                <input
                  type="text"
                  id="townCityChange"
                  name="townCityChange"
                  className={`w-full p-2 border border-gray-300 rounded mt-2 ${changeErrors.townCity ? 'border-red-500' : ''}`}
                  value={changeAddress.townCity}
                  onChange={(e) => setChangeAddress({ ...changeAddress, townCity: e.target.value })}
                />
                {changeErrors.townCity && (
                  <p className="text-red-500 text-sm mt-1">{changeErrors.townCity}</p>
                )}
              </div>
              <div className="mb-4">
                <label htmlFor="postcodeChange" className="block text-gray-700">Postcode:</label>
                <input
                  type="text"
                  id="postcodeChange"
                  name="postcodeChange"
                  className={`w-full p-2 border border-gray-300 rounded mt-2 ${changeErrors.postcode ? 'border-red-500' : ''}`}
                  value={changeAddress.postcode}
                  onChange={(e) => setChangeAddress({ ...changeAddress, postcode: e.target.value })}
                />
                {changeErrors.postcode && (
                  <p className="text-red-500 text-sm mt-1">{changeErrors.postcode}</p>
                )}
              </div>
              <div className="flex justify-end">
                <button type="button" id="cancelButtonChange" className="bg-gray-300 text-gray-700 p-2 rounded mr-2" onClick={toggleChangePopup}>Cancel</button>
                <button type="submit" className="bg-blue-500 text-white p-2 rounded">Submit</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>}</div>
    </>
  );
};

// ReactDOM.render(<App />, document.getElementById('root'));

export default PD;
