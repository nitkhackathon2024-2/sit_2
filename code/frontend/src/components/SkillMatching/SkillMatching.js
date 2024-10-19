import React, { useContext, useEffect, useState } from "react";
import {
  Container,
  Grid,
  LinearProgress,
  Typography,
  Paper,
  makeStyles,
} from "@material-ui/core";
import MatchList from "./MatchList";
import api from "../../services/api";
import { AuthContext } from "../../contexts/AuthContext"; // Import your auth context

const useStyles = makeStyles((theme) => ({
  root: {
    flexGrow: 1,
    padding: theme.spacing(3),
  },
  paper: {
    padding: theme.spacing(2),
    textAlign: "center",
    color: theme.palette.text.secondary,
    transition: "all 0.3s",
    "&:hover": {
      transform: "scale(1.03)",
      boxShadow: "0 2px 4px rgba(0, 0, 0, 0.1)",
    },
  },
  challenge: {
    marginTop: theme.spacing(2),
    padding: theme.spacing(2),
    transition: "all 0.3s",
    "&:hover": {
      transform: "scale(1.03)",
      boxShadow: "0 2px 4px rgba(0, 0, 0, 0.1)",
    },
  },
}));

const SkillMatching = () => {
  const classes = useStyles();
  const [potentialMentors, setPotentialMentors] = useState([]);
  const [potentialMentees, setPotentialMentees] = useState([]);
  const { user } = useContext(AuthContext); // Get the current user from context

  useEffect(() => {
    const fetchMatches = async () => {
      try {
        const response = await api.get(`/matches/match/${user._id}`);
        setPotentialMentors(response.data.potentialMentors);
        setPotentialMentees(response.data.potentialMentees);
      } catch (error) {
        console.error("Error fetching matches:", error);
      }
    };

    fetchMatches();
  }, [user._id]);

  return (
    <Container maxWidth="lg" className={classes.root}>
      <Typography variant="h4" gutterBottom align="center">
        Skill Matching
      </Typography>
      <Grid container spacing={3} justifyContent="center">
        <Grid item xs={12} sm={6}>
          <Paper className={classes.paper}>
            <MatchList title="Potential Mentors" matches={potentialMentors} />
          </Paper>
        </Grid>
        <Grid item xs={12} sm={6}>
          <Paper className={classes.paper}>
            <MatchList title="Potential Mentees" matches={potentialMentees} />
          </Paper>
        </Grid>
      </Grid>
      <Typography
        variant="h6"
        gutterBottom
        align="center"
        style={{ marginTop: "2rem" }}
      >
        Current Challenges
      </Typography>
      <Grid container spacing={2} justifyContent="center">
        {user.currentChallenges.map((challenge) => (
          <Grid item xs={12} sm={6} md={4} key={challenge._id}>
            <Paper className={classes.challenge}>
              <Typography variant="subtitle1">
                {challenge.challenge.title}
              </Typography>
              <LinearProgress
                variant="determinate"
                value={
                  (challenge.progress / challenge.challenge.duration) * 100
                }
              />
            </Paper>
          </Grid>
        ))}
      </Grid>
    </Container>
  );
};

export default SkillMatching;
