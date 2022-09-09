import React, { useState, useEffect } from "react";
import { useParams, Link, useNavigate, useLocation } from "react-router-dom";
import StarIcon from "@mui/icons-material/Star";
import CircleIcon from "@mui/icons-material/Circle";
import { motion } from "framer-motion";
import {
  Skeleton,
  Grid,
  Typography,
  Divider,
  Rating,
  Card,
  CardContent,
  CardMedia,
  CardActionArea,
  Box,
  Paper,
  Avatar,
  SvgIcon,
  Tab,
  Tabs,
  Button,
  ListItem,
  CircularProgress,
} from "@mui/material";
import MovieCard from "./MovieCard";
import useLocalServer from "./movies-filters/service/local-server";
import useMoviesService from "./movies-filters/service/movies-server";

const { getMovieCast, getSimilarMovies, getMovieDetails, getMovieReviews } =
  useMoviesService();

function SingleMoviePage() {
  const { id, section } = useParams();
  const [details, setDetails] = useState({});
  useEffect(() => {
    getMovieDetails(id)
      .then((res) => setDetails(res))
      .catch((e) => console.log(e));
  }, [id]);

  const { title, poster, vote, voteCount, backdrop, originalTitle } = details;
  return (
    <>
      <Box
        sx={{
          position: "absolute",
          background: `url(${backdrop})`,
          backgroundPosition: "top",
          backgroundRepeat: "no-repeat",
          backgroundSize: "cover",
          zIndex: "-1",
          width: "100vw",
          height: "20em",
          filter: "contrast(0.5)",
        }}
      />
      <Grid
        container
        spacing={3}
        sx={{
          padding: "7em 2em 0 2em",
          justifyContent: "space-evenly",
          flexWrap: "wrap",
        }}
      >
        <Grid
          lg={2.7}
          sx={{
            mr: "1em",
            position: "relative",
          }}
          item
        >
          {poster && (
            <Avatar
              variant="rounded"
              alt="The image"
              style={{
                width: "16em",
                height: "23em",
                boxShadow: "1px 10px 10px 0px rgba(0,0,0,0.5)",
              }}
            >
              <img
                src={poster}
                alt="poster"
                style={{ width: "100%", height: "100%", zIndex: "20" }}
              />
            </Avatar>
          )}
          {!poster && (
            <Skeleton
              variant="rectangle"
              sx={{
                width: "20em",
                height: "29em",
                boxShadow: "1px 10px 10px 0px rgba(0,0,0,0.5)",
                zIndex: "100",
              }}
            />
          )}
          <DragMenu title={title} poster={poster} movieId={id} />
        </Grid>
        <Grid
          lg={8}
          sx={{
            flexWrap: "nowrap",
            flexDirection: "column",
          }}
          container
          item
        >
          <Grid sx={{ height: "7em" }} item>
            <Typography
              variant="h4"
              sx={{
                filter: "drop-shadow(2px 4px 6px black)",
                color: "white",
              }}
            >
              {title && title}
              {!title && <Skeleton />}
            </Typography>
            <Typography
              variant="h6"
              sx={{
                filter: "drop-shadow(2px 4px 6px black)",
                color: "#e0e0e0",
              }}
            >
              {originalTitle}
            </Typography>
            <Typography
              variant="h6"
              sx={{
                display: "flex",
                alignItems: "center",
                color: "white",
              }}
            >
              <Rating
                size="medium"
                max={10}
                value={vote || 0}
                precision={0.5}
                emptyIcon={
                  <StarIcon
                    style={{ opacity: 0.5, color: "white" }}
                    fontSize="inherit"
                  />
                }
              />
              <Typography
                sx={{
                  fontWeight: "900",
                  ml: "0.3em",
                }}
                variant="h7"
                component="span"
              >
                {vote}
              </Typography>
              <Divider
                orientation="vertical"
                light
                sx={{ background: "white", m: "0 0.3em" }}
                flexItem
              />
              <Typography variant="subtitle2" component="span">
                {voteCount}
              </Typography>
            </Typography>
          </Grid>
          <Grid sx={{ mt: "6em" }}>
            <TabMenu details={details} movieId={id} section={section} />
          </Grid>
        </Grid>
      </Grid>
    </>
  );
}

