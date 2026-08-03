import { useEffect, useState } from 'react';
import type { HealthData } from '@syami/shared';
import { apiClient } from '@/lib/api';

export type BackendStatus = 'checking' | 'online' | 'offline';

interface BackendHealthState {
  status: BackendStatus;
  data: HealthData | null;
}

export const useBackendHealth = (): BackendHealthState => {
  const [state, setState] = useState<BackendHealthState>({ status: 'checking', data: null });

  useEffect(() => {
    let cancelled = false;

    apiClient
      .getHealth()
      .then((data) => {
        if (!cancelled) setState({ status: 'online', data });
      })
      .catch(() => {
        if (!cancelled) setState({ status: 'offline', data: null });
      });

    return () => {
      cancelled = true;
    };
  }, []);

  return state;
};
