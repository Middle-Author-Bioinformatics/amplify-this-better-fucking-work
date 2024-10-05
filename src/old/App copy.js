import React, { useState } from 'react';
import { uploadData, getUrl, Storage } from '@aws-amplify/storage';  // Correctly import the methods available in this version
import './App.css';

function App() {
  const [selectedFile, setSelectedFile] = useState(null);
  const [uploadStatus, setUploadStatus] = useState('');
  const [outputUrl, setOutputUrl] = useState('');

  const handleFileChange = (event) => {
    setSelectedFile(event.target.files[0]);
  };

  const handleUpload = async () => {
    if (!selectedFile) {
      alert('Please select a file first!');
      return;
    }
    try {
      // Upload file with public access level
      const result = await uploadData(selectedFile.name, selectedFile, { level: 'public' });
      setUploadStatus('File uploaded successfully!');

      // Get URL of the uploaded file with public access
      const outputFileKey = `output/${selectedFile.name.replace('.fasta', '_output.csv')}`;
      const outputUrl = await getUrl(outputFileKey, { level: 'public' });
      setOutputUrl(outputUrl);
    } catch (error) {
      setUploadStatus('Error uploading file');
      console.error('Error uploading file: ', error);
    }
  };

  return (
    <div className="App">
      <header className="App-header">
        <h1>Upload a FASTA File</h1>
        <input type="file" onChange={handleFileChange} />
        <button onClick={handleUpload}>Upload</button>
        <p>{uploadStatus}</p>
        {outputUrl && <a href={outputUrl} download>Download Output File</a>}
      </header>
    </div>
  );
}

export default App;

