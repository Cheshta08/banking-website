import React from 'react';
import InfosSection from './infoSection.js';

function Profile({ userInfos, openModal }) {
    console.log(userInfos.personal);

    if (!userInfos) {
        return <div>Loading...</div>;
    }
    
    return (
        <>

            <div className="flex flex-col mr-auto ml-auto w-[900px]">
                <h1 className="font-[600] text-[30px] mb-[10px] mt-[15px]">Personal Details</h1>
                <div className="flex flex-row justify-center">
                    <div className="flex flex-col mr-[20px]">
                        <InfosSection
                            title="Personal Information"
                            info={userInfos.personal}
                            fields={['firstName', 'middleName', 'lastName', 'dob']}
                            onEdit={() => openModal('personal')}
                        />
                        <InfosSection
                            title="Contact Details"
                            info={userInfos.contact}
                            fields={['email', 'phoneNumber']}
                            onEdit={() => openModal('contact')}
                        />
                    </div>
                    <div className="flex flex-col mr-[20px]">
                        <InfosSection
                            title="Home Address"
                            info={userInfos.address}
                            fields={['premise', 'thoroughfare', 'locality', 'postalCode', 'livedDuration']}
                            onEdit={() => openModal('address')}
                        />
                        <InfosSection
                            title="Nationality & Tax Residency"
                            info={userInfos.nationality}
                            fields={['citizenship', 'tax_residence']}
                            onEdit={() => openModal('nationality')}
                        />

                        <InfosSection
                            title="Employment Details"
                            info={userInfos.employment_details}
                            fields={['status', 'industry', 'occupation']}
                            onEdit={() => openModal('employment_details')}
                        />

                    </div>
                </div>
            </div>

        </>
    );
};

export default Profile;