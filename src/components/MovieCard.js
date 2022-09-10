import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { CardActionArea, CardContent, Typography, Card } from "@mui/material";
import { motion } from "framer-motion";
import notFound from "../not-found.png";

function MovieCard({ isOpen, movieInfo, children }) {
  const { title, poster, id } = movieInfo;
  const [isLoading, setIsLoading] = useState(true);
  useEffect(() => {
    const image = new Image();
    image.src = poster;
    image.onload = () => setIsLoading(true);
    return (image.onload = () => {
      setIsLoading(false);
    });
  }, []);
  return (
    <Card
      component={motion.div}
      initial={{ opacity: 0, scale: 0.5 }}
      animate={{
        opacity: 1,
        scale: 1,
      }}
      exit={isOpen ? { rotateY: "90deg", opacity: 0 } : null}
      key={id}
      sx={{
        background: "transparent",
        border: "2px solid #bbdefb",
        position: "relative",
        overflow: "visible",
      }}
    >
      {children && children}
      <Link
        style={{
          filter: isOpen ? "brightness(0.5)" : "brightness(1)",
          backgroundImage: isLoading ? `url(${notFound})` : `url(${poster})`,
          display: "block",
          paddingTop: "140%",
          borderRadius: "4px",
          backgroundSize: "cover",
          backgroundPosition: "50%",
          cursor: "pointer",
        }}
        underline="none"
        to={`/movie/${id}/section=details`}
      />
      <CardActionArea>
        <CardContent
          sx={{
            height: 30,
            padding: "5px",
            "&:last-child": {
              paddingBottom: 0,
            },

            background: "white",
          }}
        >
          <Typography
            sx={{
              fontSize: "100%",
              overflow: "hidden",
              display: "-webkit-box",
              WebkitLineClamp: "2",
              WebkitBoxOrient: "vertical",
              fontWeight: "bold",
              width: "fit-content",
            }}
            variant="h5"
            component="h5"
          >
            {title}
          </Typography>
        </CardContent>
      </CardActionArea>
    </Card>
  );
}

export default MovieCard;
