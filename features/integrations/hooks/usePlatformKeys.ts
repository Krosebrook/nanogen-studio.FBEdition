
import { useState, useEffect, useCallback } from 'react';
import { logger } from '@/shared/utils/logger';

export type PlatformKeyStore = Record<string, Record<string, string>>;

const STORAGE_KEY = 'nanogen_platform_keys';

export const usePlatformKeys = () => {
  const [keyStore, setKeyStore] = useState<PlatformKeyStore>(() => {
    if (typeof window === 'undefined') return {};
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      return stored ? JSON.parse(stored) : {};
    } catch (e) {
      logger.error('Failed to parse key store from local storage', e);
      return {};
    }
  });

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(keyStore));
  }, [keyStore]);

  const saveKey = useCallback((platformId: string, keyId: string, value: string) => {
    setKeyStore(prev => ({
      ...prev,
      [platformId]: {
        ...(prev[platformId] || {}),
        [keyId]: value
      }
    }));
  }, []);

  const clearPlatformKeys = useCallback((platformId: string) => {
    setKeyStore(prev => {
      const next = { ...prev };
      delete next[platformId];
      return next;
    });
  }, []);

  const getKeysForPlatform = useCallback((platformId: string) => {
    return keyStore[platformId] || {};
  }, [keyStore]);

  const isPlatformConfigured = useCallback((platformId: string, requiredKeyIds: string[]) => {
    const keys = keyStore[platformId];
    if (!keys) return false;
    return requiredKeyIds.every(id => !!keys[id]);
  }, [keyStore]);

  return {
    keyStore,
    saveKey,
    clearPlatformKeys,
    getKeysForPlatform,
    isPlatformConfigured
  };
};
