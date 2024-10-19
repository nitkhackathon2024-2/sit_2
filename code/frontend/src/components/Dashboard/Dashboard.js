import React, { useContext, useEffect, useState } from "react";
import {
  Container,
  Typography,
  Grid,
  Paper,
  makeStyles,
  Snackbar,
} from "@material-ui/core";
import { Alert } from "@material-ui/lab";
import { AuthContext } from "../../contexts/AuthContext";
import SkillChart from "./SkillChart";
import MatchList from "./MatchList";
import LoadingSpinner from "../common/LoadingSpinner";
import api from "../../services/api";

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
}));

const Dashboard = () => {
  const classes = useStyles();
  const { user, updateUser } = useContext(AuthContext);

  const [matches, setMatches] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const handleAddSkill = (newSkill) => {
    if (user && updateUser) {
      updateUser({
        ...user,
        skills: [...user.skills, newSkill],
      });
    } else {
      console.error("User or updateUser is not defined");
    }
  };

  useEffect(() => {
    const fetchMatches = async () => {
      try {
        setLoading(true);
        const res = await api.get("/matches/find");
        setMatches(res.data);
        setError(null);
      } catch (error) {
        console.error("Error fetching matches:", error);
        setError("Failed to load matches. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    fetchMatches();
  }, []);

  const handleCloseError = () => {
    setError(null);
  };

  if (loading) {
    return <LoadingSpinner />;
  }

  return (
    <Container className={classes.root}>
      <Typography variant="h4" gutterBottom>
        Welcome, {user.username}!
      </Typography>
      <Grid container spacing={3}>
        <Grid item xs={12} md={6}>
          <Paper className={classes.paper}>
            <Typography variant="h6" gutterBottom>
              Your Skills
            </Typography>
            <SkillChart skills={user.skills} />
          </Paper>
        </Grid>
        <Grid item xs={12} md={6}>
          <Paper className={classes.paper}>
            <Typography variant="h6" gutterBottom>
              Potential Matches
            </Typography>
            <MatchList matches={matches} />
          </Paper>
        </Grid>
      </Grid>
      <Snackbar
        open={!!error}
        autoHideDuration={6000}
        onClose={handleCloseError}
      >
        <Alert onClose={handleCloseError} severity="error">
          {error}
        </Alert>
      </Snackbar>
    </Container>
  );
};

export default Dashboard;
