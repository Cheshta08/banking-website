import React from 'react';
import { BrowserRouter, Routes, Route } from "react-router-dom";

import Home from '../Home/home';
import PD from '../PD/PD';
import EmailVerification from '../emailverify/emailverify';
import EmploymentDetails from '../employment/employment';
import Account from '../account_info/account_info';
import PrivacyAndSecurity from '../privacy/privacy';
import ProfileDetails from '../profile/profile-details';
import DocumentUpload from '../document-upload/document';
import PageNotFound from '../pagenotfound/pagenotfound';
import LoginDetails from '../login-details/login-details';
import RegistrationSuccess from '../login-details/registration-successful';
import Login from '../login/login';
import ForgotPassword from '../forgot-password/forgot-password';

const AppNavigation = () => {
    return (
     
      
    <BrowserRouter>
     
    
        <Routes>
       
           <Route path="/" element={<Home/>}  />
           <Route path="/pd" element={<PD />} />
           {/* <Route path="/phone-verification/:userId" element={<Phone />} /> */}
        <Route path="/email-verification/:userId" element={<EmailVerification />} />
        <Route path="/account-info/:userId" element={<Account/>}/>
        <Route path="/privacy/:userId" element={<PrivacyAndSecurity/>}/>
        <Route path="/profile-details/:userId" element={<ProfileDetails/>}/>
        <Route path="*" element={<PageNotFound/>}/>
        <Route path="/registration-success/:userId" element={<RegistrationSuccess/>}/>
        <Route path="/login" element={<Login/>}/>
        <Route path="/forgot-password" element={<ForgotPassword/>}/>


        
        {/* <Route path="/profile" element={<Profile/>}/> */}
        

         <Route path="/login-details/:userId" element={<LoginDetails />} /> 
         <Route path="/document-upload/:userId" element={<DocumentUpload />} />
        
        
        <Route path="/employment-details/:userId" element={<EmploymentDetails />} /> 

        
           
        </Routes>
       
      </BrowserRouter>
      
         
    );
  };
export default AppNavigation;