import React from "react";
import { Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import { Paper, makeStyles } from "@material-ui/core";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

const useStyles = makeStyles((theme) => ({
  chartContainer: {
    padding: theme.spacing(2),
    borderRadius: theme.shape.borderRadius,
    boxShadow: "0 4px 8px rgba(0,0,0,0.1)",
    transition: "all 0.3s ease",
    "&:hover": {
      boxShadow: "0 8px 16px rgba(0,0,0,0.2)",
      transform: "translateY(-4px)",
    },
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    maxWidth: "100%",
    height: "auto",
    aspectRatio: "16 / 9",
  },
}));

const SkillChart = ({ skills }) => {
  const classes = useStyles();

  const data = {
    labels: skills.map((skill) => skill.name),
    datasets: [
      {
        label: "Skill Levels",
        data: skills.map((skill) => skill.level),
        fill: false,
        backgroundColor: "rgba(75, 192, 192, 0.2)",
        borderColor: "rgba(75, 192, 192, 1)",
        borderWidth: 2,
        pointBackgroundColor: "rgba(75, 192, 192, 1)",
        pointBorderColor: "#fff",
        pointHoverBackgroundColor: "#fff",
        pointHoverBorderColor: "rgba(75, 192, 192, 1)",
        tension: 0.1,
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    scales: {
      y: {
        beginAtZero: true,
        max: 5,
        ticks: {
          stepSize: 1,
          font: {
            size: 10,
          },
        },
      },
      x: {
        ticks: {
          font: {
            size: 12,
          },
        },
      },
    },
    plugins: {
      legend: {
        display: false,
      },
      tooltip: {
        backgroundColor: "rgba(0, 0, 0, 0.7)",
        titleFont: {
          size: 14,
        },
        bodyFont: {
          size: 12,
        },
        padding: 10,
      },
    },
  };

  return (
    <Paper className={classes.chartContainer}>
      <Line data={data} options={options} />
    </Paper>
  );
};

export default SkillChart;
