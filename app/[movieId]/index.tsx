import { useMovie } from '@/utils/movies';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { Button, Text, TextInput, View } from 'react-native';

export default function MovieDetail() {
  const router = useRouter();
  const { movieId } = useLocalSearchParams<{ movieId: string }>();

  const { title, setTitle, updateMovie, movieQuery } = useMovie(movieId);

  if (movieQuery.isLoading) {
    return (
      <View>
        <Text>Loading...</Text>
      </View>
    );
  }

  if (movieQuery.data) {
    return (
      <View>
        <Text>Movie: {movieQuery.data.title}</Text>
        <Text>
          Try to mock offline behaviour with the button in the devtools, then
          update the comment. The optimistic update will succeed, but the actual
          mutation will be paused and resumed once you go online again.
        </Text>
        <Text>
          You can also reload the page, which will make the persisted mutation
          resume, as you will be online again when you come back.
        </Text>
        <Text>TITLE:</Text>
        <TextInput value={title} onChangeText={setTitle} />
        <Button
          title='Submit'
          disabled={!title}
          onPress={() =>
            updateMovie.mutate({
              id: movieId,
              title,
            })
          }
        />
        <Text>
          Updated at: {new Date(movieQuery.dataUpdatedAt).toLocaleTimeString()}
        </Text>
        <Text>{movieQuery.isFetching && 'fetching...'}</Text>
        <Text>
          {updateMovie.isPaused
            ? 'mutation paused - offline'
            : updateMovie.isPending && 'updating...'}
        </Text>
      </View>
    );
  }

  if (movieQuery.isPaused) {
    return (
      <View>
        <Text>We are offline and have no data to show </Text>
      </View>
    );
  }

  return null;
}
