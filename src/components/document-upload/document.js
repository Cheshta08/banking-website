import React, { useState } from 'react';
import { useParams } from 'react-router-dom';
import styled from 'styled-components';
import { useNavigate } from 'react-router-dom';

const maxSize = 4.5 * 1024 * 1024; // 4.5MB
const validFormats = ['application/pdf', 'image/jpeg', 'image/jpg', 'image/png'];

const CenteredContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
`;

const Container = styled.div`
  width: 100%;
  max-width: 700px;
  background-color: #fff;
  padding: 20px;
  border-radius: 8px;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
  text-align: center;
`;

const Header = styled.div`
  margin-bottom: 20px;
`;

const Section = styled.div`
  margin-bottom: 20px;
`;

const UploadBox = styled.div`
  border: 2px dashed #ccc;
  padding: 20px;
  text-align: center;
  cursor: pointer;
  border-radius: 5px;
  background-color: #f0f0f0;
  margin-bottom: 10px;
  position: relative;
`;

const FilePreview = styled.div`
  margin-top: 10px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  border: 1px solid #ccc;
  padding: 10px;
  border-radius: 5px;
  background-color: #f9f9f9;
`;

const FileInfo = styled.div`
  display: flex;
  align-items: center;
`;

const RemoveFile = styled.span`
  cursor: pointer;
  color: red;
  font-size: 16px;
  margin-left: 10px;
`;

const Error = styled.p`
  color: red;
  margin-top: 10px;
`;

const DocumentUpload = () => {
    const navigate=useNavigate();
  const { userId } = useParams();

  const [aadhaarFile, setAadhaarFile] = useState(null);
  const [panFile, setPanFile] = useState(null);
  const [aadhaarError, setAadhaarError] = useState('');
  const [panError, setPanError] = useState('');

  const handleFiles = (files, setFile, setError) => {
    if (files.length > 0) {
      const file = files[0];
      if (validateFile(file, setError)) {
        setFile(file);
        setError('');
      } else {
        setFile(null);
      }
    }
  };

  const validateFile = (file, setError) => {
    if (file.size > maxSize) {
      setError('File size should not exceed 4.5MB.');
      return false;
    }
    if (!validFormats.includes(file.type)) {
      setError('Invalid file format. Please upload a PDF, JPG, JPEG, or PNG file.');
      return false;
    }
    return true;
  };

  const generateFilePreview = (file) => {
    if (file.type.startsWith('image/')) {
      return <img src={URL.createObjectURL(file)} alt="File Preview" style={{ maxWidth: '100px', maxHeight: '100px' }} />;
    } else {
      return <span>📄</span>;
    }
  };

  const handleRemoveFile = (setFile) => {
    setFile(null);
  };

  const handleSubmit = async () => {
    if (!aadhaarFile || !panFile) {
      alert('Please upload both Aadhaar Card and PAN Card.');
      return;
    }
    // Process form submission logic here
    const formData = new FormData();
    formData.append('aadhaar', aadhaarFile);
    formData.append('pan', panFile);
    formData.append('userId', userId);

    try {
      const response = await fetch('https://banking-website-backend-1.vercel.app/document-upload', {
        method: 'POST',
        body: formData
      });

      if (!response.ok) {
        throw new Error('Failed to upload files');
      }
      alert('Documents submitted successfully! ');
      navigate(`/login-details/${userId}`);
    } catch (error) {
      console.error('There was an error submitting the form!', error);
    }
  };

  return (
    <CenteredContainer>
      <Container>
        <Header>
          <h2 style={{ fontSize: '24px' }}>Document Upload</h2>
          <p>We just need a little more information from you.</p>
        </Header>

        <Section>
          <h3>Aadhaar Card</h3>
          <UploadBox
            onDragOver={(e) => {
              e.preventDefault();
              e.stopPropagation();
            }}
            onDragLeave={(e) => {
              e.preventDefault();
              e.stopPropagation();
            }}
            onDrop={(e) => {
              e.preventDefault();
              handleFiles(e.dataTransfer.files, setAadhaarFile, setAadhaarError);
            }}
            onClick={() => document.getElementById('aadhaarInput').click()}
          >
            <input
              type="file"
              id="aadhaarInput"
              accept=".pdf, .jpg, .jpeg, .png"
              onChange={(e) => handleFiles(e.target.files, setAadhaarFile, setAadhaarError)}
              style={{ display: 'none' }}
            />
            {!aadhaarFile && <p>Drag and drop a file here or click to select a file</p>}
            {aadhaarFile && (
              <FilePreview>
                <FileInfo>
                  {generateFilePreview(aadhaarFile)}
                  <span>{aadhaarFile.name}</span>
                </FileInfo>
                <RemoveFile onClick={() => handleRemoveFile(setAadhaarFile)}>✖ Delete</RemoveFile>
              </FilePreview>
            )}
          </UploadBox>
          {aadhaarError && <Error>{aadhaarError}</Error>}
        </Section>

        <Section>
          <h3>PAN Card</h3>
          <UploadBox
            onDragOver={(e) => {
              e.preventDefault();
              e.stopPropagation();
            }}
            onDragLeave={(e) => {
              e.preventDefault();
              e.stopPropagation();
            }}
            onDrop={(e) => {
              e.preventDefault();
              handleFiles(e.dataTransfer.files, setPanFile, setPanError);
            }}
            onClick={() => document.getElementById('panInput').click()}
          >
            <input
              type="file"
              id="panInput"
              accept=".pdf, .jpg, .jpeg, .png"
              onChange={(e) => handleFiles(e.target.files, setPanFile, setPanError)}
              style={{ display: 'none' }}
            />
            {!panFile && <p>Drag and drop a file here or click to select a file</p>}
            {panFile && (
              <FilePreview>
                <FileInfo>
                  {generateFilePreview(panFile)}
                  <span>{panFile.name}</span>
                </FileInfo>
                <RemoveFile onClick={() => handleRemoveFile(setPanFile)}>✖ Delete</RemoveFile>
              </FilePreview>
            )}
          </UploadBox>
          {panError && <Error>{panError}</Error>}
        </Section>

        <button className="submit-button" onClick={handleSubmit}>
          Submit
        </button>
        <p style={{ marginTop: '10px', fontSize: '14px' }}>
          Accepted file types: PDF, JPG, JPEG, PNG <br />
          Maximum file size: 4.5MB
        </p>
      </Container>
    </CenteredContainer>
  );
};

export default DocumentUpload;
