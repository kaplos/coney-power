
"use client";
import { useEffect, useRef, useState } from "react";
import { Html5Qrcode } from "html5-qrcode";

export default function CheckIn(){
      const [status, setStatus] = useState("idle"); // idle, scanning, scanned, error,success,loading
  const [errorMessage, setErrorMessage] = useState("");
  const [scanResult, setScanResult] = useState("");
  const html5QrCodeRef = useRef(null);


  useEffect(() => {
    const sendCheckin = async () => {
      try {
        if (scanResult) {
          let response = await fetch("/api/checkin", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({ memberId: scanResult }),
          });
          if (response.ok) {
            let data = await response.json();
            setStatus("success");
          } else {
            let errorData = await response.json();
            setStatus("error");
            setErrorMessage(
              errorData.message || "Check-in failed. Please try again."
            );
          }
        }
      } catch (error) {
        setStatus("error");
        setErrorMessage("Check-in failed. Please try again.");
      }
    };
    sendCheckin();
  }, [scanResult]);
  useEffect(() => {
  if (status === "success" || status === "error") {
    const timer = setTimeout(() => {
      setStatus("idle");
    }, 2000);
    return () => clearTimeout(timer);
  }
}, [status]);
  const startScan = async () => {
    setStatus("scanning")
    setScanResult("");
    if (!html5QrCodeRef.current) {
      html5QrCodeRef.current = new Html5Qrcode("reader");
    }
    const devices = await Html5Qrcode.getCameras();
    if (devices && devices.length) {
      const cameraId = devices[0].id;
      html5QrCodeRef.current.start(
        cameraId,
        { fps: 10, qrbox: { width: 250, height: 250 } },
        async (decodedText) => {
          console.log("scanning started");
        //   setScanned(true);
          setStatus("loading");
          setScanResult(decodedText);
          await html5QrCodeRef.current.stop();
        },
        (errorMessage) => {
          // Optionally handle scan errors
        }
      );
    }
  };

  const stopScan = async () => {
    setStatus("idle");
    if (html5QrCodeRef.current) {
      await html5QrCodeRef.current.stop().catch(() => {});
    }
  };

  const scanState = () => {
    return (
      <>
        <span className="text-white text-3xl mb-2 z-20">📷</span>
        <span className="text-white text-lg font-bold text-center px-4 z-20">
          Scan your QR code
          <br />
          to check in
        </span>
        <button
          onClick={startScan}
          className="mt-6 rounded-md bg-[#c5a572] text-white text-xl font-bold shadow-lg  transition flex items-center justify-center z-20"
          style={{ width: "auto", height: "auto", minWidth: 120 }}
          aria-label="Start QR Scan"
        >
          <span className="text-3xl">Scan</span>
        </button>
      </>
    );
  };
  const successState = () => {
    
    return (
              <div className="rounded-full bg-green-500 flex flex-col items-center justify-center w-83 h-83">
            <span className="text-white text-5xl mb-4 z-20">✅</span>
            <span className="text-white text-2xl font-bold text-center px-4 z-20">
                Check-in successful!
            </span>
            <span className="text-white text-lg font-bold text-center px-4 z-20 mt-2">
                Have A Great Class!
            </span>
        </div>
    );
}
    const errorState = () => {
    return (
        <>
            <span className="text-white text-3xl mb-2 z-20">❌</span>
            <span className="text-white text-lg font-bold text-center px-4 z-20">
                { "Please See Front Desk" }  
            </span>
            <button
                onClick={() => setStatus("idle")}
                className="mt-6 rounded-md bg-[#c5a572] text-white text-xl font-bold shadow-lg  transition flex items-center justify-center z-20"
                style={{ width: "auto", height: "auto", minWidth: 120 }}
                aria-label="Try Again"
            >
                <span className="text-3xl p-2">Try Again</span>
            </button>
        </>
    );
  }
  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-24 bg-black">
      {/* Always render the reader, just hide it when not scanning */}
      {/* this is the div that holds the scanner */}
      <div
        className={`bg-white rounded-2xl p-6 shadow-xl flex flex-col items-center  ${
          status === 'scanning' ? "block" : "hidden"
        }`}
      >
        {/* The reader is now above, just show the cancel button here */}
        <div
          id="reader"
          style={{
            width: 300,
            height: "auto",
            borderRadius: 16,
            overflow: "hidden",
            margin: "0 auto",
            display: status === 'scanning' ? "block" : "none",
          }}
        />
        <button
          onClick={stopScan}
          className="mt-4 px-6 py-2 rounded-full bg-red-500 text-white font-semibold hover:bg-red-600 transition"
        >
          Cancel
        </button>
      </div>

      {status !== 'scanning' && (
        <div className="flex flex-col items-center mb-8 relative">
          {/* Halo */}
          <div
            className="flex flex-col items-center justify-center rounded-full bg-black shadow-lg border-5 "
            style={{ width: 340, height: 340 }}
          >
            {/* Spinning border overlay when loading */}
            {status === "loading" && (
              <div
                className="absolute inset-0 rounded-full border-8 border-[#c5a572] border-t-transparent animate-spin pointer-events-none"
                style={{
                  width: 340,
                  height: 340,
                  left: 0,
                  top: 0,
                  zIndex: 10,
                }}
              />
            )}
            {/* FIXME fix the states so that way it doesnt go to error and then success */}
            {status === "idle" ? scanState() : status === "scanned" ? "" : status === 'success' ? successState() : status === 'error' ? errorState() : ""}
          </div>
        </div>
      )}
    </main>
  )
}