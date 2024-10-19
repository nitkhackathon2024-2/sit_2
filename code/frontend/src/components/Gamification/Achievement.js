import React, { useState, useEffect } from "react";
import { Card, CardContent, Typography, Grid, Avatar } from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";
import api from "../../services/api";

const useStyles = makeStyles((theme) => ({
  root: {
    marginBottom: theme.spacing(3),
    display: "flex",
    justifyContent: "center",
  },
  card: {
    height: "100%",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    textAlign: "center",
    transition: "all 0.3s ease-in-out",
    boxShadow: "0 4px 8px rgba(0,0,0,0.1)",
    "&:hover": {
      transform: "translateY(-5px)",
      boxShadow: "0 6px 12px rgba(0,0,0,0.15)",
    },
  },
  avatar: {
    width: theme.spacing(7),
    height: theme.spacing(7),
    marginBottom: theme.spacing(2),
  },
  locked: {
    opacity: 0.5,
  },
  gridItem: {
    display: "flex",
    justifyContent: "center",
  },
}));

const Achievements = () => {
  const classes = useStyles();
  const [achievements, setAchievements] = useState([]);

  useEffect(() => {
    const fetchAchievements = async () => {
      try {
        const response = await api.get("/achievements");
        setAchievements(response.data);
      } catch (error) {
        console.error("Error fetching achievements:", error);
      }
    };
    fetchAchievements();
  }, []);

  return (
    <Grid container spacing={3} className={classes.root}>
      {achievements.map((achievement) => (
        <Grid
          item
          xs={12}
          sm={6}
          md={4}
          lg={3}
          key={achievement._id}
          className={classes.gridItem}
        >
          <Card
            className={`${classes.card} ${
              !achievement.unlocked && classes.locked
            }`}
          >
            <CardContent>
              <Avatar src={achievement.icon} className={classes.avatar} />
              <Typography variant="h6" gutterBottom>
                {achievement.title}
              </Typography>
              <Typography variant="body2" color="textSecondary">
                {achievement.description}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      ))}
    </Grid>
  );
};

export default Achievements;
