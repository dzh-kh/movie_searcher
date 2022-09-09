import React, { useState, useEffect } from "react";
import { Typography, Button, Box, Grid } from "@mui/material";
import { useDispatch } from "react-redux";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import ArrowBackIosIcon from "@mui/icons-material/ArrowBackIos";
import MoviesList from "./movies-list/MoviesList";
import { moviesFetching, moviesFetched, moviesFetchingError } from "../actions";

import useMoviesService from "./movies-filters/service/movies-server";

function SingleCollectionPage() {
  const { id } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [collectionInfo, setCollectionInfo] = useState({});
  const { getCollectionMovies } = useMoviesService();
  useEffect(() => {
    dispatch(moviesFetching());
    getCollectionMovies(id)
      .then((res) => {
        dispatch(moviesFetched(res.slice(0, res.length - 1)));
        setCollectionInfo(res[res.length - 1]);
      })
      .catch((e) => moviesFetchingError(e));
  }, []);
  const [prevPath, setPrevPath] = useState();
  console.log(useLocation().state);
  const locationState = useLocation().state;
  useEffect(() => {
    setPrevPath(locationState);
  }, []);
  const { name, overview, backdrop } = collectionInfo;
  return (
    <Grid container>
      <Box
        sx={{
          minWidth: "100vw",
          minHeight: "80vh",
          background: `url(${backdrop})`,
          backgroundRepeat: "no-repeat",
        }}
      >
        <Grid
          container
          item
          sx={{
            color: "white",
            justifyContent: "center",
            m: "10em 3em 1em 3em",
            background: "rgba(0, 0, 0, 0.7)",
            width: "fit-content",
            padding: "1em",
          }}
        >
          <Button
            onClick={() => navigate(prevPath)}
            sx={{
              position: "absolute",
              top: "10em",
              left: "4em",
              color: "white",
              backdropFilter: "brightness(0.5)",
            }}
            variant="outlined"
          >
            <ArrowBackIosIcon sx={{ mr: "0.5em" }} /> Go back
          </Button>
          <Typography variant="h2">{name}</Typography>
          <Typography>{overview}</Typography>
        </Grid>
      </Box>
      <Grid item container sx={{ m: "0 10% 10% 10%", width: "80%" }}>
        <MoviesList
          count={0}
          currentPage={1}
          setCurrentPage={() => console.log("hey")}
        />
      </Grid>
    </Grid>
  );
}

export default SingleCollectionPage;
