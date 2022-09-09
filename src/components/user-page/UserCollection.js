import React, { useEffect, useState } from "react";
import { Tabs, Tab, Grid } from "@mui/material";
import { AnimatePresence } from "framer-motion";
import MovieItem from "./MovieItem";
import useLocalServer from "../movies-filters/service/local-server";

function UserCollection() {
  const { getUserCollections, getUserMovies } = useLocalServer();
  const [value, setValue] = useState(0);
  const [collection, setCollection] = useState([]);
  const [movies, setMovies] = useState([]);
  const handleChange = (event, newValue) => {
    setValue(newValue);
  };
  useEffect(async () => {
    const res = await getUserCollections();
    setCollection(res);
    const res2 = await getUserMovies();
    console.log(res2);
    setMovies(res2);
  }, []);
  const tabItems =
    collection.length > 0 &&
    collection.map((el) => (
      <Tab
        sx={{
          "&.Mui-selected": {
            boxShadow: "inset 1px 1px 9px 0px",
          },
        }}
        key={el.id}
        value={el.id}
        label={el.label}
      />
    ));
  const tabPanelItems =
    movies.length > 0 &&
    movies.map(
      (el) =>
        el.collectionId == value && (
          <MovieItem
            key={el.id}
            movieInfo={el}
            setMovies={setMovies}
            movies={movies}
            collection={collection}
          />
        )
    );
  return (
    <Grid
      wrap="nowrap"
      container
      sx={{
        boxShadow: "1px 1px 9px 0 cornflowerblue",
        borderRadius: "5px",
        bgcolor: "transparent",
      }}
    >
      <Tabs
        TabIndicatorProps={{
          sx: {
            display: "none",
          },
        }}
        sx={{ borderRight: 1, borderColor: "divider" }}
        value={value}
        onChange={handleChange}
        variant="scrollable"
        scrollButtons="auto"
        orientation="vertical"
        aria-label="scrollable auto tabs example"
      >
        {tabItems}
      </Tabs>
      <Grid item sx={{ width: "-webkit-fill-available" }}>
        <Grid
          item
          container
          wrap="wrap"
          sx={{ width: "-webkit-fill-available" }}
        >
          <AnimatePresence>{tabPanelItems}</AnimatePresence>
        </Grid>
      </Grid>
    </Grid>
  );
}

export default UserCollection;
