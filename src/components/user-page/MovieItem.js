import React, { useState } from "react";
import { Box, IconButton, Menu, MenuItem } from "@mui/material";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";
import MoveDownIcon from "@mui/icons-material/MoveDown";
import MovieCard from "../MovieCard";

import useLocalServer from "../movies-filters/service/local-server";

function MovieItem({ movieInfo, ...restProps }) {
  const { id, collectionId } = movieInfo;
  const [isOpen, setIsOpen] = useState(false);
  const handleMouseOver = () => setIsOpen(true);
  const handleMouseOut = () => setIsOpen(false);
  return (
    <Box
      onMouseEnter={handleMouseOver}
      onMouseLeave={handleMouseOut}
      sx={{
        margin: "10px 0 10px 10px",
        maxHeight: "90%",
        minWidth: "12%",
        maxWidth: "12%",
      }}
    >
      <MovieCard movieInfo={movieInfo} isOpen={isOpen}>
        <MovieItemChange
          movieId={id}
          collectionId={collectionId}
          restProps={restProps}
          isOpen={isOpen}
        />
      </MovieCard>
    </Box>
  );
}

export default MovieItem;

function MovieItemChange({ movieId, restProps, isOpen, collectionId }) {
  const { deleteMovie, patchMovie } = useLocalServer();
  const { setMovies, movies, collection } = restProps;
  const [anchorEl, setAnchorEl] = useState(null);
  const handleMovieChange = () => {
    setMovies(movies.filter((el) => el.id !== movieId));
    deleteMovie(movieId);
  };

  const open = Boolean(anchorEl);
  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = async (e, collectionId) => {
    if (typeof collectionId === "number") {
      const res = await patchMovie(movieId, collectionId);
      setMovies(movies.map((el) => (el.id == movieId ? res : el)));
    }
    setAnchorEl(null);
  };
  const menuItemList = collection.map(
    (el) =>
      el.id !== collectionId && (
        <MenuItem key={el.id} onClick={(e) => handleClose(e, el.id)}>
          {el.label}
        </MenuItem>
      )
  );
  return (
    <>
      <IconButton
        onClick={handleMovieChange}
        sx={{
          display: isOpen || anchorEl ? "block" : "none",
          position: "absolute",
          top: "15%",
          left: "30%",
          color: "white",
          zIndex: "30",
        }}
      >
        <DeleteOutlineIcon />
      </IconButton>
      <IconButton
        onClick={handleClick}
        sx={{
          zIndex: "30",
          display: isOpen || anchorEl ? "block" : "none",
          position: "absolute",
          top: "30%",
          left: "30%",
          color: "white",
        }}
      >
        <MoveDownIcon />
      </IconButton>
      <Menu
        id="basic-menu"
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
        MenuListProps={{
          "aria-labelledby": "basic-button",
        }}
      >
        {menuItemList}
      </Menu>
    </>
  );
}
