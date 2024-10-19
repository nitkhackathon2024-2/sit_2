import React, { useState, useRef } from "react";
import axios from "axios";
import {
  Typography,
  Paper,
  CircularProgress,
  Tooltip,
  TextField,
  Button,
  makeStyles,
} from "@material-ui/core";

const useStyles = makeStyles((theme) => ({
  root: {
    padding: theme.spacing(3),
  },
  paper: {
    padding: theme.spacing(2),
    marginBottom: theme.spacing(2),
  },
  svgContainer: {
    width: "100%",
    height: "700px",
    border: "1px solid #ccc",
    borderRadius: theme.shape.borderRadius,
    overflow: "auto",
  },
  node: {
    cursor: "pointer",
    "&:hover": {
      filter: "brightness(90%)",
    },
  },
  nodeText: {
    fill: "black",
    fontSize: "12px",
    pointerEvents: "none",
  },
  input: {
    marginBottom: theme.spacing(2),
  },
}));

const PersonalizedLearningPath = () => {
  const classes = useStyles();
  const [skills, setSkills] = useState([]);
  const [connections, setConnections] = useState([]);
  const [loading, setLoading] = useState(false);
  const [topic, setTopic] = useState("");
  const [error, setError] = useState("");
  const topicRef = useRef(null);

  const extractJsonFromResponse = (text) => {
    const startIndex = text.indexOf("{");
    const endIndex = text.lastIndexOf("}");

    if (startIndex === -1 || endIndex === -1) {
      throw new Error("No valid JSON object found in the response");
    }

    const jsonString = text.slice(startIndex, endIndex + 1);
    return JSON.parse(jsonString);
  };

  const generateLearningPath = async () => {
    setLoading(true);
    setError("");
    try {
      const response = await axios({
        url: "https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=AIzaSyBYpqbGCFwf4jf4_V8ZoVCfP0h8KNVk0DI",
        method: "POST",
        data: {
          contents: [
            {
              parts: [
                {
                  text: `Generate a learning path for ${topic}. Provide 6 main subtopics or skills to learn, each with a brief description. Format the response as a JSON object with an array called 'skills', where each skill has 'name' and 'description' properties.`,
                },
              ],
            },
          ],
        },
      });

      const content = response.data.candidates[0].content;
      let parsedContent;
      try {
        parsedContent = extractJsonFromResponse(content.parts[0].text);
      } catch (parseError) {
        console.error("Error parsing JSON:", parseError);
        throw new Error("Invalid response format from API");
      }

      if (!parsedContent.skills || !Array.isArray(parsedContent.skills)) {
        throw new Error("Invalid skills data in API response");
      }

      const newSkills = parsedContent.skills.map((skill, index) => ({
        id: index + 1,
        name: skill.name,
        description: skill.description,
        x: 100 + (index % 3) * 200,
        y: 100 + Math.floor(index / 3) * 150,
      }));

      const newConnections = newSkills.slice(0, -1).map((skill, index) => ({
        source: skill.id,
        target: newSkills[index + 1].id,
      }));

      setSkills(newSkills);
      setConnections(newConnections);
    } catch (error) {
      console.error("Error generating learning path:", error);
      setError(
        "An error occurred while generating the learning path. Please try again."
      );
    }
    setLoading(false);
  };

  const handleNodeClick = (skillId) => {
    const skill = skills.find((s) => s.id === skillId);
    alert(`Skill: ${skill.name}\nDescription: ${skill.description}`);
  };

  const renderTree = () => {
    const nodeRadius = 50;

    return (
      <svg width="100%" height="100%">
        {connections.map((conn) => {
          const source = skills.find((s) => s.id === conn.source);
          const target = skills.find((s) => s.id === conn.target);
          return (
            <line
              key={`${conn.source}-${conn.target}`}
              x1={source.x}
              y1={source.y}
              x2={target.x}
              y2={target.y}
              stroke="#999"
              strokeWidth="2"
            />
          );
        })}
        {skills.map((skill) => (
          <g key={skill.id}>
            <Tooltip title={skill.description}>
              <circle
                cx={skill.x}
                cy={skill.y}
                r={nodeRadius}
                fill="#2196F3"
                className={classes.node}
                onClick={() => handleNodeClick(skill.id)}
              />
            </Tooltip>
            <text
              x={skill.x}
              y={skill.y}
              textAnchor="middle"
              dominantBaseline="middle"
              className={classes.nodeText}
            >
              {skill.name}
            </text>
          </g>
        ))}
      </svg>
    );
  };

  return (
    <div className={classes.root}>
      <Paper className={classes.paper}>
        <Typography variant="h4" gutterBottom>
          Generate Your Learning Path
        </Typography>
        <TextField
          className={classes.input}
          fullWidth
          label="Enter a topic to learn"
          value={topic}
          onChange={(e) => setTopic(e.target.value)}
          inputRef={topicRef}
        />
        <Button
          variant="contained"
          color="primary"
          onClick={generateLearningPath}
          disabled={loading || !topic}
        >
          Generate Learning Path
        </Button>
      </Paper>
      {loading && <CircularProgress />}
      {error && (
        <Typography color="error" gutterBottom>
          {error}
        </Typography>
      )}
      {skills.length > 0 && (
        <div className={classes.svgContainer}>{renderTree()}</div>
      )}
    </div>
  );
};

export default PersonalizedLearningPath;