export default SingleMoviePage;

export function MovieReviews({ movieId }) {
  const [reviews, setReviews] = useState();
  useEffect(() => {
    getMovieReviews(movieId)
      .then((res) => setReviews(res))
      .catch((e) => console.log(e));
  }, []);
  const rev = reviews
    ? reviews.map(({ author, content, update, id, avatar }) => {
        return (
          <Box sx={{ mt: "1em" }} key={id}>
            <Divider
              textAlign="left"
              light
              sx={{ transform: "translateY(50%)" }}
              orientation="horizontal"
            >
              <Avatar
                sx={{
                  bgcolor: "#29b6f6",
                  display: "inline-flex",
                  mr: "0.4em",
                }}
                component="span"
                alt="The image"
                src={avatar}
              />
              <Typography sx={{ fontWeight: "bold" }} component="span">
                {author}
              </Typography>
            </Divider>
            <Paper
              variant="outlined"
              square
              sx={{
                padding: "2.5em 1.5em 1.5em 1.5em",
                border: "1px solid #b3e5fc",
                borderTop: "none",
              }}
            >
              <Typography>{content}</Typography>
              <Typography
                sx={{ fontWeight: "bold", color: "gray", mt: "0.8em" }}
              >
                {update}
              </Typography>
            </Paper>
          </Box>
        );
      })
    : [<CircularProgress key="1" />];
  return (
    <Box>
      {rev.length >= 1 ? (
        rev
      ) : (
        <Typography sx={{ m: "0 auto", fontWeight: "bold", fontSize: "2em" }}>
          NO REVIEWS YET
        </Typography>
      )}
    </Box>
  );
}

function TabMenu({ details, movieId, section }) {
  const pathBase = `/movie/${movieId}/section=`;
  return (
    <Box sx={{ width: "100%", minHeight: "700px" }}>
      <Tabs value={section} textColor="secondary" indicatorColor="secondary">
        <Tab
          key="1"
          value="section=details"
          component={Link}
          label="Details"
          to={`${pathBase}details`}
        />
        <Tab
          key="2"
          value="section=cast"
          component={Link}
          label="Cast"
          to={`${pathBase}cast`}
        />
        <Tab
          key="3"
          value="section=similarMovies"
          component={Link}
          label="Similar Movies"
          to={`${pathBase}similarMovies`}
        />
        <Tab
          key="4"
          value="section=reviews"
          component={Link}
          label="Reviews"
          to={`${pathBase}reviews`}
        />
      </Tabs>
      <Grid sx={{ marginTop: "2em" }} item>
        {section === `section=details` && <MovieDetails details={details} />}
        {section === `section=similarMovies` && (
          <SimilarMovies movieId={movieId} />
        )}
        {section === `section=cast` && <MovieCast movieId={movieId} />}
        {section === `section=reviews` && <MovieReviews movieId={movieId} />}
      </Grid>
    </Box>
  );
}

export function MovieDetails({ details }) {
  const {
    overview,
    releaseDate,
    genres,
    budget,
    companies,
    language,
    countries,
    tagline,
    runtime,
    status,
    collection,
  } = details;
  const detailsTemplate = [
    {
      label: "Belongs to collection",
      value: collection?.name,
      id: collection?.id,
      link: true,
    },
    { label: "Status", value: status, link: false },
    { label: "Release date", value: releaseDate, link: false },
    { label: "Language", value: language, link: false },
    { label: "Countries", value: countries, link: false },
    { label: "Genres", value: genres, link: false },
    { label: "Production companies", value: companies, link: false },
    { label: "Runtime", value: runtime, link: false },
    { label: "Overview", value: overview, link: false },
    { label: "Budget", value: budget, link: false },
  ];
  const locationPath = useLocation().pathname;
  const content = detailsTemplate.map((item) => {
    return (
      <span key={item.label}>
        {item.value?.length >= 1 && item?.link === false && (
          <SingleDetailTemplate label={item.label} detail={item.value} />
        )}
        {item.value?.length >= 1 && item?.link === true && (
          <Link
            style={{ textDecoration: "none" }}
            to={`/collection/${item?.id}`}
            state={`${locationPath}`}
          >
            <SingleDetailTemplate
              sx={{ textDecoration: "none" }}
              label={item.label}
              detail={item.value}
            />
          </Link>
        )}
      </span>
    );
  });

  return (
    <Box>
      <Typography
        sx={{
          fontSize: "2em",
          fontFamily: "Bebas Neue",
          color: "blue",
        }}
      >
        {tagline}
      </Typography>
      {content}
    </Box>
  );
}

