import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import * as React from 'react';
import type { Movie } from './api';
import * as api from './api';

export const movieKeys = {
  all: () => ['movies'],
  list: () => [...movieKeys.all(), 'list'],
  details: () => [...movieKeys.all(), 'detail'],
  detail: (id: string) => [...movieKeys.details(), id],
};

export const useMovie = (movieId: string) => {
  const queryClient = useQueryClient();

  const movieQuery = useQuery({
    queryKey: movieKeys.detail(movieId),
    queryFn: () => api.fetchMovie(movieId),
  });

  const [title, setTitle] = React.useState<string | undefined>();

  const updateMovie = useMutation({
    mutationKey: movieKeys.detail(movieId),
    onMutate: async () => {
      await queryClient.cancelQueries({ queryKey: movieKeys.detail(movieId) });
      const previousData = queryClient.getQueryData<Movie>(
        movieKeys.detail(movieId),
      );

      // remove local state so that server state is taken instead
      setTitle(undefined);

      queryClient.setQueryData(movieKeys.detail(movieId), {
        ...previousData,
        title,
      });

      return { previousData };
    },
    onSuccess: async () => {
      await queryClient.invalidateQueries();
    },
    onError: (_, __, context) => {
      queryClient.setQueryData(
        movieKeys.detail(movieId),
        context?.previousData,
      );
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: movieKeys.detail(movieId) });
    },
  });

  return {
    title: title ?? movieQuery.data?.title,
    setTitle,
    updateMovie,
    movieQuery,
  };
};
