import React, { useState } from 'react';
import { QrReader } from 'react-qr-reader';
import axios from "../../../Axios/userAxios.js";
import { Toast } from '../../../Helper/Toast.js';
import './QR.css';

const QRScanner = () => {
  const [scannedData, setScannedData] = useState('No result');
  const [scanError, setScanError] = useState(null);
  const [scanMessage, setScanMessage] = useState(null);
  const [isScannerEnabled, setScannerEnabled] = useState(true);

  const handleScan = (result) => {
    if (result && isScannerEnabled) {
      setScannerEnabled(false);

      axios.post('scan', { qrCode: result }, {
      
      })
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
            setScanError(null);
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
        })
        .finally(() => {
          setScannerEnabled(true);
        });
    }
  };

  const playBeepSound = () => {
    const beepSound = new Audio('/safad/beep.mp3');
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

  return (
    <div className="result-container">
      {!scanMessage && (
        <QrReader
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
          {/* <p>{scanMessage}</p> */}
          <button className="scan-again-button" onClick={handleScanAgain}>
            Scan Again
          </button>
        </>
      )}
    </div>
  );
};

export default QRScanner;
