import React, { useState } from "react";
import { Button, Typography, Paper, makeStyles } from "@material-ui/core";
import api from "../../services/api";

const useStyles = makeStyles((theme) => ({
  root: {
    padding: theme.spacing(3),
    marginTop: theme.spacing(2),
    boxShadow: "0 4px 8px 0 rgba(0,0,0,0.2)",
    transition: "0.3s",
    "&:hover": {
      boxShadow: "0 8px 16px 0 rgba(0,0,0,0.2)",
    },
    [theme.breakpoints.down("sm")]: {
      padding: theme.spacing(2),
    },
  },
  input: {
    display: "none",
  },
  preview: {
    marginTop: theme.spacing(2),
  },
  buttonContainer: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    flexDirection: "column",
    marginTop: theme.spacing(2),
  },
  button: {
    margin: theme.spacing(1),
    width: "200px",
    [theme.breakpoints.down("sm")]: {
      width: "100%",
    },
  },
}));

const ResumeParser = () => {
  const classes = useStyles();
  const [file, setFile] = useState(null);
  const [parsedData, setParsedData] = useState(null);

  const handleFileChange = (event) => {
    setFile(event.target.files[0]);
  };

  const handleUpload = async () => {
    if (!file) return;

    const formData = new FormData();
    formData.append("resume", file);

    try {
      const response = await api.post("/parse-resume", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      setParsedData(response.data);
    } catch (error) {
      console.error("Error parsing resume:", error);
    }
  };

  return (
    <Paper className={classes.root}>
      <Typography variant="h6" align="center">
        Resume Parser
      </Typography>
      <div className={classes.buttonContainer}>
        <input
          accept=".pdf,.doc,.docx"
          className={classes.input}
          id="resume-file"
          type="file"
          onChange={handleFileChange}
        />
        <label htmlFor="resume-file">
          <Button
            variant="contained"
            color="primary"
            component="span"
            className={classes.button}
          >
            Select Resume
          </Button>
        </label>
        {file && (
          <Typography variant="body2" className={classes.preview}>
            Selected file: {file.name}
          </Typography>
        )}
        <Button
          variant="contained"
          color="secondary"
          onClick={handleUpload}
          disabled={!file}
          className={classes.button}
        >
          Parse Resume
        </Button>
      </div>
      {parsedData && (
        <div className={classes.preview}>
          <Typography variant="h6" align="center">
            Parsed Data:
          </Typography>
          <pre>{JSON.stringify(parsedData, null, 2)}</pre>
        </div>
      )}
    </Paper>
  );
};

export default ResumeParser;
