import React, { createContext, useContext, useState, useCallback, useRef, useEffect } from 'react';

const MessageContext = createContext();

export function useMessage() {
  return useContext(MessageContext);
}

export function MessageProvider({ children }) {
  const [message, setMessage] = useState('');
  const [type, setType] = useState('error');
  const [secondsLeft, setSecondsLeft] = useState(0);

  const intervalRef = useRef(null);
  const timeoutRef = useRef(null);

  const clearTimers = useCallback(() => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
      timeoutRef.current = null;
    }
  }, []);

  const clearMessage = useCallback(() => {
    clearTimers();
    setMessage('');
    setSecondsLeft(0);
  }, [clearTimers]);

  const showMessage = useCallback((msg, msgType = 'error', duration = 5) => {
    clearTimers();
    setMessage(msg);
    setType(msgType);
    setSecondsLeft(duration);

    // countdown interval for UI
    intervalRef.current = setInterval(() => {
      setSecondsLeft(prev => {
        if (prev <= 1) {
          // let timeout handle final clear to keep timing consistent
          clearInterval(intervalRef.current);
          intervalRef.current = null;
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    // auto-dismiss after duration seconds
    timeoutRef.current = setTimeout(() => {
      clearMessage();
    }, duration * 1000);
  }, [clearMessage, clearTimers]);

  // cleanup on unmount
  useEffect(() => {
    return () => clearTimers();
  }, [clearTimers]);

  return (
    <MessageContext.Provider value={{ showMessage, clearMessage }}>
      {children}
      {message && (
        <div
          className={`fixed top-5 right-5 z-50 px-4 py-3 rounded shadow-lg flex items-center space-x-3
            ${type === 'error' ? 'bg-red-100 text-red-700' : 'bg-green-100 text-green-700'}`}
          role="alert"
        >
          <span className="font-medium">{message}</span>

          {/* countdown */}
          <span className="ml-2 text-sm opacity-80">({secondsLeft}s)</span>

          <button
            onClick={clearMessage}
            className="ml-3 text-lg font-bold focus:outline-none"
            aria-label="Close"
          >
            ×
          </button>
        </div>
      )}
    </MessageContext.Provider>
  );
}