import React, { useState, useEffect } from 'react';
import { QrReader } from 'react-qr-reader';
import axios from "../../../Axios/userAxios.js";
import { Toast } from '../../../Helper/Toast.js';
import './QR.css';

const QRScanner = () => {
  const [scannedData, setScannedData] = useState('No result');
  const [scanError, setScanError] = useState(null);
  const [scanMessage, setScanMessage] = useState(null);
  const [isScannerEnabled, setScannerEnabled] = useState(true);
  const [currentFacingMode, setCurrentFacingMode] = useState('environment'); // Initialize with back camera

  useEffect(() => {
    // Request back camera access on component mount
    navigator.mediaDevices.getUserMedia({ video: { facingMode: 'environment' } })
      .then(() => {
        // Camera access granted, proceed normally
      })
      .catch((err) => {
        // Handle camera access errors
        console.error('Camera error:', err);
        setScanError('Could not access back camera.'); // Inform the user
      });
  }, []);

  const handleScan = (result) => {
    if (result && isScannerEnabled) {
      setScannerEnabled(false);

      axios.post('/scan', { qrCode: result })
        .then((response) => {
          console.log('Backend Response:', response.data.message);

          if (response.data.message !== 'QR code already scanned') {
            setScanMessage('QR code scanned successfully');
            Toast.fire({
              icon: "success",
              title: "Pass successful",
            });
            playBeepSound();
          } else {
            setScanMessage('QR code already scanned');
            Toast.fire({
              icon: "error",
              title: "Already scanned",
            });
          }

          setScannedData(JSON.stringify(result));
        })
        .catch((error) => {
          console.error('Error during scan processing:', error);
          setScanError('Error:',error.message); // Display a user-friendly error message
        })
        .finally(() => {
          setScannerEnabled(true);
        });
    }
  };

  const playBeepSound = () => {
    const beepSound = new Audio('/safad/beep.mp3'); // Ensure this path is correct
    beepSound.play();
  };

  const handleError = (error) => {
    console.error('Camera Error:', error);
    setScanError('Camera Error');
    setScanMessage(null);
    setScannerEnabled(true);
  };

  const handleScanAgain = () => {
    setScannedData('No result');
    setScanError(null);
    setScanMessage(null);
    setScannerEnabled(true);
  };

  const handleCameraSwitch = () => {
    setCurrentFacingMode(currentFacingMode === 'environment' ? 'user' : 'environment');
  };

  return (
    <div className="result-container">
      {!scanMessage && (
        <QrReader
          facingMode={currentFacingMode} // Dynamically set facingMode
          delay={300}
          onResult={handleScan}
          onError={handleError}
          style={{ display: 'block', width: '100%' }}
        />
      )}
      {scanMessage && (
        <>
          <img
            src={scanMessage === 'QR code scanned successfully' ? '/safad/access.png' : '/safad/denied.png'}
            alt={scanMessage}
            className="success-image"
          />
          <button className="scan-again-button" onClick={handleScanAgain}>
            Scan Again
          </button>
        </>
      )}
      <button onClick={handleCameraSwitch} className="crazy-button">
        Switch Camera
      </button>
    </div>
  );
};

export default QRScanner;
