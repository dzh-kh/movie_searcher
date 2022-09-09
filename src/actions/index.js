export const moviesFetching = () => {
  return {
    type: "MOVIES_FETCHING",
  };
};

export const moviesFetched = (movies) => {
  return {
    type: "MOVIES_FETCHED",
    payload: movies,
  };
};

export const moviesFetchingError = () => {
  return {
    type: "MOVIES_FETCHING_ERROR",
  };
};

export const similarMoviesFetching = () => {
  return {
    type: "SIMILAR_MOVIES_FETCHING",
  };
};

export const similarMoviesFetched = (movies) => {
  return {
    type: "SIMILAR_MOVIES_FETCHED",
    payload: movies,
  };
};

export const similarMoviesFetchingError = () => {
  return {
    type: "SIMILAR_MOVIES_FETCHING_ERROR",
  };
};

export const popularMoviesFetching = () => {
  return {
    type: "POPULAR_MOVIES_FETCHING",
  };
};

export const popularMoviesFetched = (movies) => {
  return {
    type: "POPULAR_MOVIES_FETCHED",
    payload: movies,
  };
};

export const popularMoviesFetchingError = () => {
  return {
    type: "POPULAR_MOVIES_FETCHING_ERROR",
  };
};

export const searchedTitleFetching = () => {
  return {
    type: "SEARCHED_TITLE_FETCHING",
  };
};

export const searchedTitleFetched = (title) => {
  return {
    type: "SEARCHED_TITLE_FETCHED",
    payload: title,
  };
};

export const searchedTitleFetchingError = () => {
  return {
    type: "SEARCHED_TITLE_FETCHING_ERROR",
  };
};

export const filtersFetching = () => {
  return {
    type: "FILTERS_FETCHING",
  };
};

export const filtersFetched = (filters) => {
  return {
    type: "FILTERS_FETCHED",
    payload: filters,
  };
};

export const filtersFetchingError = () => {
  return {
    type: "FILTERS_FETCHING_ERROR",
  };
};

export const paramsFetched = (params) => {
  return {
    type: "PARAMS_FETCHED",
    payload: params,
  };
};
