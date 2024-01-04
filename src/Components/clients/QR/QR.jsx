import React, { useState, useRef, useEffect } from 'react';
import axios from "../../../Axios/userAxios.js";
import { Toast } from '../../../Helper/Toast.js';
import { Html5Qrcode } from 'html5-qrcode';
import './QR.css';

const QRScanner = () => {
  const [scannedData, setScannedData] = useState('No result');
  const [scanError, setScanError] = useState(null);
  const [scanMessage, setScanMessage] = useState(null);
  const [isScannerEnabled, setScannerEnabled] = useState(true);
  const readerRef = useRef(null);

  useEffect(() => {
    const initializeQRCodeScanner = async () => {
      if (readerRef.current) {
        try {
          const qrcode = new Html5Qrcode(readerRef.current);

          qrcode.start(
            (decodedText, decodedResult) => {
              handleScan(decodedText);
            },
            (error) => {
              console.error('Scan error:', error);
              handleError(error);
            }
          );

          return () => {
            qrcode.stop(); // Clean up when component unmounts
          };
        } catch (error) {
          console.error('Error initializing QR code scanner:', error);
        }
      }
    };

    initializeQRCodeScanner();
  }, [readerRef]);

  const handleScan = (result) => {
    if (result && isScannerEnabled) {
      setScannerEnabled(false);

      axios.post('/scan', { qrCode: result })
        .then((response) => {
          console.log(response, "res");
          console.log(response.data, "data");
          console.log('Backend Response:', response.data.message);

          if (response.data.message !== 'QR code already scanned') {
            setScanMessage('QR code scanned successfully');
            Toast.fire({
              icon: "success",
              title: "Pass successful",
            });
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
        <div id="reader" ref={readerRef} style={{ display: 'block', width: '100%' }} />
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
    </div>
  );
};

export default QRScanner;
