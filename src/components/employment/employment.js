import React, { useState, useRef, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import './employment.css';
import { useNavigate } from 'react-router-dom';
 // Assuming you have the same CSS file

const EmploymentDetails = () => {
    const navigate = useNavigate();

    const { userId } = useParams();
    const citizenshipFormRef = useRef(null);
    console.log(userId);
    const [progress, setProgress] = useState(0);
    const [showCitizenshipForm,setShowCitizenshipForm]=useState('');
    const [activeTab, setActiveTab] = useState('');
    const [selectedIndustry, setSelectedIndustry] = useState('');
    const [selectedOccupation, setSelectedOccupation] = useState('');
    const [selectedIncome, setSelectedIncome] = useState('');
    const [industryDropdownVisible, setIndustryDropdownVisible] = useState(false);
    const [occupationDropdownVisible, setOccupationDropdownVisible] = useState(false);
    const [countries, setCountries] = useState([]);
    const [selectedNationality, setSelectedNationality] = useState([]);
    const [showOtherNationalities, setShowOtherNationalities] = useState(false);
    const [selectedTaxResidence, setSelectedTaxResidence] = useState([]);
    const [showOtherTaxResidences, setShowOtherTaxResidences] = useState(false);
    const [validationMessage, setValidationMessage] = useState('');
    
    const ENDPOINT = 'https://restcountries.com/v3.1/all';
    const ukFlag = "https://flagcdn.com/w320/gb.png";
    const usFlag = "https://flagcdn.com/w320/us.png";
    const nationalityRef = useRef(null);

    const selectedStyle = { backgroundColor: 'rgb(255 194 205)', border: 'solid 2px rgb(208 87 109)' };

    useEffect(() => {
        fetch(`${ENDPOINT}`)
            .then(response => response.json())
            .then(data => {
                const countryList = data.map(country => ({
                    name: country.name.common,
                    flag: country.flags.png,
                    code: country.cca2
                }));
                countryList.sort((a, b) => a.name.localeCompare(b.name));
                setCountries(countryList);
            })
            .catch(error => {
                console.error('Error fetching countries:', error);
            });
    }, []);

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (nationalityRef.current && !nationalityRef.current.contains(event.target)) {
                setShowOtherNationalities(false);
                setShowOtherTaxResidences(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);

        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [nationalityRef]);

    const handleNationalityChange = (value) => {
        if (value === "Others") {
            setShowOtherNationalities(true);
            setShowOtherTaxResidences(false);
        } else {
            setShowOtherNationalities(false);
            setSelectedNationality([{
                name: value,
                code: countries.find(country => country.name === value)?.code,
                flag: countries.find(country => country.name === value)?.flag
            }]);

        }
    };
    const handleTaxResidenceChange = (value) => {
        if (value === "Others") {
            setShowOtherNationalities(false);
            setShowOtherTaxResidences(true);
        } else {
            setShowOtherTaxResidences(false);
            setSelectedTaxResidence([{
                name: value,
                code: countries.find(country => country.name === value)?.code,
                flag: countries.find(country => country.name === value)?.flag
            }]);

        }
    };

    const handleCountrySelect = (countryName, type) => {
        const selectedCountry = countries.find(country => country.name === countryName);
        const updatedSelection = {
            name: selectedCountry.name,
            code: selectedCountry.code,
            flag: selectedCountry.flag
        };

        if (type === 'nationality') {
            setSelectedNationality(prevSelected => {
                const alreadySelected = prevSelected.some(country => country.name === countryName);
                if (alreadySelected) {
                    return prevSelected.filter(country => country.name !== countryName);
                } else {
                    return [updatedSelection];
                }
            });
            setShowOtherNationalities(false);
        }
        else {
            setSelectedTaxResidence(prevSelected => {
                const alreadySelected = prevSelected.some(country => country.name === countryName);
                if (alreadySelected) {
                    return prevSelected.filter(country => country.name !== countryName);
                } else {
                    return [updatedSelection];
                }
            });
            setShowOtherTaxResidences(false);
        }

    };

    const renderCountryOption = (country, type) => {
        const isSelected = type === 'nationality' ? selectedNationality.includes(country.name) : selectedTaxResidence.includes(country.name);

        return (
            <div className="flex w-[250px] mb-2.5" key={country.code} onClick={() => handleCountrySelect(country.name, type)}
                style={(
                    isSelected ? { ...selectedStyle } : {}
                )}
            >
                <div className="w-5 h-5 mx-[5px]">
                    <img src={country.flag} alt={country.name} className="h-5 w-5 rounded-[10px]"/>
                </div>
                <div className="cont-name">
                    {country.name}
                </div>
            </ div>

        );
    };

    const renderSelectedCountries = (selectedCountries) => {
        const uk = selectedCountries.some(sel => sel.name === "United Kingdom");
        const us = selectedCountries.some(sel => sel.name === "United States")
        if (!uk && !us) {
            return selectedCountries.map((country) => (
                <div className="flex text-sm bg-[white] h-auto w-auto justify-center cursor-pointer mr-[15px] mt-[15px] p-3 rounded-[22px] border-solid border-2 border-[rgb(181,181,181)] max-[768px]:h-auto w-auto mr-0"
                    key={country.code}
                    style={selectedNationality.some(sel => sel.name === country.name) || selectedTaxResidence.some(sel => sel.name === country.name) ? { ...selectedStyle } : {}}
                >
                    <div className="w-5 h-5 mx-[5px]">
                        <img src={country.flag} className="h-5 w-5 rounded-[10px]"/>
                    </div>
                    <div className="cont-name">
                        {country.name}
                    </div>
                </div>
            ));
        }
    };

    const handleContinue = async() => {
        if (selectedNationality.length === 0 || selectedTaxResidence.length === 0) {
            setValidationMessage('*Please select both nationality and tax residence.*');
        } else {
            setValidationMessage('');
            try{
                const response = await fetch(`https://banking-website-backend-1.vercel.app/user/${userId}`, {
                    method: 'PATCH',
                    headers: {
                        'Content-type': 'application/json',
                    },
                    body: JSON.stringify({
                        nationality: {
                            citizenship:selectedNationality[0],
                            tax_residence:selectedTaxResidence[0],

                        },
                        
                    }),
                });
                console.log(response);
                setProgress(100);
                navigate(`/document-upload/${userId}`);

            } catch (error) {
                console.error('There was an error submitting the form!', error);
            }

            
            
            alert('Moving to the next page...');
        }
    };


    const openTab = (tabName) => {
        setActiveTab(tabName);
    };

    const toggleDropdown = (type) => {
        if (type === 'industry') {
            setIndustryDropdownVisible(!industryDropdownVisible);
        } else if (type === 'occupation') {
            setOccupationDropdownVisible(!occupationDropdownVisible);
        }
    };

    const selectOption = (option, type) => {
        if (type === 'industry') {
            setSelectedIndustry(option);
            setIndustryDropdownVisible(false);
        } else if (type === 'occupation') {
            setSelectedOccupation(option);
            setOccupationDropdownVisible(false);
        }
    };

    const selectIncome = (income) => {
        setSelectedIncome(income);
    };

    const handleSubmit = async (event) => {
        event.preventDefault();
        let isValid = true;

        if (!activeTab) {
            isValid = false;
        }

        if (isValid) {
            try {
                // Send data to the server
                const response = await fetch(`https://banking-website-backend-1.vercel.app/user/${userId}`, {
                    method: 'PATCH',
                    headers: {
                        'Content-type': 'application/json',
                    },
                    body: JSON.stringify({
                        employment_details: {
                            status: activeTab,
                            industry: selectedIndustry,
                            occupation: selectedOccupation,
                            income: selectedIncome,
                        },
                    }),
                });
                console.log(response);
                setProgress(50);
                setShowCitizenshipForm(true);
                
            } catch (error) {
                console.error('There was an error submitting the form!', error);
            }
        } else {
            alert('Please select at least one employment status.');
        }
    };
    useEffect(() => {
        if (showCitizenshipForm) {
            scrollToCitizenshipForm();
        }
    }, [showCitizenshipForm]);
    
    const scrollToCitizenshipForm = () => {
        if (citizenshipFormRef.current) {
            citizenshipFormRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
    };
    
    const renderTabContent = () => {
        if (activeTab === 'Self-employed') {
            return (
                <div className={`tabcontent ${activeTab === 'Self-employed' ? 'active' : ''}`}>
                    <h3>What industry do you work in?</h3>
                    <p>Please select the closest option to your industry.</p>
                    <div className="dropdown">
                        <button className="dropbtn" onClick={() => toggleDropdown('industry')}>
                            {selectedIndustry || 'Select your industry'}
                            <span className="arrow">&#9662;</span>
                        </button>
                        {industryDropdownVisible && (
                            <div className="dropdown-content">
                                {['Agriculture', 'Manufacturing'].map((industry) => (
                                    <a key={industry} href="#" onClick={() => selectOption(industry, 'industry')}>
                                        {industry}
                                    </a>
                                ))}
                            </div>
                        )}
                    </div>

                    <h3>What's your occupation?</h3>
                    <p>Please select the closest option to your occupation.</p>
                    <div className="dropdown">
                        <button className="dropbtn" onClick={() => toggleDropdown('occupation')}>
                            {selectedOccupation || 'Select your occupation'}
                            <span className="arrow">&#9662;</span>
                        </button>
                        {occupationDropdownVisible && (
                            <div className="dropdown-content">
                                {['Farmer', 'Manufacturer'].map((occupation) => (
                                    <a key={occupation} href="#" onClick={() => selectOption(occupation, 'occupation')}>
                                        {occupation}
                                    </a>
                                ))}
                            </div>
                        )}
                    </div>

                    <h3>What's your annual income?</h3>
                    <p>This includes your salary, benefits, investments, or other income you may receive.</p>
                    <div className="annual-income-options">
                        {['£0-£24,999', '£25,000-£49,999', '£50,000-£99,999', '£100,000-£149,999', '£150,000+'].map((income) => (
                            <button
                                key={income}
                                onClick={() => selectIncome(income)}
                                className={selectedIncome === income ? 'active' : ''}
                            >
                                {income}
                            </button>
                        ))}
                    </div>
                </div>
            );
        } else if (['Full-time employed', 'Part-time employed', 'Retired', 'Student', 'Not in employment'].includes(activeTab)) {
            return (
                <div className={`tabcontent ${activeTab ? 'active' : ''}`}>
                    <h3>{activeTab}</h3>
                    <p>Please provide more details.</p>
                </div>
            );
        }
        return null;
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
                            <div className="progress" id="progress2" style={{ width: '100%' }}></div>
                        </div>
                        <label htmlFor="progress2">Contact Info</label>
                    </div>
                    <div className="progress-section">
                        <div className={`progress-bar`} id="progress-bar-3">
                            <div className="progress" id="progress3" style={{ width: `${progress}% ` }}></div>
                        </div>
                        <label htmlFor="progress3">Other Info</label>
                    </div>
                </div>
            </div>
            <br></br> <br></br>
            <br></br>

            <div className="emp-container">
                <div className="title-line">
                    <h3 className="number">07</h3>
                    <h3 className="details">Employment Details</h3>
                </div>
                <hr />
                <h3>What's your employment status?</h3>
                <p>We ask this in order to improve security on your account.</p>
                <div className="tab">
                    {['Full-time employed', 'Part-time employed', 'Self-employed', 'Retired', 'Student', 'Not in employment'].map((status) => (
                        <button
                            key={status}
                            className={`tablinks ${activeTab === status ? 'active' : ''}`}
                            onClick={() => openTab(status)}
                        >
                            {status}
                        </button>
                    ))}
                </div>

                {renderTabContent()}

                <div className="button-container">
                    <button className="continue-btn" onClick={handleSubmit}>
                        Continue
                    </button>
                </div>
            </div>
            { showCitizenshipForm &&<div ref={citizenshipFormRef} className='country-container'>
            <div className="flex flex-col mx-auto">
            <div className="flex relative h-[250px] w-[700px] shadow-[0px_0px_12px_-2px_lightgray] bg-[white] flex-col mt-[20px] mx-auto p-[30px] rounded-[20px] top-[40px] max-[768px]:w-[500px] p-[20px] h-auto">
                <div className="flex flex-row items-center text-xl font-semibold relative top-[5px] max-[768px]:text-[18px]"><p className="text-[rgb(208_87_109)] mr-[5px]">08.</p>Your Nationality/Citizenship</div>
                <hr className="w-auto opacity-[40%] relative mt-2.5 border-[solid] border-[#a8a8a8] top-[10px] max-[768px]:w-auto"/>
                <div className="relative top-[15px]">
                <p className="font-semibold mt-2.5 mb-[5px] max-[768px]:text-[14px]">What's you country of nationality/citizenship?</p>
                <p className="text-[#868686] mt-2.5 mb-[5px] max-[768px]:text-[14px]">Please select all that apply.</p>


                <div className="flex max-[768px]:flex-col items-start">
                    <div className="flex text-sm bg-[white] h-auto w-auto justify-center cursor-pointer mr-[15px] mt-[15px] p-3 rounded-[22px] border-solid border-2 border-[rgb(181,181,181)] max-[768px]:h-auto w-auto mr-0"
                        key='GB'
                        style={selectedNationality.some(sel => sel.name === "United Kingdom") ? { ...selectedStyle } : {}}
                        onClick={() => handleNationalityChange("United Kingdom")}
                    >
                        <div className="w-5 h-5 mx-[5px]">
                            <img src={ukFlag} className="h-5 w-5 rounded-[10px]"/>
                        </div>
                        <div className="cont-name">
                            United Kingdom
                        </div>
                    </div>

                    <div className="flex text-sm bg-[white] h-auto w-auto justify-center cursor-pointer mr-[15px] mt-[15px] p-3 rounded-[22px] border-solid border-2 border-[rgb(181,181,181)] max-[768px]:h-auto w-auto mr-0"
                        key='US'
                        style={selectedNationality.some(sel => sel.name === "United States") ? { ...selectedStyle } : {}}
                        onClick={() => handleNationalityChange("United States")}
                    >
                        <div className="w-5 h-5 mx-[5px]">
                            <img src={usFlag} className="h-5 w-5 rounded-[10px]"/>
                        </div>
                        <div className="cont-name">
                            United States
                        </div>
                    </div>

                    <>
                        {renderSelectedCountries(selectedNationality)}
                    </>

                    <div className="flex text-sm bg-[white] h-auto w-auto justify-center cursor-pointer mr-[15px] mt-[15px] p-3 rounded-[22px] border-solid border-2 border-[rgb(181,181,181)] max-[768px]:h-auto w-auto mr-0" onClick={() => handleNationalityChange("Others")}>
                        <div className="cont-name">
                            Others
                        </div>
                    </div>
                    {showOtherNationalities && (
                        <div className="absolute z-10 w-auto h-[180px] flex bg-[#f4f4f4] overflow-y-auto flex-col cursor-pointer text-[15px] p-5 rounded-[10px] max-[768px]:absolute w-auto left-[200px] top-[150px]" ref={nationalityRef}>
                            {countries.map(country => renderCountryOption(country, 'nationality'))}
                        </div>
                    )}
                </div>
                </div>
                
            </div>

            <div className="flex relative h-[250px] w-[700px] shadow-[0px_0px_12px_-2px_lightgray] bg-[white] flex-col mt-[20px] mx-auto p-[30px] rounded-[20px] top-[40px] max-[768px]:w-[500px] p-[20px] h-auto">
                <div class="flex flex-row items-center text-xl font-semibold relative top-[5px] max-[768px]:text-[18px]"><p className="text-[rgb(208_87_109)] mr-[5px]">09.</p>Your Tax Details</div>
                <hr className="w-auto opacity-[40%] relative mt-2.5 border-[solid] border-[#a8a8a8] top-[10px] max-[768px]:w-auto"/>
                <div className="relative top-[15px]">
                <p className="font-semibold mt-2.5 mb-[5px] max-[768px]:text-[14px]">In which country are you tax resident?</p>
                <p className="text-[#868686] mt-2.5 mb-[5px] max-[768px]:text-[14px]">Please select all that apply.</p>


                <div className="flex max-[768px]:flex-col items-start">
                    <div className="flex text-sm bg-[white] h-auto w-auto justify-center cursor-pointer mr-[15px] mt-[15px] p-3 rounded-[22px] border-solid border-2 border-[rgb(181,181,181)] max-[768px]:h-auto w-auto mr-0"
                        key='GB'
                        style={selectedTaxResidence.some(sel => sel.name === "United Kingdom") ? { ...selectedStyle } : {}}
                        onClick={() => handleTaxResidenceChange("United Kingdom")}
                    >
                        <div className="w-5 h-5 mx-[5px]">
                            <img src={ukFlag} className="h-5 w-5 rounded-[10px]"/>
                        </div>
                        <div className="cont-name">
                            United Kingdom
                        </div>
                    </div>

                    <div className="flex text-sm bg-[white] h-auto w-auto justify-center cursor-pointer mr-[15px] mt-[15px] p-3 rounded-[22px] border-solid border-2 border-[rgb(181,181,181)] max-[768px]:h-auto w-auto mr-0"
                        key='US'
                        style={selectedTaxResidence.some(sel => sel.name === "United States") ? { ...selectedStyle } : {}}
                        onClick={() => handleTaxResidenceChange("United States")}
                    >
                        <div className="w-5 h-5 mx-[5px]">
                            <img src={usFlag} className="h-5 w-5 rounded-[10px]"/>
                        </div>
                        <div className="cont-name">
                            United States
                        </div>
                    </div>

                    <>
                        {renderSelectedCountries(selectedTaxResidence)}
                    </>

                    <div className="flex text-sm bg-[white] h-auto w-auto justify-center cursor-pointer mr-[15px] mt-[15px] p-3 rounded-[22px] border-solid border-2 border-[rgb(181,181,181)] max-[768px]:h-auto w-auto mr-0" onClick={() => handleTaxResidenceChange("Others")}>
                        <div className="cont-name">
                            Others
                        </div>
                        {showOtherTaxResidences && (
                            <div className="absolute z-10 w-auto h-[180px] flex bg-[#f4f4f4] overflow-y-auto flex-col cursor-pointer text-[15px] p-5 rounded-[10px] max-[768px]:absolute w-auto left-[150px] top-[150px]" ref={nationalityRef}>
                                {countries.map(country => renderCountryOption(country, 'tax'))}
                            </div>
                        )}
                    </div>

                </div>
                </div>
                
            </div>
            <div className="flex relative items-center flex-row-reverse max-w-[700px] left-[400px] top-[60px] max-[768px]:flex-col left-0 mb-[100px] max-[1400px]:left-[200px] max-[1000px]:left-0">
            
                <div className="flex items-center justify-center text-[whitesmoke] text-[15px] w-[100px] bg-[rgb(208_87_109)] cursor-pointer p-2.5 rounded-[10px]" onClick={handleContinue}>
                    Continue
                </div>
                {validationMessage && <div className="max-w-[500px] text-[15px] text-[rgb(171,11,40)] h-auto mr-[30px] max-[768px]:mb-[30px]">{validationMessage}</div>}
            </div>
            
        </div>


            </div>}



        </>
    );
};


export default EmploymentDetails;
