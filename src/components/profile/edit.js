import React, { useState, useEffect, useRef } from 'react';

function EditModal({ section, userInfos, handleEdit, closeModal }) {
  const [formData, setFormData] = useState(userInfos[section]);
  const [countries, setCountries] = useState([]);
  const [selectedNationality, setSelectedNationality] = useState([]);
  const [showOtherNationalities, setShowOtherNationalities] = useState(false);
  const [selectedTaxResidence, setSelectedTaxResidence] = useState([]);
  const [showOtherTaxResidences, setShowOtherTaxResidences] = useState(false);

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
      const updatedNationality = {
        name: value,
        code: countries.find(country => country.name === value)?.code,
        flag: countries.find(country => country.name === value)?.flag
      };
      setSelectedNationality([updatedNationality]);
  
      setFormData(formData => ({
        ...formData,
        citizenship: updatedNationality
      }));
    }
  };
  

  const handleTaxResidenceChange = (value) => {
    if (value === "Others") {
      setShowOtherNationalities(false);
      setShowOtherTaxResidences(true);
    } else {
      setShowOtherTaxResidences(false);
      const updatedTaxResidence = {
        name: value,
        code: countries.find(country => country.name === value)?.code,
        flag: countries.find(country => country.name === value)?.flag
      };
      setSelectedTaxResidence([updatedTaxResidence]);
  
      setFormData(formData => ({
        ...formData,
        tax_residence: updatedTaxResidence
      }));
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
        setFormData(formData => ({
            ...formData,
            citizenship: updatedSelection
          }));
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
        setFormData(formData => ({
            ...formData,
            tax_residence: updatedSelection
          }));
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
          <img src={country.flag} alt={country.name} className="h-5 w-5 rounded-[10px]" />
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
        <div className="flex text-sm bg-[white] h-auto w-auto justify-center cursor-pointer mr-[15px] mt-[15px] p-3 rounded-[22px] border-solid border-2 border-[rgb(181,181,181)]"
          key={country.code}
          style={selectedNationality.some(sel => sel.name === country.name) || selectedTaxResidence.some(sel => sel.name === country.name) ? { ...selectedStyle } : {}}
        >
          <div className="w-5 h-5 mx-[5px]">
            <img src={country.flag} className="h-5 w-5 rounded-[10px]" />
          </div>
          <div className="cont-name">
            {country.name}
          </div>
        </div>
      ));
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };
  const handleSubmit = (e) => {
    
        e.preventDefault();
        handleEdit(section, formData);
      console.log('Form Submitted:', formData);
    
  };

 
  const renderFields = () => {
    if (section === "nationality") {
      return (
        <>
          <div className="mb-[15px]">
            <label className="mb-[5px] block">Citizenship</label>
            <div className="flex">
              <div className="flex text-sm bg-[white] h-auto w-auto justify-center cursor-pointer mr-[15px] mt-[15px] p-3 rounded-[22px] border-solid border-2 border-[rgb(181,181,181)]"
                key='GB'
                style={selectedNationality.some(sel => sel.name === "United Kingdom") ? { ...selectedStyle } : {}}
                onClick={() => handleNationalityChange("United Kingdom")}
              >
                <div className="w-5 h-5 mx-[5px]">
                  <img src={ukFlag} className="h-5 w-5 rounded-[10px]" />
                </div>
                <div className="cont-name">
                  United Kingdom
                </div>
              </div>

              <div className="flex text-sm bg-[white] h-auto w-auto justify-center cursor-pointer mr-[15px] mt-[15px] p-3 rounded-[22px] border-solid border-2 border-[rgb(181,181,181)]"
                key='US'
                style={selectedNationality.some(sel => sel.name === "United States") ? { ...selectedStyle } : {}}
                onClick={() => handleNationalityChange("United States")}
              >
                <div className="w-5 h-5 mx-[5px]">
                  <img src={usFlag} className="h-5 w-5 rounded-[10px]" />
                </div>
                <div className="cont-name">
                  United States
                </div>
              </div>

              <>
                {renderSelectedCountries(selectedNationality)}
              </>

              <div className="flex text-sm bg-[white] h-auto w-auto justify-center cursor-pointer mr-[15px] mt-[15px] p-3 rounded-[22px] border-solid border-2 border-[rgb(181,181,181)]" onClick={() => handleNationalityChange("Others")}>
                <div className="cont-name">
                  Others
                </div>
              </div>
              <div className="flex realtive h-auto w-auto">
                {showOtherNationalities && (
                  <div className="absolute z-10 w-auto h-[200px] flex bg-[#f4f4f4] overflow-y-auto flex-col cursor-pointer text-[15px] p-5 rounded-[10px] top-[320px]" ref={nationalityRef}>
                    {countries.map(country => renderCountryOption(country, 'nationality'))}
                  </div>
                )}
              </div>
            </div>
          </div>
          <div className="mb-[15px]">
            <label className="mb-[5px] block">Tax Residency</label>
            <div className="flex">
              <div className="flex text-sm bg-[white] h-auto w-auto justify-center cursor-pointer mr-[15px] mt-[15px] p-3 rounded-[22px] border-solid border-2 border-[rgb(181,181,181)]"
                key='GB'
                style={selectedTaxResidence.some(sel => sel.name === "United Kingdom") ? { ...selectedStyle } : {}}
                onClick={() => handleTaxResidenceChange("United Kingdom")}
              >
                <div className="w-5 h-5 mx-[5px]">
                  <img src={ukFlag} className="h-5 w-5 rounded-[10px]" />
                </div>
                <div className="cont-name">
                  United Kingdom
                </div>
              </div>

              <div className="flex text-sm bg-[white] h-auto w-auto justify-center cursor-pointer mr-[15px] mt-[15px] p-3 rounded-[22px] border-solid border-2 border-[rgb(181,181,181)]"
                key='US'
                style={selectedTaxResidence.some(sel => sel.name === "United States") ? { ...selectedStyle } : {}}
                onClick={() => handleTaxResidenceChange("United States")}
              >
                <div className="w-5 h-5 mx-[5px]">
                  <img src={usFlag} className="h-5 w-5 rounded-[10px]" />
                </div>
                <div className="cont-name">
                  United States
                </div>
              </div>

              <>
                {renderSelectedCountries(selectedTaxResidence)}
              </>

              <div className="flex text-sm bg-[white] h-auto w-auto justify-center cursor-pointer mr-[15px] mt-[15px] p-3 rounded-[22px] border-solid border-2 border-[rgb(181,181,181)]" onClick={() => handleTaxResidenceChange("Others")}>
                <div className="cont-name">
                  Others
                </div>
              </div>
              <div className="flex realtive h-auto w-auto">
                {showOtherTaxResidences && (
                  <div className="absolute z-10 w-auto h-[200px] flex bg-[#f4f4f4] overflow-y-auto flex-col cursor-pointer text-[15px] p-5 rounded-[10px] top-[430px]" ref={nationalityRef}>
                    {countries.map(country => renderCountryOption(country, 'tax'))}
                  </div>
                )}
              </div>

            </div>
          </div>
        </>
      );
    }
    else {
      return Object.keys(formData).map((key) => (
        <div key={key} className="mb-[17px]">
          <label className="mb-[5px] block">{key}</label>
          <input
            type="text"
            name={key}
            value={formData[key]}
            onChange={handleChange}
            className="w-full p-[8px] border-[2px] border-solid border-[#bababa] rounded-[5px]"
          />
        </div>
      ));
    }
  };

  return (
    <div className="fixed top-0 left-0 w-full h-full bg-[rgba(0,0,0,0.5)] flex justify-center items-center">
      <div className="bg-[#fff] p-[20px] rounded-[5px] w-[650px]">
        <h2 className="text-[20px] font-[500]">Edit {section} Information</h2>
        <hr className="w-auto opacity-[40%] mt-1.5 mb-1.5 border-t-[3px] border-[solid] border-[#e5e7eb]"/>
        <form onSubmit={handleSubmit}>
          {renderFields()}
          <button type="submit" className="mx-[10px] bg-[#0083ff] text-white py-1 px-2 rounded-[10px]">Save</button>
          <button type="button" onClick={closeModal}>Cancel</button>
        </form>
      </div>
    </div>
  );
}

export default EditModal;