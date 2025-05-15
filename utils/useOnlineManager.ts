import { onlineManager, useQueryClient } from '@tanstack/react-query';
import { useNetworkState } from 'expo-network';
import { useEffect } from 'react';

export function useOnlineManager() {
  const { isConnected } = useNetworkState();
  const queryClient = useQueryClient();

  useEffect(() => {
    onlineManager.setOnline(!!isConnected);
    if (!!isConnected) {
      queryClient.refetchQueries();
    }
  }, [isConnected]);
}
