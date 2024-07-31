import React, { useState, useEffect } from 'react';
import Profile from './profile';
import EditModal from './edit';
import { useParams } from 'react-router-dom';

function ProfileDetails() {
    const { userId}  = useParams();
    const [userInfos, setUserInfos] = useState(null);
    const [modalState, setModalState] = useState({ isOpen: false, section: null });
    

    useEffect(() => {
        const fetchUserInfo = async () => {
            try {
                const response = await fetch(`https://banking-website-backend-1.vercel.app/info/${userId}`);
                if (!response.ok) {
                    throw new Error('Failed to fetch user information');
                }
                const data = await response.json();
                setUserInfos(data);
            } catch (error) {
                console.error('Error fetching user information:', error);
            }
        };

        fetchUserInfo();
    }, [userId]); // Dependency array ensures useEffect runs on userId change

    const handleEdit = async (section, updatedInfo) => {
        
         setModalState({ isOpen: false, section: null });
    
        try {
            const response = await fetch(`https://banking-website-backend-1.vercel.app/update/${userInfos._id}`, {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({[section]:updatedInfo}),
            });
    
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            const data = await response.json();
                setUserInfos(data);
            
    
            console.log("Task Updated");
        } catch (error) {
            console.log('Fetch error: ', error);
        }
    };
    

    const openModal = (section) => {
        setModalState({ isOpen: true, section:section });
        
    };

    const closeModal = () => {
        setModalState({ isOpen: false, section: null });
    };

    if (!userInfos) {
        return <div>Loading...</div>; // Handle loading state
    }

    return (
        <>
        {userInfos && userInfos.personal&&
            <Profile userInfos={userInfos} openModal={openModal} />}

            {modalState.isOpen && modalState.section!=null&& (
                <EditModal
                    section={modalState.section}
                    userInfos={userInfos}
                    handleEdit={handleEdit}
                    closeModal={closeModal}
                />
            )}
        </>
    );
}

export default ProfileDetails;
