import * as api from '@/utils/api';
import { movieKeys } from '@/utils/movies';
import { useQuery } from '@tanstack/react-query';
import { Link } from 'expo-router';
import { Text, View } from 'react-native';

export default function Index() {
  const { data, isPending, isSuccess, isFetching, dataUpdatedAt } = useQuery({
    queryKey: movieKeys.list(),
    queryFn: api.fetchMovies,
  });

  if (isPending) {
    return (
      <View>
        <Text>Loading...</Text>
      </View>
    );
  }

  if (isSuccess) {
    return (
      <View>
        <Text>Movies</Text>
        <Text>
          Try to mock offline behaviour with the button in the devtools. You can
          navigate around as long as there is already data in the cache. You
          will get a refetch as soon as you go online again.
        </Text>
        <View style={{ gap: 24, marginVertical: 24 }}>
          {data?.map((movie) => (
            <View key={movie.id}>
              <Link href={`/${movie.id}`}>{movie.title}</Link>
            </View>
          ))}
        </View>
        <Text>Updated at: {new Date(dataUpdatedAt).toLocaleTimeString()}</Text>
        <Text>{isFetching && 'fetching...'}</Text>
      </View>
    );
  }

  // query will be in 'idle' fetchStatus while restoring from localStorage
  return null;
}
