import React from 'react';

function InfosSection({ title, info, fields, onEdit }) {
   
    const render = (title) => {
        if (title === "Home Address") {
            return (
                <div className="bg-[#f7f7f7] p-[20px] pb-[10px] relative h-[auto] mb-[5px] rounded-[5px]">
                    <p className="mt-[0px] mb-[10px]">House/Building Number: {info.premise}</p>
                    <p className="mt-[0px] mb-[10px]">Street/Colony Name: {info.thoroughfare}</p>
                    <p className="mt-[0px] mb-[10px]">Town/City: {info.locality}</p>
                    <p className="mt-[0px] mb-[10px]">Postal Code: {info.postalCode}</p>

                    <p className="mt-[0px] mb-[10px]">Lived Duration: {info.livedDuration}</p>
                </div>
            );
        }
        if (title === "Personal Information") {
            return (
                <div className="bg-[#f7f7f7] p-[20px] pb-[10px] relative h-[auto] mb-[5px] rounded-[5px]">
                    <p className="mt-[0px] mb-[10px]">First Name: {info.firstName}</p>
                    <p className="mt-[0px] mb-[10px]">Middle Name: {info.middleName}</p>
                    <p className="mt-[0px] mb-[10px]">Last Name: {info.lastName}</p>
                    <p className="mt-[0px] mb-[10px]">Date of Birth: {info.dob}</p>


                </div>
            );
        }
        else if (title === "Nationality & Tax Residency") {
            return (
                <>
                    {fields.map(field => (
                        <div className="bg-[#f7f7f7] p-[20px] pb-[10px] relative h-[auto] mb-[5px] rounded-[5px]" key={field}>
                            <p className="mt-[0px] mb-[10px] text-[14px] text-[#7a7a7a] font-[500]">{field}</p>
                            <div key={info[field].code} className="flex bg-[#dfefff] pt-[15px] pl-[15px] pr-[15px] pb-[5px] w-fit rounded-[30px] justify-center border-[2px] border-solid border-[#0053a1]">
                                <div className="w-5 h-5 mx-[5px] mt-[2px]">
                                    <img src={info[field].flag} className="h-5 w-5 rounded-[10px]" />
                                </div>
                                <p className="mt-[0px] mb-[10px]">{info[field].name}</p>
                            </div>
                        </div>
                    ))}
                </>
            );
        }
        else {
            return (
                <>
                    {fields.map(field => (
                        <div className="bg-[#f7f7f7] p-[20px] pb-[10px] relative h-[auto] mb-[5px] rounded-[5px]" key={field}>
                            <p className="mt-[0px] mb-[10px] text-[14px] text-[#7a7a7a] font-[500]">{field}</p>
                            <p className="mt-[0px] mb-[10px]">{info[field]}</p>
                        </div>
                    ))}
                </>
            );
        }
    }

    return (
        <>
            <div className="flex flex-col w-[430px] p-[20px] mb-[20px] shadow-[0_0_12px_-1px_#eaeaeaea]">
                <div className="flex flex-row justify-between items-center mb-[10px]">
                    <p className="font-[400] text-[18px]">{title}</p>
                    <p className="font-[600] text-[13px] cursor-pointer text-[#a74444]" onClick={onEdit}>Edit Information</p>
                </div>
                {render(title)}
            </div >
        </>
    );
}

export default InfosSection;