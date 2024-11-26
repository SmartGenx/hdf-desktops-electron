import { useState, useEffect } from 'react';

function useInternetStatus() {
  const [isConnected, setIsConnected] = useState(navigator.onLine);

  useEffect(() => {
    const updateOnlineStatus = () => setIsConnected(navigator.onLine);

    window.addEventListener('online', updateOnlineStatus);
    window.addEventListener('offline', updateOnlineStatus);

    return () => {
      window.removeEventListener('online', updateOnlineStatus);
      window.removeEventListener('offline', updateOnlineStatus);
    };
  }, []);

  return isConnected;
}
