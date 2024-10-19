// src/components/Challenges.js
import React, { useState, useEffect } from "react";
import {
  Card,
  CardContent,
  Typography,
  Button,
  Grid,
  Chip,
  Dialog,
  DialogContent,
  DialogTitle,
} from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";
import api from "../services/api";
import CreateChallenge from "./CreateChallenge";

const useStyles = makeStyles((theme) => ({
  root: {
    marginBottom: theme.spacing(3),
  },
  card: {
    height: "100%",
    display: "flex",
    flexDirection: "column",
    justifyContent: "space-between",
    boxShadow: "0 4px 8px 0 rgba(0,0,0,0.2)",
    transition: "0.3s",
    "&:hover": {
      boxShadow: "0 8px 16px 0 rgba(0,0,0,0.2)",
      transform: "translateY(-5px)",
    },
  },
  chip: {
    margin: theme.spacing(0.5),
  },
  progress: {
    marginTop: theme.spacing(2),
  },
  cardContent: {
    flexGrow: 1,
    display: "flex",
    flexDirection: "column",
    justifyContent: "space-between",
  },
  cardActions: {
    padding: theme.spacing(2),
  },
}));

const Challenges = () => {
  const classes = useStyles();
  const [challenges, setChallenges] = useState([]);
  const [openCreateDialog, setOpenCreateDialog] = useState(false);

  useEffect(() => {
    fetchChallenges();
  }, []);

  const fetchChallenges = async () => {
    try {
      const response = await api.get("/challenges");
      setChallenges(response.data);
    } catch (error) {
      console.error("Error fetching challenges:", error);
    }
  };

  const handleAcceptChallenge = async (challengeId) => {
    try {
      await api.post(`/challenges/${challengeId}/accept`);
      // Update challenge status in the UI
      // You might want to refetch challenges or update the local state
    } catch (error) {
      console.error("Error accepting challenge:", error);
    }
  };

  const handleChallengeCreated = (newChallenge) => {
    setChallenges([...challenges, newChallenge]);
    setOpenCreateDialog(false);
  };

  return (
    <>
      <Button
        variant="contained"
        color="primary"
        onClick={() => setOpenCreateDialog(true)}
        style={{ marginBottom: "20px" }}
      >
        Create New Challenge
      </Button>

      <Grid container spacing={3} className={classes.root}>
        {challenges.map((challenge) => (
          <Grid item xs={12} sm={6} md={4} key={challenge._id}>
            <Card className={classes.card}>
              <CardContent className={classes.cardContent}>
                <Typography variant="h6" gutterBottom>
                  {challenge.title}
                </Typography>
                <Typography variant="body2" color="textSecondary">
                  {challenge.description}
                </Typography>
                <Typography variant="body2">
                  Points: {challenge.points} | Duration: {challenge.duration}{" "}
                  days
                </Typography>
                <div>
                  {challenge.tags.map((tag) => (
                    <Chip
                      key={tag}
                      label={tag}
                      size="small"
                      className={classes.chip}
                    />
                  ))}
                </div>
              </CardContent>
              <CardContent className={classes.cardActions}>
                <Button
                  variant="contained"
                  color="primary"
                  onClick={() => handleAcceptChallenge(challenge._id)}
                  fullWidth
                >
                  Accept Challenge
                </Button>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      <Dialog
        open={openCreateDialog}
        onClose={() => setOpenCreateDialog(false)}
      >
        <DialogTitle>Create New Challenge</DialogTitle>
        <DialogContent>
          <CreateChallenge onChallengeCreated={handleChallengeCreated} />
        </DialogContent>
      </Dialog>
    </>
  );
};

export default Challenges;
