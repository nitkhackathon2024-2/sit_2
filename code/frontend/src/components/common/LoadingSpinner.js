import React from "react";
import { CircularProgress, makeStyles } from "@material-ui/core";

const useStyles = makeStyles((theme) => ({
  spinner: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    height: "100%",
  },
}));

const LoadingSpinner = () => {
  const classes = useStyles();
  return (
    <div className={classes.spinner}>
      <CircularProgress />
    </div>
  );
};

export default LoadingSpinner;
