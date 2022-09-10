import React, { useEffect, useState } from "react";
import {
  AppBar,
  Toolbar,
  IconButton,
  InputBase,
  Box,
  Avatar,
} from "@mui/material";
import { useDispatch } from "react-redux";
import MenuIcon from "@mui/icons-material/Menu";
import SearchIcon from "@mui/icons-material/Search";
import AnchorIcon from "@mui/icons-material/Anchor";
import { styled, alpha } from "@mui/material/styles";
import { Link, useNavigate } from "react-router-dom";
import { moviesFetching } from "../actions";
import useMoviesService from "./movies-filters/service/movies-server";

const Search = styled("div")(({ theme }) => ({
  padding: "3px 6px",
  display: "flex",
  alignItems: "center",
  position: "relative",
  borderRadius: theme.shape.borderRadius,
  backgroundColor: alpha(theme.palette.common.white, 0.15),
  "&:hover": {
    backgroundColor: alpha(theme.palette.common.white, 0.25),
  },
  marginLeft: 0,
  width: "100%",
  [theme.breakpoints.up("sm")]: {
    marginLeft: theme.spacing(1),
    width: "auto",
  },
}));

export default function Header() {
  return (
    <Box sx={{ flexGrow: 1 }}>
      <AppBar position="static">
        <Toolbar sx={{ display: "flex", justifyContent: "space-between" }}>
          <Box style={{ display: "flex", alignItems: "center" }}>
            <Link style={{ textDecoration: "none", color: "white" }} to="/">
              <IconButton
                size="large"
                edge="start"
                color="inherit"
                aria-label="open drawer"
              >
                LOGO
                <AnchorIcon />
              </IconButton>
            </Link>
            <SearchBar />
          </Box>

          <NavBar />
        </Toolbar>
      </AppBar>
    </Box>
  );
}

function NavBar() {
  return (
    <Link style={{ textDecoration: "none" }} to="/user">
      <IconButton sx={{ p: 0 }}>
        <Avatar
          alt="Remy Sharp"
          src="/static/images/avatar/2.jpg"
          sx={{ ml: "1rem" }}
        />
      </IconButton>
    </Link>
  );
}

function SearchBar() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { getSearchedTitle } = useMoviesService();
  const [value, setValue] = useState("");
  const [options, setOptions] = useState();
  useEffect(() => {
    if (value.length > 0)
      getSearchedTitle("movie", value).then((res) => {
        const results = res.slice(0, res.length - 1);
        return results.length >= 1 ? setOptions([...results]) : setOptions();
      });
    if (value.length === 0) setOptions();
  }, [value]);
  const dataResults = options
    ? options.slice(0, 10).map((el) => {
        return (
          <Box
            component={Link}
            sx={{
              m: "0.3em 0",
              display: "flex",
              "&:hover": { background: "#bbdefb" },
              textDecoration: "none",
              color: "#1a237e",
            }}
            to={`movie/${el.value}/section=details`}
            key={el.value}
          >
            <SearchIcon sx={{ mr: "5px" }} />
            {el.label}
          </Box>
        );
      })
    : null;

  const handleChange = (e) => {
    setValue(e.target.value);
  };
  const handleKeyDown = (e) => {
    if (e.code === "Enter") {
      dispatch(moviesFetching());
      navigate(`search/?q=${value}`);
    }
  };

  return (
    <Box
      sx={{ display: "flex", flexDirection: "column", position: "relative" }}
    >
      <Search
        onKeyDown={handleKeyDown}
        onBlur={() => setTimeout(() => setOptions(), 150)}
      >
        <InputBase value={value} onChange={handleChange} />
        <SearchIcon sx={{ ml: "5px" }} />
      </Search>
      <Box
        sx={{
          padding: options && "0.5em 0",
          ml: "0.7em",
          position: "absolute",
          zIndex: 100,
          background: "white",
          color: "black",
          left: 0,
          right: 0,
          top: "2.4em",
        }}
      >
        {dataResults}
      </Box>
    </Box>
  );
}
