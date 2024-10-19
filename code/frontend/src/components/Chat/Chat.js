import React, { useState, useEffect, useContext, useRef } from "react";
import { useParams } from "react-router-dom";
import ScreenSharing from "../Profile/ScreenSharing";

import {
  Container,
  Typography,
  TextField,
  Button,
  List,
  ListItem,
  ListItemText,
  makeStyles,
  Paper,
} from "@material-ui/core";
import { Send } from "@material-ui/icons";
import { AuthContext } from "../../contexts/AuthContext";
import socket from "../../services/socket";
import api from "../../services/api";

const useStyles = makeStyles((theme) => ({
  root: {
    marginTop: theme.spacing(4),
    display: "flex",
    flexDirection: "column",
    height: "calc(100vh - 64px)", // Adjust for app bar height
    maxWidth: "100%",
    padding: 0,
  },
  chatHeader: {
    padding: theme.spacing(2),
    backgroundColor: theme.palette.primary.main,
    color: theme.palette.primary.contrastText,
  },
  messageList: {
    flexGrow: 1,
    overflow: "auto",
    padding: theme.spacing(2),
    backgroundColor: "#f5f5f5",
  },
  messageItem: {
    marginBottom: theme.spacing(1),
  },
  messageContent: {
    padding: theme.spacing(1, 2),
    borderRadius: "18px",
    maxWidth: "70%",
    wordBreak: "break-word",
  },
  sentMessage: {
    backgroundColor: theme.palette.primary.main,
    color: theme.palette.primary.contrastText,
    alignSelf: "flex-end",
    marginLeft: "auto",
  },
  receivedMessage: {
    backgroundColor: "#fff",
    alignSelf: "flex-start",
  },
  inputArea: {
    display: "flex",
    padding: theme.spacing(2),
    backgroundColor: theme.palette.background.paper,
    borderTop: `1px solid ${theme.palette.divider}`,
  },
  input: {
    flexGrow: 1,
    marginRight: theme.spacing(2),
  },
  sendButton: {
    borderRadius: "50%",
    minWidth: "unset",
    width: "48px",
    height: "48px",
  },
  screenSharingContainer: {
    marginTop: theme.spacing(2),
  },
}));

const Chat = () => {
  const classes = useStyles();
  const { user } = useContext(AuthContext);
  const { otherUserId } = useParams();
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const messageListRef = useRef(null);

  useEffect(() => {
    console.log("Joining room with otherUserId:", otherUserId);
    socket.emit("join", { userId: user._id, otherUserId });

    socket.on("joined", (data) => {
      console.log("Joined room:", data);
    });
    const fetchMessages = async () => {
      try {
        const response = await api.get(`/messages/${user._id}/${otherUserId}`);
        setMessages(response.data);
      } catch (error) {
        console.error("Error fetching messages:", error);
      }
    };

    fetchMessages();
    socket.emit("join", { userId: user._id, otherUserId });

    const handleNewMessage = (message) => {
      console.log("Received new message:", message);
      setMessages((prevMessages) => [...prevMessages, message]);
    };

    socket.on("message", handleNewMessage);

    return () => {
      socket.off("message", handleNewMessage);
    };
  }, [user._id, otherUserId]);

  useEffect(() => {
    if (messageListRef.current) {
      messageListRef.current.scrollTop = messageListRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSendMessage = (e) => {
    e.preventDefault();
    if (newMessage.trim() && user?._id && otherUserId) {
      socket.emit(
        "sendMessage",
        {
          senderId: user._id,
          receiverId: otherUserId,
          text: newMessage,
        },
        (acknowledgement) => {
          if (acknowledgement && acknowledgement._id) {
            console.log("Message sent successfully:", acknowledgement);
          } else {
            console.error("Failed to send message");
          }
        }
      );
      setNewMessage("");
    }
  };

  return (
    <Container className={classes.root} component={Paper}>
      <Typography variant="h6" className={classes.chatHeader}>
        Chat
      </Typography>
      <List className={classes.messageList} ref={messageListRef}>
        {messages.map((message) => (
          <ListItem
            key={message._id}
            className={classes.messageItem}
            style={{
              justifyContent:
                message.senderId === user._id ? "flex-end" : "flex-start",
            }}
          >
            <Paper
              className={`${classes.messageContent} ${
                message.senderId === user._id
                  ? classes.sentMessage
                  : classes.receivedMessage
              }`}
            >
              <ListItemText primary={message.text} />
            </Paper>
          </ListItem>
        ))}
      </List>
      <form onSubmit={handleSendMessage} className={classes.inputArea}>
        <TextField
          className={classes.input}
          variant="outlined"
          size="small"
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          placeholder="Type a message..."
        />
        <Button
          type="submit"
          variant="contained"
          color="primary"
          className={classes.sendButton}
        >
          <Send />
        </Button>
      </form>
      <div className={classes.screenSharingContainer}>
        <ScreenSharing otherUserId={otherUserId} />
      </div>
    </Container>
  );
};

export default Chat;
