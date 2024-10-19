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
    transition: "box-shadow 0.3s ease-in-out",
    "&:hover": {
      boxShadow: "0 5px 15px 5px rgba(0, 0, 0, .15)",
    },
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
}));

const Register = () => {
  const classes = useStyles();
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const { register } = useContext(AuthContext);
  const navigate = useNavigate();
  const [inProp, setInProp] = useState(false);

  React.useEffect(() => {
    setInProp(true);
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const success = await register(username, email, password);
    if (success) {
      navigate("/dashboard");
    }
  };

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
            Register
          </Typography>
          <form className={classes.form} onSubmit={handleSubmit}>
            <TextField
              variant="outlined"
              margin="normal"
              required
              fullWidth
              id="username"
              label="Username"
              name="username"
              autoComplete="username"
              autoFocus
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className={classes.textField}
            />
            <TextField
              variant="outlined"
              margin="normal"
              required
              fullWidth
              id="email"
              label="Email Address"
              name="email"
              autoComplete="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className={classes.textField}
            />
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
            <Button
              type="submit"
              fullWidth
              variant="contained"
              className={classes.submit}
            >
              Register
            </Button>
          </form>
        </div>
      </CSSTransition>
    </Container>
  );
};

export default Register;
