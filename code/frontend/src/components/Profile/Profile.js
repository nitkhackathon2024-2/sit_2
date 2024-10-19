import React, { useState } from "react";
import {
  TextField,
  Button,
  Typography,
  Container,
  Grid,
  Select,
  MenuItem,
  Chip,
  InputLabel,
  FormControl,
  LinearProgress,
  CircularProgress,
  Box,
  Paper,
} from "@material-ui/core";

import { makeStyles } from "@material-ui/core/styles";
import api from "../../services/api";

const DAYS = [
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
  "Sunday",
];
const LEARNING_STYLES = [
  "Visual",
  "Auditory",
  "Kinesthetic",
  "Reading/Writing",
];
const LANGUAGES = [
  "English",
  "Spanish",
  "French",
  "German",
  "Chinese",
  "Japanese",
  "Other",
];

const useStyles = makeStyles((theme) => ({
  root: {
    marginTop: theme.spacing(4),
  },
  paper: {
    padding: theme.spacing(3),
    boxShadow: "0 3px 5px 2px rgba(0, 0, 0, .3)",
    transition: "box-shadow 0.3s ease-in-out",
    "&:hover": {
      boxShadow: "0 6px 10px 4px rgba(0, 0, 0, .3)",
    },
  },
  form: {
    display: "flex",
    flexDirection: "column",
    gap: theme.spacing(2),
    marginTop: theme.spacing(3),
  },
  submit: {
    margin: theme.spacing(3, 0, 2),
  },
  chipContainer: {
    display: "flex",
    flexWrap: "wrap",
    gap: theme.spacing(1),
  },
  chip: {
    margin: theme.spacing(0.5),
  },
  skillItem: {
    display: "flex",
    alignItems: "center",
    marginBottom: theme.spacing(2),
  },
  skillName: {
    minWidth: 100,
    marginRight: theme.spacing(2),
  },
  skillSlider: {
    flexGrow: 1,
  },
}));

const Profile = ({ user }) => {
  const classes = useStyles();
  const [formData, setFormData] = useState({
    skills: [],
    learningGoals: [],
    skillsToLearn: [],
    learningStyle: "",
    availability: [],
    goals: "",
    experienceLevel: 1,
    preferredLanguage: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const handleSkillChange = (index, field, value) => {
    const updatedSkills = [...formData.skills];
    updatedSkills[index][field] = value;
    setFormData((prevState) => ({
      ...prevState,
      skills: updatedSkills,
    }));
  };

  const addSkill = () => {
    setFormData((prevState) => ({
      ...prevState,
      skills: [...prevState.skills, { name: "", level: 1 }],
    }));
  };

  const handleArrayChange = (e, field) => {
    const { value } = e.target;
    setFormData((prevState) => ({
      ...prevState,
      [field]: typeof value === "string" ? value.split(",") : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await api.put("/users/profile", formData);
      alert("User profile created successfully!");
      // Redirect or update state as needed
    } catch (error) {
      console.error("Error creating user profile:", error);
      alert("Error creating user profile. Please try again.");
    }
  };

  return (
    <Container component="main" maxWidth="md">
      <Paper className={classes.paper}>
        <Typography component="h1" variant="h5" align="center" gutterBottom>
          Create User Profile
        </Typography>
        <form className={classes.form} onSubmit={handleSubmit}>
          <Grid container spacing={2}>
            {formData.skills.map((skill, index) => (
              <Grid item xs={12} sm={6} key={index}>
                <TextField
                  name={`skill-${index}`}
                  variant="outlined"
                  required
                  fullWidth
                  label={`Skill ${index + 1}`}
                  value={skill.name}
                  onChange={(e) =>
                    handleSkillChange(index, "name", e.target.value)
                  }
                  style={{ marginBottom: "10px" }}
                />
                <Select
                  fullWidth
                  value={skill.level}
                  onChange={(e) =>
                    handleSkillChange(index, "level", e.target.value)
                  }
                >
                  {[1, 2, 3, 4, 5].map((level) => (
                    <MenuItem key={level} value={level}>
                      {level}
                    </MenuItem>
                  ))}
                </Select>
              </Grid>
            ))}
            <Grid item xs={12}>
              <Button onClick={addSkill} variant="outlined" fullWidth>
                Add Skill
              </Button>
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                name="learningGoals"
                variant="outlined"
                fullWidth
                label="Learning Goals (comma-separated)"
                value={formData.learningGoals.join(",")}
                onChange={(e) => handleArrayChange(e, "learningGoals")}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                name="skillsToLearn"
                variant="outlined"
                fullWidth
                label="Skills to Learn (comma-separated)"
                value={formData.skillsToLearn.join(",")}
                onChange={(e) => handleArrayChange(e, "skillsToLearn")}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <FormControl fullWidth variant="outlined">
                <InputLabel>Learning Style</InputLabel>
                <Select
                  name="learningStyle"
                  value={formData.learningStyle}
                  onChange={handleChange}
                  label="Learning Style"
                >
                  {LEARNING_STYLES.map((style) => (
                    <MenuItem key={style} value={style}>
                      {style}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} sm={6}>
              <FormControl fullWidth variant="outlined">
                <InputLabel>Availability</InputLabel>
                <Select
                  multiple
                  name="availability"
                  value={formData.availability}
                  onChange={(e) => handleArrayChange(e, "availability")}
                  renderValue={(selected) => (
                    <div className={classes.chipContainer}>
                      {selected.map((value) => (
                        <Chip
                          key={value}
                          label={value}
                          className={classes.chip}
                        />
                      ))}
                    </div>
                  )}
                >
                  {DAYS.map((day) => (
                    <MenuItem key={day} value={day}>
                      {day}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12}>
              <TextField
                name="goals"
                variant="outlined"
                fullWidth
                label="Goals"
                value={formData.goals}
                onChange={handleChange}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                name="experienceLevel"
                variant="outlined"
                fullWidth
                type="number"
                label="Experience Level (1-5)"
                InputProps={{ inputProps: { min: 1, max: 5 } }}
                value={formData.experienceLevel}
                onChange={handleChange}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <FormControl fullWidth variant="outlined">
                <InputLabel>Preferred Language</InputLabel>
                <Select
                  name="preferredLanguage"
                  value={formData.preferredLanguage}
                  onChange={handleChange}
                  label="Preferred Language"
                >
                  {LANGUAGES.map((language) => (
                    <MenuItem key={language} value={language}>
                      {language}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
          </Grid>
          <Button
            type="submit"
            fullWidth
            variant="contained"
            color="primary"
            className={classes.submit}
          >
            Create Profile
          </Button>
        </form>
        <Typography variant="h6" align="center" gutterBottom>
          Achievements Progress
        </Typography>
        {user &&
        user.unlockedAchievements &&
        user.unlockedAchievements.length > 0 ? (
          user.unlockedAchievements.map((achievement) => (
            <div key={achievement._id}>
              <Typography>{achievement.title}</Typography>
              <LinearProgress variant="determinate" value={100} />
            </div>
          ))
        ) : (
          <Typography align="center">No achievements unlocked yet.</Typography>
        )}
      </Paper>
    </Container>
  );
};

export default Profile;
