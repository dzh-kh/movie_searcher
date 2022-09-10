import React, { useState, useEffect } from "react";
import {
  Container,
  Grid,
  Button,
  Pagination,
  PaginationItem,
} from "@mui/material";
import { useLocation, useSearchParams, Link } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import FilterListIcon from "@mui/icons-material/FilterList";
import { motion, AnimatePresence } from "framer-motion";
import MoviesList from "./movies-list/MoviesList";
import FiltersBar from "./filters-bar/filtersBar";
import useMoviesService from "./movies-filters/service/movies-server";

import { moviesFetching, moviesFetched, moviesFetchingError } from "../actions";

function CatalogPage() {
  const dispatch = useDispatch();
  const { filterParams } = useSelector((state) => state.reducer);
  const { getFilteredMovies } = useMoviesService();
  const [searchParams] = useSearchParams();
  const [count, setCount] = useState(1);
  const [currentPage, setCurrentPage] = useState(1);

  const transformSearchParams = (element, searchParam) => {
    const urlPart = searchParams
      .get(`with_${searchParam}`)
      .replace(/[^0-9,]/g, "")
      .replace(/,/d, "%2C");
    if (element.includes(`with_${searchParam}`)) {
      return `${element.split("=")[0]}=${urlPart}`;
    }
    return element;
  };
  const currentURLParams = useLocation()
    .search?.split("&")
    .slice(1)
    .map((e) => {
      if (searchParams.has("with_keywords"))
        return transformSearchParams(e, "keywords");
      if (searchParams.has("with_people"))
        return transformSearchParams(e, "people");
      return e;
    })
    .join("&");

  useEffect(() => {
    const getParams =
      Object.keys(filterParams).length >= 1 ? filterParams : currentURLParams;
    console.log(getParams);
    dispatch(moviesFetching());
    getFilteredMovies(getParams, currentPage)
      .then((res) => {
        dispatch(moviesFetched(res));
        setCount(res[0]?.totalPages);
      })
      .catch((e) => {
        dispatch(moviesFetchingError(e));
      });
  }, [filterParams, currentPage]);
  const [isShown, setIsShown] = useState(false);
  const [isMobile] = useState(() => window.innerWidth < 780);

  return (
    <Container maxWidth={false} sx={{ m: "1.5em 0" }}>
      <Button
        sx={{
          position: "relative",
          "@media (min-width: 780px)": { display: "none" },
        }}
        onClick={() => setIsShown(!isShown)}
      >
        <FilterListIcon />
        Filters
      </Button>
      <Grid sx={{ justifyContent: "space-evenly" }} container wrap="nowrap">
        <AnimatePresence>
          {(isShown || !isMobile) && (
            <Grid
              key="menu"
              sx={{
                "@media (max-width: 780px)": {
                  // display: isShown ? "block" : "none",
                  position: "absolute",
                  zIndex: "500",
                  width: "90%",
                  background: "rgba(250,250,250, 0.9)",
                },
              }}
              component={motion.div}
              initial={{ left: "-2000px" }}
              transition={{ duration: 0.1 }}
              animate={{
                left: isShown ? "20px" : "-400px",
              }}
              exit={{ left: "-450px", transition: { duration: 0.1 } }}
              lg={3}
              item
            >
              <FiltersBar />
            </Grid>
          )}
        </AnimatePresence>

        <Grid
          lg={9}
          sx={{
            maxWidth: 1000,
            ml: "50px",
            "@media (max-width: 780px)": {
              ml: 0,
            },
          }}
          item
        >
          <MoviesList />
          {count >= 2 && (
            <Grid item>
              <PaginationBar
                setCurrentPage={setCurrentPage}
                currentPage={currentPage}
                count={count}
              />
            </Grid>
          )}
        </Grid>
      </Grid>
    </Container>
  );
}

function PaginationBar({ count, setCurrentPage, currentPage }) {
  const handleChange = (e, pageNumber) => {
    setCurrentPage(pageNumber);
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };
  const location = useLocation();
  const params = useLocation().search.split("&").slice(1).join("&");
  const page = useLocation().search.includes("page")
    ? +location.search.split("=")[1].split("&")[0]
    : 1;
  useEffect(() => setCurrentPage(page), [params]);
  return (
    <Pagination
      siblingCount={0}
      sx={{
        m: "1em auto",
        display: "flex",
        justifyContent: "center",
      }}
      count={count}
      onChange={handleChange}
      shape="rounded"
      page={currentPage}
      renderItem={(item) => (
        <PaginationItem
          component={Link}
          to={`/catalog/?page=${item.page}&${params}`}
          /* eslint-disable react/jsx-props-no-spreading */
          {...item}
        />
      )}
    />
  );
}

export default CatalogPage;
