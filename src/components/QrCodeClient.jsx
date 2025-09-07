import React, { useEffect, useRef } from 'react';
import QRCode from 'easyqrcodejs';

const QRCodeClient = ({ text }) => {
  const qrCodeRef = useRef(null);

  useEffect(() => {
    const options = {
      text: text,
      width: 256,
      height: 256,
      colorDark: '#000000',
      colorLight: '#ffffff',
      correctLevel: QRCode.CorrectLevel.H,
    };

    const qrcode = new QRCode(qrCodeRef.current, options);

    return () => {
      qrcode.clear(); // Clear the QR code on component unmount
    };
  }, [text]);

  return <div ref={qrCodeRef}></div>;
};

export default QRCodeClient;