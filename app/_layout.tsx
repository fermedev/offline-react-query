import * as api from '@/utils/api';

import { movieKeys } from '@/utils/movies';
import { useOnlineManager } from '@/utils/useOnlineManager';

import AsyncStorage from '@react-native-async-storage/async-storage';
import { createAsyncStoragePersister } from '@tanstack/query-async-storage-persister';
import { MutationCache, QueryClient } from '@tanstack/react-query';
import { PersistQueryClientProvider } from '@tanstack/react-query-persist-client';
import { Stack } from 'expo-router';
import { PropsWithChildren } from 'react';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { useSyncQueriesExternal } from 'react-query-external-sync';
import { toast, Toaster } from 'sonner-native';
// Import Platform for React Native or use other platform detection for web/desktop
import { Platform } from 'react-native';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      gcTime: 1000 * 60 * 60 * 24, // 24hs
      refetchOnReconnect: 'always',
    },
  },
  // configure global cache callbacks to show toast notifications
  mutationCache: new MutationCache({
    onSuccess: (data: any) => {
      toast.success(data.message ?? 'Success!');
    },
    onError: (error) => {
      toast.error(error.message);
    },
  }),
});

// we need a default mutation function so that paused mutations can resume after a page reload
queryClient.setMutationDefaults(movieKeys.all(), {
  mutationFn: async ({ id, title }: { id: string; title: string }) => {
    // to avoid clashes with our optimistic update when an offline mutation continues
    await queryClient.cancelQueries({ queryKey: movieKeys.detail(id) });
    return api.updateMovie(id, title);
  },
});

const asyncStoragePersister = createAsyncStoragePersister({
  storage: AsyncStorage,
});

export default function RootLayout() {
  useSyncQueriesExternal({
    queryClient,
    socketURL: 'http://localhost:42831', // Default port for React Native DevTools
    deviceName: Platform?.OS || 'web', // Platform detection
    platform: Platform?.OS || 'web', // Use appropriate platform identifier
    deviceId: Platform?.OS || 'web', // Use a PERSISTENT identifier (see note below)
    extraDeviceInfo: {
      // Optional additional info about your device
      appVersion: '1.0.0',
      // Add any relevant platform info
    },
    enableLogs: false,
  });
  return (
    <PersistQueryClientProvider
      client={queryClient}
      persistOptions={{ persister: asyncStoragePersister }}
    >
      <ManagerWrapper>
        <GestureHandlerRootView>
          <Stack>
            <Stack.Screen name='index' />
            <Stack.Screen name='[movieId]' />
          </Stack>
          <Toaster />
        </GestureHandlerRootView>
      </ManagerWrapper>
    </PersistQueryClientProvider>
  );
}

function ManagerWrapper({ children }: PropsWithChildren) {
  useOnlineManager();
  return children;
}
