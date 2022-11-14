const _apiKey = "fe091d29a91ecfeb46e859838d70f309";
const _apiBase = "https://api.themoviedb.org/";
const _imgBase = "https://image.tmdb.org/t/p/original";
const noAvatar =
  " https://vdostavka.ru/wp-content/uploads/2019/05/no-avatar.png";
const noPoster =
  "https://www.design-your-t-shirt.com/designs/image-not-found-custom-t-shirt-1002405696.png";

const useMoviesService = () => {
  const request = async (url) => {
    const response = await fetch(url);
    return response.json();
  };

  const getSearchedTitle = async (title, name, page = 1) => {
    const res = await request(
      `${_apiBase}3/search/${title}?api_key=${_apiKey}&language=en-US&query=${name}&page=${page}`,
    );
    return title === "movie"
      ? res.results
          .map((el) => {
            return {
              value: el.id,
              label: el.title,
              ..._movieTransform(false, el),
            };
          })
          .concat(res.total_pages)
      : res.results.map((el) => {
          return { value: el.id, label: el.name };
        });
  };

  const getCollectionMovies = async (id) => {
    const res = await request(
      `${_apiBase}3/collection/${id}?api_key=${_apiKey}&language=en-US`,
    );
    return res.parts
      .map((movie) => _movieTransform(false, movie))
      .concat([
        {
          id: res.id,
          name: res.name,
          overview: res.overview,
          backdrop: `${_imgBase}${res.backdrop_path}`,
        },
      ]);
  };

  const getFilteredMovies = async (getParams, page = 1) => {
    const res = await request(
      `${_apiBase}3/discover/movie?api_key=${_apiKey}&page=${page}&language=en-US${getParams}`,
    );
    return res.results.map((movie) => {
      const totalPages = { totalPages: res.total_pages };
      return Object.assign(totalPages, _movieTransform(false, movie));
    });
  };

  const getSimilarMovies = async (id) => {
    const res = await request(
      `${_apiBase}3/movie/${id}/similar?api_key=${_apiKey}&page=1&language=en-US`,
    );
    return res.results.map((movie) => _movieTransform(false, movie));
  };

  const getPopularMovies = async () => {
    const res = await request(
      `${_apiBase}3/movie/popular?api_key=${_apiKey}&language=ru-RU&page=1`,
    );
    return res.results.map((movie) => _movieTransform(false, movie));
  };

  const getMovieReviews = async (id) => {
    const res = await request(
      `${_apiBase}3/movie/${id}/reviews?api_key=${_apiKey}&language=en-US&page=1`,
    );
    return res.results.map((review) => _movieReviewTransform(review));
  };

  const getMovieCast = async (id) => {
    const res = await request(
      `${_apiBase}3/movie/${id}/credits?api_key=${_apiKey}&language=en-US&page=1`,
    );
    return res.cast
      .map((actor) => _castTransform(actor))
      .concat(
        _castTransform(res.crew.filter((el) => el.job === "Director")[0]),
      );
  };

  const getMovieDetails = async (id) => {
    const res = await request(
      `${_apiBase}3/movie/${id}?api_key=${_apiKey}&language=en-US`,
    );
    return _movieTransform(true, res);
  };

  const getMovieGenresList = async () => {
    const res = await request(
      `${_apiBase}3/genre/movie/list?api_key=${_apiKey}&language=en-US`,
    );
    return res.genres;
  };

  const _movieReviewTransform = (review) => {
    return {
      author: review.author,
      avatar: `${_imgBase}${review.author_details.avathar_path}`,
      content: review.content,
      id: review.id,
      update: review.updated_at
        .replace(/-/g, "-")
        .replace(/[TZ]/g, " ")
        .replace(/:[^:]*$/, ""),
    };
  };

  function _castTransform(actor) {
    return {
      name: actor.name,
      popularity: actor.popularity,
      mainMovies: actor.known_for,
      cast: actor.known_for_department,
      character: actor.character,
      castId: actor.id,
      thumbnail:
        actor.profile_path !== null
          ? `${_imgBase}${actor.profile_path}`
          : noAvatar,
      backdrop: `${_imgBase}${actor.backdrop_path}`,
    };
  }

  function _movieTransform(isDetailsNeed, movie) {
    const info = {
      title: movie.title,
      overview: movie.overview,
      poster:
        movie.poster_path !== null
          ? `${_imgBase}${movie.poster_path}`
          : noPoster,
      releaseDate: movie.release_date,
      vote: +movie.vote_average,
      voteCount: movie.vote_count,
      adult: movie.adult,
      id: movie.id,
      language: movie.original_language,
      backdrop:
        movie.backdrop_path !== null
          ? `${_imgBase}${movie.backdrop_path}`
          : "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcREyfLOQF1OkIoPCBtkBOlON1OHNFS2I4An2QQfVjmwM7iryhhHf7WdWfQURfAl76upAQ&usqp=CAU",
      popularity: movie.popularity,
    };

    if (!isDetailsNeed) return info;
    const details = {
      collection: movie.belongs_to_collection,
      genres: movie.genres.map((el) => el.name),
      originalTitle: movie.original_title,
      companies: movie.production_companies.map((el) => el.name),
      countries: movie.production_countries.map((el) => el.name),
      runtime: movie.runtime,
      tagline: movie.tagline ? `"${movie.tagline}"` : null,
      collection: movie.belongs_to_collection,
      budget: movie.budget ? `$${movie.budget.toLocaleString()}` : null,
      status: movie.status,
    };
    return Object.assign(info, details);
  }
  return {
    getFilteredMovies,
    getMovieReviews,
    getPopularMovies,
    getMovieCast,
    getSimilarMovies,
    getSearchedTitle,
    getMovieGenresList,
    getMovieDetails,
    getCollectionMovies,
  };
};

export default useMoviesService;
