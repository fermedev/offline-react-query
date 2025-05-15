export const movies = [
  {
    id: 1,
    title: 'Fjallraven - Foldsack No. 1 Backpack, Fits 15 Laptops',
    price: 109.95,
    description:
      'Your perfect pack for everyday use and walks in the forest. Stash your laptop (up to 15 inches) in the padded sleeve, your everyday',
    category: "men's clothing",
    image: 'https://fakestoreapi.com/img/81fPKd-2AYL._AC_SL1500_.jpg',
    rating: {
      rate: 3.9,
      count: 120,
    },
  },
];

export type Movie = (typeof movies)[number];

export const fetchMovie = async (id: string): Promise<Movie> => {
  const response = await fetch(`https://fakestoreapi.com/products/${id}`);
  const data = await response.json();
  return data;
};

export const fetchMovies = async (): Promise<Movie[]> => {
  const response = await fetch('https://fakestoreapi.com/products');
  return await response.json();
};

export const updateMovie = async (id: string, title: string) => {
  const response = await fetch(`https://fakestoreapi.com/products/${id}`, {
    method: 'PATCH',
    body: JSON.stringify({ title }),
    headers: { 'Content-Type': 'application/json' },
  });
  const data = await response.json();

  return data;
};
