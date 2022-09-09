import React, { useEffect, useState } from "react";
import { Typography, Box, Button } from "@mui/material";
import { useDispatch, useSelector } from "react-redux";
import { useLocation } from "react-router-dom";
import SearchIcon from "@mui/icons-material/Search";
import MoviesList from "./movies-list/MoviesList";
import { moviesFetching, moviesFetched, moviesFetchingError } from "../actions";
import useMoviesService from "./movies-filters/service/movies-server";

function SearchedTitleList() {
  const dispatch = useDispatch();
  const filteredMovies = useSelector((state) => state.reducer.filteredMovies);
  const query = useLocation().search.split("=")[1];
  const { getSearchedTitle } = useMoviesService();
  const [pageNumber, setPageNumber] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  useEffect(() => setPageNumber(1), [query]);
  useEffect(() => {
    if (pageNumber === 1) {
      dispatch(moviesFetching());
      getSearchedTitle("movie", query, pageNumber)
        .then((res) => {
          dispatch(moviesFetched(res.slice(0, res.length - 1)));
          setTotalPages(res[res.length - 1]);
        })
        .catch((e) => moviesFetchingError(e));
    } else if (totalPages > pageNumber) {
      getSearchedTitle("movie", query, pageNumber)
        .then((res) =>
          dispatch(
            moviesFetched([...filteredMovies, ...res.slice(0, res.length - 1)]),
          ),
        )
        .catch((e) => moviesFetchingError(e));
    }
  }, [query, pageNumber]);
  return (
    <Box sx={{ padding: "0 2em", mb: "2em" }}>
      <Box sx={{ display: "flex", flexDirection: "column" }}>
        <Typography
          color="primary"
          component="span"
          variant="h4"
          sx={{
            fontVariant: "all-petite-caps",
            display: "flex",
            alignItems: "center",
            margin: "10px auto",
            width: "fit-content",
          }}
        >
          <SearchIcon
            sx={{ alignItems: "center" }}
            color="primary"
            fontSize="large"
          />
          {query.replace(/%20/g, " ")}
        </Typography>
        <MoviesList />
        {pageNumber < totalPages - 1 && totalPages > 1 && (
          <Button
            sx={{ mt: "1em" }}
            onClick={() => setPageNumber(pageNumber + 1)}
          >
            Load more
          </Button>
        )}
      </Box>
    </Box>
  );
}

export default SearchedTitleList;