function SingleDetailTemplate({ detail, label }) {
  let detailList = detail;
  const labelStyle = {
    fontWeight: "500",
    fontSize: "small",
    color: "gray",
  };
  const detailStyle = {
    fontWeight: "400",
    fontSize: "large",
  };
  if (
    label === "Production companies" ||
    label === "Genres" ||
    label === "Countries"
  ) {
    detailList =
      detail &&
      detail.map((el) => (
        <Paper
          sx={{ ml: "0.5em" }}
          component="span"
          variant="outlined"
          key={el}
        >
          {el}
        </Paper>
      ));
  }
  return (
    <>
      {detail && (
        <>
          <Typography sx={labelStyle}>{label}</Typography>
          <Typography sx={detailStyle}>{detailList}</Typography>
        </>
      )}
      {!detail && <Skeleton sx={labelStyle} />}
    </>
  );
}

export function SimilarMovies({ movieId }) {
  const [similarMovies, setSimilarMovies] = useState([]);
  useEffect(() => {
    getSimilarMovies(movieId)
      .then((res) => setSimilarMovies(res))
      .catch((e) => console.log(e));
  }, []);
  const similarMovieList = similarMovies.map((movieInfo) => {
    const { vote, id } = movieInfo;
    return (
      <Box
        key={id}
        sx={{
          margin: "7px",
          width: "17%",
          minHeight: "95%",
          "@media (max-width: 980px)": {
            width: "22%",
          },
          "@media (max-width: 500px)": {
            width: "50%",
          },
        }}
      >
        <MovieCard movieInfo={movieInfo} isOpen={false}>
          <>
            {" "}
            <CircleIcon
              sx={{
                fontSize: "3em",
                color: "#ffc107",
                position: "absolute",
                top: "-13px",
                right: "-19px",
                zIndex: "10",
              }}
            />
            <CircleIcon
              sx={{
                fontSize: "3em",
                color: "#bbdefb",
                position: "absolute",
                top: "-11px",
                right: "-16px",
                zIndex: "9",
              }}
            />
            <Typography
              variant="subtitle2"
              sx={{
                color: "white",
                fontSize: "100%",
                zIndex: "20",
                position: "absolute",
                top: "0.1em",
                right: "-0.4em",
              }}
            >
              {vote && vote.toFixed(1)}
            </Typography>
          </>
        </MovieCard>
      </Box>
    );
  });
  return (
    <Box
      component={motion.div}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      sx={{
        minWidth: "fitContent",
        display: "flex",
        flexWrap: "wrap",
      }}
    >
      {similarMovieList}
    </Box>
  );
}

export function MovieCast({ movieId }) {
  const [credits, setCredits] = useState();
  useEffect(() => {
    getMovieCast(movieId)
      .then((res) => setCredits(res))
      .catch((e) => console.log(e));
  }, []);
  const cast = credits
    ? credits.map((actor) => {
        const { name, castId, thumbnail, character } = actor;
        return (
          <Card
            key={castId}
            sx={{
              margin: "10px",
              width: 100,
              height: 250,
              flexShrink: 0,
              flexWrap: "wrap",
            }}
          >
            <CardActionArea>
              <CardMedia
                component="img"
                sx={{ borderRadius: "15px", width: "100%", height: "100%" }}
                image={thumbnail}
                alt={name}
              />
              <CardContent sx={{ padding: "5px" }}>
                <Typography variant="subtitle2" sx={{ fontSize: "100%" }}>
                  {name}
                </Typography>
                <Typography variant="subtitle" sx={{ fontSize: "100%" }}>
                  {character}
                </Typography>
              </CardContent>
            </CardActionArea>
          </Card>
        );
      })
    : [<CircularProgress key="1" />];
  return (
    <Box
      component={motion.div}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      sx={{
        minWidth: "fitContent",
        overflowX: "auto",
        display: "flex",
        flexWrap: "wrap",
        justifyContent: "center",
      }}
    >
      {cast.length >= 1 ? cast : <Typography>No information yet</Typography>}
    </Box>
  );
}

