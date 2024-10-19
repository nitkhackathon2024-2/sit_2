import React, { useState } from "react";
import {
  Card,
  CardContent,
  Typography,
  Button,
  Grid,
  LinearProgress,
  Chip,
} from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";

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
  tagsContainer: {
    display: "flex",
    flexWrap: "wrap",
    justifyContent: "center",
    marginTop: theme.spacing(2),
  },
}));

const dummyChallenges = [
  {
    _id: "1",
    title: "Learn React Hooks",
    description: "Master the use of React Hooks in your applications",
    tags: ["React", "JavaScript", "Frontend"],
    progress: 0,
  },
  {
    _id: "2",
    title: "Build a RESTful API",
    description:
      "Create a fully functional RESTful API using Node.js and Express",
    tags: ["Node.js", "Express", "Backend"],
    progress: 0,
  },
  {
    _id: "3",
    title: "Implement Authentication",
    description: "Add user authentication to your web application",
    tags: ["Security", "Frontend", "Backend"],
    progress: 0,
  },
];

const Challenges = () => {
  const classes = useStyles();
  const [challenges, setChallenges] = useState(dummyChallenges);
  const [activeChallenges, setActiveChallenges] = useState([]);

  const handleAcceptChallenge = (challengeId) => {
    const updatedChallenges = challenges.filter(
      (challenge) => challenge._id !== challengeId
    );
    const acceptedChallenge = challenges.find(
      (challenge) => challenge._id === challengeId
    );

    setChallenges(updatedChallenges);
    setActiveChallenges([
      ...activeChallenges,
      { ...acceptedChallenge, progress: 0 },
    ]);
  };

  return (
    <div>
      <Typography variant="h4" gutterBottom>
        Available Challenges
      </Typography>
      <Grid container spacing={3} className={classes.root}>
        {challenges.map((challenge) => (
          <Grid item xs={12} sm={6} md={4} key={challenge._id}>
            <Card className={classes.card}>
              <CardContent className={classes.cardContent}>
                <Typography variant="h6" gutterBottom align="center">
                  {challenge.title}
                </Typography>
                <Typography
                  variant="body2"
                  color="textSecondary"
                  align="center"
                >
                  {challenge.description}
                </Typography>
                <div className={classes.tagsContainer}>
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
              <CardContent>
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

      {activeChallenges.length > 0 && (
        <div>
          <Typography variant="h4" gutterBottom>
            Active Challenges
          </Typography>
          <Grid container spacing={3} className={classes.root}>
            {activeChallenges.map((challenge) => (
              <Grid item xs={12} sm={6} md={4} key={challenge._id}>
                <Card className={classes.card}>
                  <CardContent className={classes.cardContent}>
                    <Typography variant="h6" gutterBottom align="center">
                      {challenge.title}
                    </Typography>
                    <Typography
                      variant="body2"
                      color="textSecondary"
                      align="center"
                    >
                      {challenge.description}
                    </Typography>
                    <div className={classes.progress}>
                      <LinearProgress
                        variant="determinate"
                        value={challenge.progress}
                      />
                      <Typography
                        variant="caption"
                        align="center"
                        display="block"
                      >
                        {`${challenge.progress}% Complete`}
                      </Typography>
                    </div>
                    <div className={classes.tagsContainer}>
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
                </Card>
              </Grid>
            ))}
          </Grid>
        </div>
      )}
    </div>
  );
};

export default Challenges;
