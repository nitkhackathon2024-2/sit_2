import React, { useState, useEffect } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Avatar,
  Typography,
  useMediaQuery,
} from "@material-ui/core";
import { makeStyles, useTheme } from "@material-ui/core/styles";
import api from "../../services/api";

const useStyles = makeStyles((theme) => ({
  root: {
    marginBottom: theme.spacing(3),
    boxShadow: "0 4px 8px 0 rgba(0,0,0,0.2)",
    transition: "0.3s",
    "&:hover": {
      boxShadow: "0 8px 16px 0 rgba(0,0,0,0.2)",
    },
    height: "calc(100vh - 64px)", // Adjust for app bar height
    display: "flex",
    flexDirection: "column",
  },
  tableContainer: {
    flexGrow: 1,
  },
  table: {
    width: "100%",
  },
  avatar: {
    marginRight: theme.spacing(2),
  },
  nameCell: {
    display: "flex",
    alignItems: "center",
  },
  tableRow: {
    transition: "background-color 0.3s",
    "&:hover": {
      backgroundColor: theme.palette.action.hover,
    },
  },
  responsiveCell: {
    [theme.breakpoints.down("sm")]: {
      display: "none",
    },
  },
}));

const Leaderboard = () => {
  const classes = useStyles();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const [leaderboard, setLeaderboard] = useState([]);

  useEffect(() => {
    const fetchLeaderboard = async () => {
      try {
        const response = await api.get("/users");
        setLeaderboard(response.data);
      } catch (error) {
        console.error("Error fetching leaderboard:", error);
      }
    };
    fetchLeaderboard();
  }, []);

  return (
    <div className={classes.root}>
      <TableContainer component={Paper} className={classes.tableContainer}>
        <Table
          className={classes.table}
          aria-label="leaderboard table"
          stickyHeader
        >
          <TableHead>
            <TableRow>
              <TableCell align="center">Rank</TableCell>
              <TableCell align="center">User</TableCell>
              <TableCell align="center">Points</TableCell>
              <TableCell align="center" className={classes.responsiveCell}>
                Challenges Completed
              </TableCell>
              <TableCell align="center" className={classes.responsiveCell}>
                Achievements Unlocked
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {leaderboard.map((user, index) => (
              <TableRow key={user._id} className={classes.tableRow}>
                <TableCell component="th" scope="row" align="center">
                  {index + 1}
                </TableCell>
                <TableCell align="center">
                  <div
                    className={classes.nameCell}
                    style={{ justifyContent: "center" }}
                  >
                    <Avatar src={user.avatar} className={classes.avatar} />
                    <Typography>{user.name}</Typography>
                  </div>
                </TableCell>
                <TableCell align="center">{user.points}</TableCell>
                <TableCell align="center" className={classes.responsiveCell}>
                  {user.challengesCompleted}
                </TableCell>
                <TableCell align="center" className={classes.responsiveCell}>
                  {user.achievementsUnlocked}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </div>
  );
};

export default Leaderboard;
