import React, { useState } from "react";
import { Link } from "react-router-dom";
import {
  List,
  ListItem,
  ListItemText,
  ListItemSecondaryAction,
  Button,
  Paper,
  makeStyles,
} from "@material-ui/core";
import Pagination from "@material-ui/lab/Pagination";

const useStyles = makeStyles((theme) => ({
  root: {
    width: "100%",
    maxWidth: 600,
    margin: "0 auto",
  },
  listItem: {
    margin: theme.spacing(1, 0),
    borderRadius: theme.shape.borderRadius,
    boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
    transition: "all 0.3s",
    "&:hover": {
      boxShadow: "0 4px 8px rgba(0,0,0,0.2)",
      transform: "translateY(-2px)",
    },
  },
  pagination: {
    display: "flex",
    justifyContent: "center",
    marginTop: theme.spacing(2),
  },
}));

const ITEMS_PER_PAGE = 5;
const MatchList = ({ matches }) => {
  const classes = useStyles();
  const [page, setPage] = useState(1);

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const paginatedMatches = matches.slice(
    (page - 1) * ITEMS_PER_PAGE,
    page * ITEMS_PER_PAGE
  );

  return (
    <Paper className={classes.root}>
      <List>
        {paginatedMatches.map((match) => (
          <ListItem key={match._id} className={classes.listItem}>
            <ListItemText
              primary={match.username}
              secondary={`Skills: ${match.skills
                .map((skill) => skill.name)
                .join(", ")}`}
            />
            <ListItemSecondaryAction>
              <Button
                component={Link}
                to={`/chat/${match._id}`}
                variant="contained"
                color="primary"
                size="small"
              >
                Chat
              </Button>
            </ListItemSecondaryAction>
          </ListItem>
        ))}
      </List>
      <div className={classes.pagination}>
        <Pagination
          count={Math.ceil(matches.length / ITEMS_PER_PAGE)}
          page={page}
          onChange={handleChangePage}
          color="primary"
        />
      </div>
    </Paper>
  );
};

export default MatchList;
