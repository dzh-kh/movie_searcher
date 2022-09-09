import React from "react";
import { Grid, Avatar, Typography } from "@mui/material";
import UserCollection from "./UserCollection";

function UserPage() {
  return (
    <Grid
      container
      direction="column"
      spacing={2}
      rowSpacing={2}
      sx={{ p: "3em", maxWidth: 1200, margin: "1em auto" }}
    >
      <Grid item>
        <Avatar
          variant="rounded"
          alt="some"
          src="/static/images/avatar/1.jpg"
          sx={{ width: 60, height: 60, display: "inline-flex", m: "1em" }}
        />
        <Typography component="span" variant="body1">
          Some Name
        </Typography>
      </Grid>
      <Grid item>
        {" "}
        <UserCollection />{" "}
      </Grid>
    </Grid>
  );
}

export default UserPage;
