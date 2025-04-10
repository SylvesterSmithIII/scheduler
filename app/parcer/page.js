'use client';

import React, { useState } from 'react';

export default function DocumentUploader() {
  const [docType, setDocType] = useState(null);
  const [file, setFile] = useState(null);
  const [gptResult, setGptResult] = useState(null);
  const [errorMsg, setErrorMsg] = useState(null);

  const handleDrop = (e) => {
    e.preventDefault();
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      setFile(e.dataTransfer.files[0]);
      e.dataTransfer.clearData();
    }
  };

  const handleDragOver = (e) => {
    e.preventDefault();
  };

  const handleSubmit = async () => {
    if (!file) return;
  
    const formData = new FormData();
    formData.append('file', file);
    formData.append('docType', docType);
  
    try {
      setErrorMsg(null);
      const res = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      });
  
      if (!res.ok) {
        const error = await res.json();
        throw new Error(error?.error || 'Unknown error during upload.');
      }
  
      const data = await res.json();
      setGptResult(data.gptOutput);
    } catch (error) {
      console.error('Upload failed:', error.message || error);
      setErrorMsg(error.message || 'Unexpected error occurred');
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50 p-4">
      {!docType ? (
        <div className="space-y-4">
          <h1 className="text-2xl font-bold">Select Document Type</h1>
          <div className="flex space-x-4">
            <button
              onClick={() => setDocType('title')}
              className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
            >
              Title Report
            </button>
            <button
              onClick={() => setDocType('psa')}
              className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
            >
              PSA
            </button>
          </div>
        </div>
      ) : (
        <div className="flex flex-col items-center space-y-4 w-full max-w-lg">
          <div
            onDrop={handleDrop}
            onDragOver={handleDragOver}
            className="w-full h-64 flex items-center justify-center border-4 border-dashed border-gray-400 bg-white rounded-lg"
          >
            {file ? (
              <p className="text-center text-gray-700">Uploaded: {file.name}</p>
            ) : (
              <p className="text-center text-gray-500">
                Drop your {docType === 'title' ? 'Title Report' : 'PSA'} PDF here
              </p>
            )}
          </div>
          <div className="flex space-x-4">
            <button
              onClick={() => {
                setDocType(null);
                setFile(null);
                setGptResult(null);
              }}
              className="px-4 py-2 bg-gray-300 text-gray-800 rounded hover:bg-gray-400"
            >
              Back
            </button>
            <button
              onClick={handleSubmit}
              disabled={!file}
              className={`px-4 py-2 rounded text-white ${
                file ? 'bg-blue-600 hover:bg-blue-700' : 'bg-blue-300 cursor-not-allowed'
              }`}
            >
              Submit
            </button>
            {errorMsg && (
            <div className="w-full bg-red-100 border border-red-400 text-red-700 px-4 py-2 rounded">
                <p>Error: {errorMsg}</p>
            </div>
            )}
          </div>
          {gptResult && (
            <div className="mt-6 w-full bg-white rounded p-4 border border-gray-300">
              <h2 className="text-lg font-semibold mb-2">GPT Output</h2>
              {(() => {
                try {
                  const cleaned = gptResult.trim().replace(/^```json|```$/g, '').replace(/^```|```$/g, '');
                  const parsed = JSON.parse(cleaned);
                  return (
                    <ul className="space-y-2 text-sm text-gray-800">
                      {Object.entries(parsed).map(([key, value]) => (
                        <li key={key}>
                          <span className="font-medium capitalize">{key}:</span>{' '}
                          {Array.isArray(value)
                            ? value.map((item, i) => <div key={i} className="ml-4">- {item}</div>)
                            : typeof value === 'object'
                            ? Object.entries(value).map(([subKey, subVal], i) => (
                                <div key={i} className="ml-4">
                                  <span className="font-medium">{subKey}:</span> {subVal}
                                </div>
                              ))
                            : value}
                        </li>
                      ))}
                    </ul>
                  );
                } catch (err) {
                  return <pre className="whitespace-pre-wrap text-sm text-red-600">Failed to parse GPT output.</pre>;
                }
              })()}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
