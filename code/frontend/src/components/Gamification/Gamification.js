import React from "react";
import {
  Container,
  Typography,
  Grid,
  Paper,
  makeStyles,
} from "@material-ui/core";
import Challenges from "./Chalenge";

const useStyles = makeStyles((theme) => ({
  root: {
    flexGrow: 1,
    padding: theme.spacing(3),
  },
  paper: {
    padding: theme.spacing(2),
    textAlign: "center",
    color: theme.palette.text.secondary,
  },
  title: {
    marginBottom: theme.spacing(2),
  },
}));

const GamificationPage = () => {
  const classes = useStyles();

  return (
    <Container maxWidth="lg" className={classes.root}>
      <Typography variant="h4" gutterBottom className={classes.title}>
        Gamification
      </Typography>
      <Grid container spacing={4} justify="center">
        <Grid item xs={12}>
          <Paper className={classes.paper}>
            <Typography variant="h5" gutterBottom>
              Challenges
            </Typography>
            <Challenges />
          </Paper>
        </Grid>
      </Grid>
    </Container>
  );
};

export default GamificationPage;
