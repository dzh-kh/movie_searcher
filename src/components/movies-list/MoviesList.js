import React, { useState } from "react";
import SearchOffIcon from "@mui/icons-material/SearchOff";
import {
  Grid,
  Typography,
  Divider,
  Rating,
  Tooltip,
  Box,
  CircularProgress,
} from "@mui/material";
import { motion } from "framer-motion";

import { useSelector } from "react-redux";
import ErrorPage from "../ErrorPage";
import MovieCard from "../MovieCard";

function MoviesList() {
  const { moviesLoadingStatus, filteredMovies } = useSelector(
    (state) => state.reducer,
  );
  const content =
    filteredMovies.length >= 1 ? (
      filteredMovies.map((el) => <SingleMovie movies={el} key={el.id} />)
    ) : (
      <Box>
        <Typography
          component={motion.div}
          initial={{ color: "#0277bd" }}
          animate={{ color: "#673ab7" }}
          sx={{ fontSize: "3em", fontFamily: "Bebas Neue" }}
        >
          NOTHING FOUND
          <Box
            component={motion.div}
            sx={{ display: "inline-block" }}
            initial={{ rotate: "0deg" }}
            animate={{ rotate: "360deg" }}
          >
            <SearchOffIcon fontSize="large" color="warning" />
          </Box>
        </Typography>
      </Box>
    );

  return (
    <Grid
      container
      sx={{
        alignItems: "center",
        display: "flex",
        justifyContent: "flex-start",
        position: "relative",
        flexWrap: "nowrap",
        flexDirection: "column",
        padding: 0,
      }}
    >
      <Grid
        item
        sx={{
          alignContent: "flex-start",
          justifyContent: "center",
          minWidth: "100%",
          minHeight: "88vh",
          display: "flex",
          flexWrap: "wrap",
        }}
      >
        {moviesLoadingStatus === "loading" && <CircularProgress />}
        {moviesLoadingStatus === "error" && <ErrorPage />}
        {moviesLoadingStatus === "idle" && content}
      </Grid>
    </Grid>
  );
}

export function SingleMovie({ movies }) {
  const [isOpen, setIsOpen] = useState(false);
  const handleMouseOver = () => setIsOpen(true);
  const handleMouseOut = () => setIsOpen(false);
  return (
    <Tooltip
      open={isOpen}
      leaveTouchDelay={0}
      placement="right"
      title={<SingleMovieTooltip movieInfo={movies} />}
    >
      <Box
        onMouseEnter={handleMouseOver}
        onMouseLeave={handleMouseOut}
        sx={{
          margin: "7px",
          width: "17%",
          "@media (max-width: 980px)": {
            width: "22%",
          },
          "@media (max-width: 500px)": {
            width: "46%",
          },
        }}
      >
        <MovieCard movieInfo={movies} isOpen={isOpen} />
      </Box>
    </Tooltip>
  );
}

function SingleMovieTooltip({ movieInfo }) {
  const {
    title,
    vote,
    voteCount,
    releaseDate,
    overview,
    popularity,
    backdrop,
  } = movieInfo;
  const style = {
    background: "linear-gradient(35deg, #64b5f6, #e3f2fd)",
    color: "black",
    padding: "5px",
    borderRadius: "7px",
    margin: "4px",
    verticalAlign: "center",
    width: "fit-content",
  };
  return (
    <Box
      sx={{
        pointerEvents: "none",
        backgroundColor: `rgba(50, 42, 26, 0)`,
        color: "white",
        backdropFilter: `saturate(180%) blur(10px)`,
        width: 400,
        zIndex: 400,
        background: `url(${backdrop})`,
        backgroundPosition: "center",
        backgroundSize: "cover",
        alignItems: "center",
      }}
    >
      <Grid
        sx={{
          padding: "10px",
          border: "5px solid transparent",
          borderImage: `linear-gradient(to left top,#004d40 30%,  transparent 50%, transparent 40%, #4db6ac 90%)`,
          borderImageSlice: 1,
        }}
        justifyContent="space-between"
        spacing={0.5}
        container
      >
        <Grid item>
          <Typography sx={style} variant="h5">
            {title}
          </Typography>
          <Typography sx={style}>{`release date: ${releaseDate}`}</Typography>{" "}
          <Typography sx={style}>{`popularity: ${popularity}`}</Typography>
        </Grid>
        <Grid item>
          <Typography sx={style}>
            <Typography>{`vote: ${vote}`}</Typography>
            <Rating max={10} value={vote} />
          </Typography>
          <Divider sx={{ background: "white" }} light />
          <Typography sx={style}>{`vote count: ${voteCount}`}</Typography>
        </Grid>
        <Grid item>
          <Typography
            sx={{
              background: "linear-gradient(35deg, #64b5f6, #e3f2fd)",
              color: "black",
              padding: "3px",
              borderRadius: "13px",
            }}
          >
            {overview}
          </Typography>
        </Grid>
      </Grid>
    </Box>
  );
}

export default MoviesList;
