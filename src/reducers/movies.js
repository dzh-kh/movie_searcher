const initialState = {
  query: "",
  movieReviews: [],
  movies: {},
  moviesLoadingStatus: "loading",
  popularMoviesLoadingStatus: "idle",
  similarMoviesLoadingStatus: "idle",
  filteredMovies: [],
  popularMovies: [],
  searchedTitle: [],
  similarMovies: [],
  filterParams: {},
};

const movies = (state = initialState, action) => {
  switch (action.type) {
    case "MOVIES_FETCHING":
      return {
        ...state,
        moviesLoadingStatus: "loading",
      };
    case "MOVIES_FETCHED":
      return {
        ...state,
        filteredMovies: action.payload,
        moviesLoadingStatus: "idle",
      };
    case "MOVIES_FETCHING_ERROR":
      return {
        ...state,
        moviesLoadingStatus: "error",
      };

    case "SIMILAR_MOVIES_FETCHING":
      return {
        ...state,
        similarMoviesLoadingStatus: "loading",
      };
    case "SIMILAR_MOVIES_FETCHED":
      return {
        ...state,
        similarMovies: action.payload,
        similarMoviesLoadingStatus: "idle",
      };
    case "SIMILAR_MOVIES_FETCHING_ERROR":
      return {
        ...state,
        similarMoviesLoadingStatus: "error",
      };

    case "POPULAR_MOVIES_FETCHING":
      return {
        ...state,
        popularMoviesLoadingStatus: "loading",
      };
    case "POPULAR_MOVIES_FETCHED":
      return {
        ...state,
        popularMovies: action.payload,
        popularMoviesLoadingStatus: "idle",
      };
    case "POPULAR_MOVIES_FETCHING_ERROR":
      return {
        ...state,
        popularMoviesLoadingStatus: "error",
      };

    case "SEARCHED_TITLE_FETCHING":
      return {
        ...state,
        moviesLoadingStatus: "loading",
      };
    case "SEARCHED_TITLE_FETCHED":
      return {
        ...state,
        popularMovies: action.payload,
        moviesLoadingStatus: "idle",
      };
    case "SEARCHED_TITLE_FETCHING_ERROR":
      return {
        ...state,
        moviesLoadingStatus: "error",
      };

    case "PARAMS_FETCHED":
      return {
        ...state,
        filterParams: action.payload,
      };

    default:
      return { ...state };
  }
};

export default movies;