function DragMenu({ poster, title, movieId }) {
  const {
    postMovie,
    getUserMovie,
    getUserCollections,
    patchMovie,
    deleteMovie,
  } = useLocalServer();
  const [menuIsOpen, setMenuIsOpen] = useState(false);
  const [collections, setCollections] = useState([]);
  const [selectedCollection, setSelectedCollection] = useState(-1);
  useEffect(async () => {
    const res = await getUserCollections();
    setCollections(res);
    const res2 = await getUserMovie(movieId);
    setSelectedCollection(res2.collectionId);
  }, [movieId]);

  const handleClick = () => setMenuIsOpen(!menuIsOpen);
  const handleDeleteMovie = () => {
    deleteMovie(movieId);
    setMenuIsOpen(!menuIsOpen);
    setSelectedCollection(-1);
  };
  const handleItemClick = (e, collectionId) => {
    if (selectedCollection + 1) {
      patchMovie(movieId, collectionId);
    } else {
      postMovie(collectionId, movieId, title, poster);
    }
    setSelectedCollection(collectionId);
    setMenuIsOpen(!menuIsOpen);
  };

  const options =
    collections?.length > 0 &&
    collections
      .sort((el) => (el.id == selectedCollection ? -1 : 1))
      .map((el) => {
        return (
          <ListItem
            onClick={(e) => handleItemClick(e, el.id)}
            sx={{
              textAlign: "center",
              zIndex: "30",
              boxShadow:
                "inset -4px 3px 1px 0 rgb(250 250 250 / 15%), 0px 1px 2px 0 rgba(0,0,0, 0.3)",
              display:
                menuIsOpen || selectedCollection == el.id ? "block" : "none",
              background: selectedCollection == el.id ? "#01579b" : "#90caf9",
              color: "white",
              marginBottom: "2px",
              cursor: "pointer",
            }}
            id={el.id}
            key={el.id}
          >
            {el.label}
          </ListItem>
        );
      });

  return (
    <Grid sx={{ position: "relative" }}>
      <ul
        style={{
          margin: 0,
          fontSize: "1.3em",
          fontFamily: "Bebas Neue",
          padding: 0,
        }}
      >
        {options}
        <ListItem
          sx={{
            textAlign: "center",
            zIndex: "30",
            boxShadow:
              "inset -4px 3px 1px 0 rgb(250 250 250 / 15%), 0px 1px 2px 0 rgba(0,0,0, 0.3)",
            display: menuIsOpen && selectedCollection + 1 ? "block" : "none",
            background: "#ff5722",
            color: "white",
            marginBottom: "2px",
            cursor: "pointer",
          }}
          onClick={handleDeleteMovie}
        >
          Delete
        </ListItem>
      </ul>
      <Button
        onClick={handleClick}
        sx={{
          "&:active": {
            color: "transparent",
          },
          "&:focus": {
            color: "transparent",
          },
          "&:hover": {
            backgroundColor: "transparent",
          },
          width: "fit-content",
          top: "-3em",
          left: "-2em",
          zIndex: "10",
        }}
      >
        <SvgIcon
          fontSize="large"
          sx={{
            color: "#01579b",
            fontSize: "7em",
          }}
        >
          <path d="M17 3H7c-1.1 0-1.99.9-1.99 2L5 21l7-3 7 3V5c0-1.1-.9-2-2-2z" />
          <text
            style={{ fontSize: "6px" }}
            x="50%"
            y="50%"
            textAnchor="middle"
            stroke="white"
            alignmentBaseline="middle"
          >
            {!(selectedCollection + 1) && "+"}
          </text>
        </SvgIcon>
      </Button>
    </Grid>
  );
}
