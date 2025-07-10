import { useState, useCallback } from 'react';

export function useSaveNotification(timeout: number = 2000): [boolean, () => void] {
  const [saveNotification, setSaveNotification] = useState(false);

  const showSaveNotification = useCallback(() => {
    setSaveNotification(true);
    setTimeout(() => setSaveNotification(false), timeout);
  }, [timeout]);

  return [saveNotification, showSaveNotification];
} 