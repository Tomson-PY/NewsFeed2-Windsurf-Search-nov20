import React, { useEffect, useState } from 'react';
import { CheckCircle, XCircle } from 'lucide-react';

interface NotificationProps {
  message: string;
  type?: 'success' | 'error';
}

export const Notification: React.FC<NotificationProps> = ({ message, type = 'success' }) => {
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(false);
    }, 3000);

    return () => clearTimeout(timer);
  }, []);

  if (!isVisible) return null;

  return (
    <div className="fixed bottom-4 right-4 z-50 animate-in slide-in-from-bottom-2">
      <div
        className={`flex items-center space-x-2 px-4 py-2 rounded-lg shadow-lg ${
          type === 'success'
            ? 'bg-emerald-50 text-emerald-900 dark:bg-emerald-900/20 dark:text-emerald-300'
            : 'bg-red-50 text-red-900 dark:bg-red-900/20 dark:text-red-300'
        }`}
      >
        {type === 'success' ? (
          <CheckCircle className="h-5 w-5" />
        ) : (
          <XCircle className="h-5 w-5" />
        )}
        <p className="text-sm font-medium">{message}</p>
      </div>
    </div>
  );
};
