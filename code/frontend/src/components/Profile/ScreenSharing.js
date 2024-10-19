import React, { useState, useEffect, useRef } from "react";
import { Button, Typography, Paper, makeStyles } from "@material-ui/core";
import socket from "../../services/socket";

const useStyles = makeStyles((theme) => ({
  root: {
    padding: theme.spacing(3),
    marginTop: theme.spacing(2),
    boxShadow: "0 4px 8px 0 rgba(0, 0, 0, 0.2)",
    transition: "0.3s",
    "&:hover": {
      boxShadow: "0 8px 16px 0 rgba(0, 0, 0, 0.2)",
    },
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
  },
  video: {
    width: "100%",
    maxWidth: "600px",
    marginTop: theme.spacing(2),
  },
  button: {
    margin: theme.spacing(2),
    transition: "0.3s",
    "&:hover": {
      transform: "scale(1.05)",
    },
  },
}));

const ScreenSharing = ({ otherUserId }) => {
  const classes = useStyles();
  const [stream, setStream] = useState(null);
  const [isSharing, setIsSharing] = useState(false);
  const peerConnection = useRef(null);

  useEffect(() => {
    console.log("ScreenSharing component mounted. otherUserId:", otherUserId);
    socket.on("offer", handleOffer);
    socket.on("answer", handleAnswer);
    socket.on("ice-candidate", handleNewICECandidateMsg);

    return () => {
      socket.off("offer", handleOffer);
      socket.off("answer", handleAnswer);
      socket.off("ice-candidate", handleNewICECandidateMsg);
    };
  }, []);

  const startScreenShare = async () => {
    try {
      console.log("Starting screen share...");
      const mediaStream = await navigator.mediaDevices.getDisplayMedia({
        video: true,
        audio: false,
      });
      console.log("Got media stream:", mediaStream);
      setStream(mediaStream);
      setIsSharing(true);

      // ... rest of the function
    } catch (error) {
      if (error.name === "NotReadableError") {
        console.error(
          "NotReadableError: Unable to access the screen. Make sure no other application is using screen capture."
        );
        alert(
          "Unable to access the screen. Please make sure no other application is using screen capture and try again."
        );
      } else if (error.name === "NotAllowedError") {
        console.error(
          "NotAllowedError: Permission to capture screen was denied."
        );
        alert(
          "Permission to capture screen was denied. Please grant permission and try again."
        );
      } else {
        console.error("Error starting screen share:", error);
        alert(
          "An error occurred while trying to start screen sharing. Please try again."
        );
      }
    }
  };

  const stopScreenShare = () => {
    if (stream) {
      stream.getTracks().forEach((track) => track.stop());
      setStream(null);
      setIsSharing(false);
      if (peerConnection.current) {
        peerConnection.current.close();
        peerConnection.current = null;
      }
      socket.emit("stop-sharing", { to: otherUserId });
    }
  };

  const createPeerConnection = () => {
    const pc = new RTCPeerConnection({
      iceServers: [{ urls: "stun:stun.l.google.com:19302" }],
    });

    pc.onicecandidate = (event) => {
      if (event.candidate) {
        socket.emit("ice-candidate", {
          candidate: event.candidate,
          to: otherUserId,
        });
      }
    };

    return pc;
  };

  const handleOffer = async (data) => {
    peerConnection.current = createPeerConnection();
    await peerConnection.current.setRemoteDescription(data.offer);
    const answer = await peerConnection.current.createAnswer();
    await peerConnection.current.setLocalDescription(answer);
    socket.emit("answer", { answer, to: data.from });

    peerConnection.current.ontrack = (event) => {
      setStream(event.streams[0]);
      setIsSharing(true);
    };
  };

  const handleAnswer = async (data) => {
    await peerConnection.current.setRemoteDescription(data.answer);
  };

  const handleNewICECandidateMsg = async (data) => {
    if (peerConnection.current) {
      await peerConnection.current.addIceCandidate(data.candidate);
    }
  };

  return (
    <Paper className={classes.root}>
      <Typography variant="h6" align="center">
        Screen Sharing
      </Typography>
      {!isSharing && (
        <Button
          variant="contained"
          color="primary"
          onClick={startScreenShare}
          className={classes.button}
        >
          Start Screen Share
        </Button>
      )}
      {isSharing && (
        <Button
          variant="contained"
          color="secondary"
          onClick={stopScreenShare}
          className={classes.button}
        >
          Stop Screen Share
        </Button>
      )}
      {stream && (
        <video
          className={classes.video}
          ref={(video) => {
            if (video) video.srcObject = stream;
          }}
          autoPlay
        />
      )}
    </Paper>
  );
};

export default ScreenSharing;
