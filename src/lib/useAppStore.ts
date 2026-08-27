import { useState, useEffect, useCallback } from 'react';
import { loadStore, saveStore, AppStoreData, AdminActions } from './store';

export function useAppStore() {
  const [store, setStore] = useState<AppStoreData>(() => loadStore());

  useEffect(() => {
    const handleUpdate = (e: Event) => {
      if ((e as CustomEvent).detail) {
        setStore((e as CustomEvent).detail);
      } else {
        setStore(loadStore());
      }
    };

    const handleStorage = (e: StorageEvent) => {
      if (e.key === '11to12_app_store_v1' && e.newValue) {
        try {
          setStore(JSON.parse(e.newValue));
        } catch (err) {
          setStore(loadStore());
        }
      }
    };

    window.addEventListener('11to12_store_update', handleUpdate);
    window.addEventListener('storage', handleStorage);

    let channel: BroadcastChannel | null = null;
    try {
      if ('BroadcastChannel' in window) {
        channel = new BroadcastChannel('11to12_realtime_sync');
        channel.onmessage = () => {
          setStore(loadStore());
        };
      }
    } catch (e) {
      // ignore
    }

    return () => {
      window.removeEventListener('11to12_store_update', handleUpdate);
      window.removeEventListener('storage', handleStorage);
      if (channel) channel.close();
    };
  }, []);

  const updateStore = useCallback((updater: (prev: AppStoreData) => AppStoreData) => {
    const current = loadStore();
    const updated = updater(current);
    saveStore(updated);
    setStore(updated);
  }, []);

  return {
    store,
    updateStore,
    actions: AdminActions
  };
}
