const _apiBase =
  "https://movie-searcher-1.herokuapp.com/api" || "http://localhost:3001/";

const useLocalServer = () => {
  console.log(_apiBase);
  const request = async (url, option) => {
    try {
      const response = await fetch(url, option);
      return response.json();
    } catch (err) {
      console.log(err);
    }
  };

  const deleteMovie = (id) => {
    request(`${_apiBase}movies/${id}`, {
      method: "DELETE",
    });
  };

  const postMovie = (collectionId, movieId, title, poster) => {
    request(`${_apiBase}movies`, {
      method: "POST",
      body: JSON.stringify({
        collectionId,
        // movieId,
        title,
        poster,
        id: movieId,
      }),
      headers: {
        "Content-type": "application/json; charset=UTF-8",
      },
    });
  };

  const getUserMovie = (movieId) => request(`${_apiBase}movies/${movieId}`);
  const getUserMovies = () => request(`${_apiBase}movies`);
  const getUserCollections = () => request(`${_apiBase}collections`);
  const patchMovie = (movieId, collectionId) => {
    return request(`${_apiBase}movies/${movieId}`, {
      method: "PATCH",
      body: JSON.stringify({
        collectionId,
      }),
      headers: {
        "Content-type": "application/json; charset=UTF-8",
      },
    });
  };

  return {
    deleteMovie,
    patchMovie,
    postMovie,
    getUserMovie,
    getUserMovies,
    getUserCollections,
  };
};

export default useLocalServer;
