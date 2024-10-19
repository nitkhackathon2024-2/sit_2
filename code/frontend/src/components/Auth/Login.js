import React, { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import {
  TextField,
  Button,
  Typography,
  Container,
  makeStyles,
} from "@material-ui/core";
import { AuthContext } from "../../contexts/AuthContext";
import { CSSTransition } from "react-transition-group";

const useStyles = makeStyles((theme) => ({
  paper: {
    marginTop: theme.spacing(8),
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    padding: theme.spacing(3),
    backgroundColor: "#f0f4f8",
    borderRadius: theme.spacing(2),
    boxShadow: "0 3px 5px 2px rgba(0, 0, 0, .1)",
  },
  form: {
    width: "100%",
    marginTop: theme.spacing(1),
  },
  submit: {
    margin: theme.spacing(3, 0, 2),
    backgroundColor: "#4a90e2",
    color: "white",
    "&:hover": {
      backgroundColor: "#357ae8",
    },
  },
  textField: {
    "& .MuiOutlinedInput-root": {
      "& fieldset": {
        borderColor: "#4a90e2",
      },
      "&:hover fieldset": {
        borderColor: "#357ae8",
      },
      "&.Mui-focused fieldset": {
        borderColor: "#1c54b2",
      },
    },
  },
  fadeEnter: {
    opacity: 0,
  },
  fadeEnterActive: {
    opacity: 1,
    transition: "opacity 300ms ease-in",
  },
  slideEnter: {
    transform: "translateX(-20px)",
    opacity: 0,
  },
  slideEnterActive: {
    transform: "translateX(0)",
    opacity: 1,
    transition: "all 300ms ease-in",
  },
}));

const Login = () => {
  const classes = useStyles();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const { login } = useContext(AuthContext);
  const navigate = useNavigate();
  const [inProp, setInProp] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const success = await login(email, password);
    if (success) {
      navigate("/dashboard");
    }
  };

  React.useEffect(() => {
    setInProp(true);
  }, []);

  return (
    <Container component="main" maxWidth="xs">
      <CSSTransition
        in={inProp}
        timeout={300}
        classNames={{
          enter: classes.fadeEnter,
          enterActive: classes.fadeEnterActive,
        }}
      >
        <div className={classes.paper}>
          <Typography component="h1" variant="h5" gutterBottom>
            Login
          </Typography>
          <form className={classes.form} onSubmit={handleSubmit}>
            <CSSTransition
              in={inProp}
              timeout={300}
              classNames={{
                enter: classes.slideEnter,
                enterActive: classes.slideEnterActive,
              }}
            >
              <TextField
                variant="outlined"
                margin="normal"
                required
                fullWidth
                id="email"
                label="Email Address"
                name="email"
                autoComplete="email"
                autoFocus
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className={classes.textField}
              />
            </CSSTransition>
            <CSSTransition
              in={inProp}
              timeout={300}
              classNames={{
                enter: classes.slideEnter,
                enterActive: classes.slideEnterActive,
              }}
            >
              <TextField
                variant="outlined"
                margin="normal"
                required
                fullWidth
                name="password"
                label="Password"
                type="password"
                id="password"
                autoComplete="current-password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className={classes.textField}
              />
            </CSSTransition>
            <CSSTransition
              in={inProp}
              timeout={300}
              classNames={{
                enter: classes.fadeEnter,
                enterActive: classes.fadeEnterActive,
              }}
            >
              <Button
                type="submit"
                fullWidth
                variant="contained"
                className={classes.submit}
              >
                Sign In
              </Button>
            </CSSTransition>
          </form>
        </div>
      </CSSTransition>
    </Container>
  );
};

export default Login;
