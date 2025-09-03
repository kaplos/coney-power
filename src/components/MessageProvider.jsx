import React, { createContext, useContext, useState, useCallback } from 'react';

const MessageContext = createContext();

export function useMessage() {
  return useContext(MessageContext);
}

export function MessageProvider({ children }) {
  const [message, setMessage] = useState('');
  const [type, setType] = useState('error');

  const showMessage = useCallback((msg, msgType = 'error') => {
    setMessage(msg);
    setType(msgType);
  }, []);

  const clearMessage = useCallback(() => setMessage(''), []);

  return (
    <MessageContext.Provider value={{ showMessage, clearMessage }}>
      {children}
      {message && (
        <div
          className={`fixed top-5 right-5 z-50 px-4 py-3 rounded shadow-lg flex items-center space-x-2
            ${type === 'error' ? 'bg-red-100 text-red-700' : 'bg-green-100 text-green-700'}`}
          role="alert"
        >
          <span>{message}</span>
          <button
            onClick={clearMessage}
            className="ml-2 text-lg font-bold focus:outline-none"
            aria-label="Close"
          >
            ×
          </button>
        </div>
      )}
    </MessageContext.Provider>
  );
}