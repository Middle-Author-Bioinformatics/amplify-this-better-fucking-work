import React, { useState } from 'react';
import './App.css';
import { withAuthenticator } from '@aws-amplify/ui-react';  // Keep withAuthenticator
import { uploadData } from '@aws-amplify/storage';
import { Amplify } from 'aws-amplify';
import awsExports from './aws-exports';  // Make sure aws-exports is correctly imported
Amplify.configure(awsExports);

function App({ signOut: appSignOut, user }) {
  const [fileData, setFileData] = useState();
  const [fileStatus, setFileStatus] = useState(false);
  const [uploadError, setUploadError] = useState(null);

  const uploadFile = async () => {
    if (!fileData) {
      console.error('No file selected');
      setUploadError('No file selected.');
      return;
    }

    try {
      // Ensure only the key (file name) is provided

      const result = await uploadData({
      key: fileData.name, // The file's name will be used as the key
      body: fileData, // The file data
      contentType: fileData.type, // Optionally set the content type
      });

      setFileStatus(true);
      setUploadError(null);  // Clear any previous errors
      console.log('File uploaded successfully:', result);
    } catch (error) {
      console.error('Error uploading file:', error);
      setUploadError('Error uploading file.');
    }
  };

  return (
    <div className="App">
      {/* This part shows up after the user signs in */}
      <h1>Hello {user.username}</h1>
      <button onClick={appSignOut}>Sign out</button>

      <div>
        <input type="file" onChange={(e) => setFileData(e.target.files[0])} />
      </div>
      <div>
        <button onClick={uploadFile}>Upload file</button>
      </div>

      {/* Display upload status */}
      {fileStatus && <p>File uploaded successfully</p>}
      {uploadError && <p style={{ color: 'red' }}>{uploadError}</p>}
    </div>
  );
}

// Remove manual sign-in logic and let withAuthenticator handle everything
export default withAuthenticator(App);
