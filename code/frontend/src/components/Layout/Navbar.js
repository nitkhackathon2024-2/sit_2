import React, { useContext } from "react";
import { Link as RouterLink } from "react-router-dom";
import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  makeStyles,
  useMediaQuery,
  useTheme,
  IconButton,
  Menu,
  MenuItem,
} from "@material-ui/core";
import MenuIcon from "@material-ui/icons/Menu";
import { AuthContext } from "../../contexts/AuthContext";

const useStyles = makeStyles((theme) => ({
  root: {
    flexGrow: 1,
  },
  appBar: {
    boxShadow:
      "0px 2px 4px -1px rgba(0,0,0,0.2), 0px 4px 5px 0px rgba(0,0,0,0.14), 0px 1px 10px 0px rgba(0,0,0,0.12)",
  },
  title: {
    flexGrow: 1,
  },
  link: {
    color: "white",
    textDecoration: "none",
    "&:hover": {
      textDecoration: "underline",
    },
  },
  button: {
    margin: theme.spacing(1),
    "&:hover": {
      backgroundColor: theme.palette.primary.dark,
    },
  },
  menuButton: {
    marginRight: theme.spacing(2),
  },
}));

const Navbar = () => {
  const classes = useStyles();
  const { user, logout } = useContext(AuthContext);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const [anchorEl, setAnchorEl] = React.useState(null);

  const handleMenu = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  return (
    <AppBar position="static" className={classes.appBar}>
      <Toolbar>
        <Typography variant="h6" className={classes.title}>
          <RouterLink to="/" className={classes.link}>
            Peer Learning Platform
          </RouterLink>
        </Typography>
        {isMobile ? (
          <>
            <IconButton
              edge="start"
              className={classes.menuButton}
              color="inherit"
              aria-label="menu"
              onClick={handleMenu}
            >
              <MenuIcon />
            </IconButton>
            <Menu
              id="menu-appbar"
              anchorEl={anchorEl}
              anchorOrigin={{
                vertical: "top",
                horizontal: "right",
              }}
              keepMounted
              transformOrigin={{
                vertical: "top",
                horizontal: "right",
              }}
              open={Boolean(anchorEl)}
              onClose={handleClose}
            >
              {user
                ? [
                    <MenuItem
                      key="dashboard"
                      component={RouterLink}
                      to="/dashboard"
                      onClick={handleClose}
                    >
                      Dashboard
                    </MenuItem>,
                    <MenuItem
                      key="profile"
                      component={RouterLink}
                      to="/profile"
                      onClick={handleClose}
                    >
                      Profile
                    </MenuItem>,

                    <MenuItem
                      key="logout"
                      onClick={() => {
                        logout();
                        handleClose();
                      }}
                    >
                      Logout
                    </MenuItem>,
                  ]
                : [
                    <MenuItem
                      key="login"
                      component={RouterLink}
                      to="/login"
                      onClick={handleClose}
                    >
                      Login
                    </MenuItem>,
                    <MenuItem
                      key="gamification"
                      component={RouterLink}
                      to="/gamification"
                      onClick={handleClose}
                    >
                      challenges
                    </MenuItem>,
                    <MenuItem
                      key="register"
                      component={RouterLink}
                      to="/register"
                      onClick={handleClose}
                    >
                      Register
                    </MenuItem>,
                    <MenuItem
                      key="learning-path"
                      component={RouterLink}
                      to="/learning-path"
                      onClick={handleClose}
                    >
                      Learning Path
                    </MenuItem>,
                  ]}
            </Menu>
          </>
        ) : user ? (
          <>
            <Button
              className={classes.button}
              color="inherit"
              component={RouterLink}
              to="/dashboard"
            >
              Dashboard
            </Button>
            <Button
              className={classes.button}
              color="inherit"
              component={RouterLink}
              to="/profile"
            >
              Profile
            </Button>
            <Button className={classes.button} color="inherit" onClick={logout}>
              Logout
            </Button>
            <Button
              className={classes.button}
              color="inherit"
              component={RouterLink}
              to="/learning-path"
            >
              learning path
            </Button>
            <Button
              className={classes.button}
              color="inherit"
              component={RouterLink}
              to="/gamification"
            >
              Chalenges
            </Button>
          </>
        ) : (
          <>
            <Button
              className={classes.button}
              color="inherit"
              component={RouterLink}
              to="/login"
            >
              Login
            </Button>
            <Button
              className={classes.button}
              color="inherit"
              component={RouterLink}
              to="/register"
            >
              Register
            </Button>
          </>
        )}
      </Toolbar>
    </AppBar>
  );
};

export default Navbar;
