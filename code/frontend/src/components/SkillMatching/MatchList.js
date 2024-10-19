// src/components/SkillMatching/MatchList.js
import React from "react";
import {
  List,
  ListItem,
  ListItemText,
  ListItemAvatar,
  Avatar,
  Typography,
  Paper,
  Chip,
  makeStyles,
} from "@material-ui/core";

const useStyles = makeStyles((theme) => ({
  paper: {
    padding: theme.spacing(2),
    boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
    transition: "box-shadow 0.3s ease-in-out",
    "&:hover": {
      boxShadow: "0 8px 16px rgba(0, 0, 0, 0.2)",
    },
  },
  listItem: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    textAlign: "center",
    padding: theme.spacing(2),
    [theme.breakpoints.up("sm")]: {
      flexDirection: "row",
      alignItems: "flex-start",
      textAlign: "left",
    },
  },
  avatar: {
    marginBottom: theme.spacing(1),
    [theme.breakpoints.up("sm")]: {
      marginBottom: 0,
      marginRight: theme.spacing(2),
    },
  },
  chipContainer: {
    display: "flex",
    flexWrap: "wrap",
    justifyContent: "center",
    [theme.breakpoints.up("sm")]: {
      justifyContent: "flex-start",
    },
  },
  chip: {
    margin: theme.spacing(0.5),
  },
}));

const MatchList = ({ title, matches }) => {
  const classes = useStyles();

  return (
    <Paper elevation={3} className={classes.paper}>
      <Typography variant="h6" gutterBottom align="center">
        {title}
      </Typography>
      <List>
        {matches.map((match) => (
          <ListItem key={match._id} className={classes.listItem}>
            <ListItemAvatar className={classes.avatar}>
              <Avatar alt={match.name} src={match.avatar} />
            </ListItemAvatar>
            <ListItemText
              primary={match.name}
              secondary={
                <>
                  <Typography
                    component="span"
                    variant="body2"
                    color="textPrimary"
                  >
                    {title === "Potential Mentors"
                      ? "Can teach:"
                      : "Wants to learn:"}
                  </Typography>
                  <div className={classes.chipContainer}>
                    {match.matchingSkills.map((skill) => (
                      <Chip
                        key={skill}
                        label={skill}
                        size="small"
                        className={classes.chip}
                      />
                    ))}
                  </div>
                  <Typography variant="body2">
                    Compatibility Score: {match.score}
                  </Typography>
                </>
              }
            />
          </ListItem>
        ))}
      </List>
    </Paper>
  );
};

export default MatchList;
