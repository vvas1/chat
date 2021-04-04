import React, { useEffect, useState } from "react";
import { Redirect } from "react-router";
import axios from "axios";
import { SendOutlined } from "@ant-design/icons";
import { Modal, Button, Card, Input } from "antd";
import Avatar from "antd/lib/avatar/avatar";
import Meta from "antd/lib/card/Meta";
import Search from "antd/lib/input/Search";
import { ROUTES } from "../configs/routes";
import Swal from "sweetalert2";

const userId = localStorage.getItem("userId");
const token = localStorage.getItem("token");
const PATH = "http://localhost:5000";
const name = localStorage.getItem("userName");

function DashboardPage({ socket }) {
  const [chatrooms, setChatrooms] = useState([]);
  const [visible, setVisible] = useState(false);
  const [roomName, setRoomName] = useState("");
  const [activeRoomId, setActiveRoomId] = useState("");
  const [activeRoomName, setActiveRoomName] = useState("");
  const [previosRoomId, setPreviousRoomId] = useState("");
  const [messageToSend, setMessageToSend] = useState("");
  const [messages, setMessages] = useState([]);

  const sendMessage = () => {
    if (socket) {
      socket.emit(
        "chatroomMessage",
        {
          chatroomId: activeRoomId,
          message: messageToSend,
        },
        (error) => {
          if (error) {
            throw error;
          }
        }
      );
      setMessageToSend("");
    }
  };

  const getChatrooms = async () => {
    await axios
      .get(PATH + "/", {
        headers: {
          Authorization: "Bearer " + token,
          "Content-Type": "application/json",
        },
      })
      .then((res) => {
        setChatrooms(res.data.chatrooms);
      })
      .catch((err) => {
        Swal.fire("error", err.response?.data);
      });
  };

  useEffect(() => {
    getChatrooms();
  }, []);
  useEffect(() => {
    if (socket) {
      socket.on("newMessage", (data) => {
        setMessages((messages) => [...messages, data]);
      });
    }
  }, [socket]);

  useEffect(() => {
    if (socket && activeRoomId) {
      socket.emit(
        "joinRoom",
        { chatroomId: activeRoomId, userName: name },
        (error) => {
          if (error) {
            throw error;
          }
        }
      );
      setMessages((messages) => (messages = []));
      return () => {
        socket.emit("leaveRoom", { chatroomId: previosRoomId });
      };
    }
  }, [activeRoomId, previosRoomId, socket]);

  // create room
  const handleOk = async () => {
    setVisible(false);
    await axios
      .post(
        PATH + "/",
        { name: roomName },
        {
          headers: {
            Authorization: "Bearer " + token,
            "Content-Type": "application/json",
          },
        }
      )
      .then((res) => {
        setRoomName("");
        Swal.fire("success", res.data.message);
      })
      .catch((e) => {
        Swal.fire("error", e.response.data.message);
      });
  };

  document.addEventListener("keyup", (e) => {
    console.log("target name", e.target.name);
    if (e.key === "Escape") {
      setActiveRoomId("");
      setMessages([]);
    }
  });

  const enterHandler = (e) => {
    console.log(e.key);
    if (e.key === "Enter") {
      sendMessage();
    }
  };

  const handleCancel = () => {
    console.log("Clicked cancel button");
    setVisible(false);
  };
  const mappedList = chatrooms?.map((listItem) => {
    return (
      <Card
        key={listItem._id}
        style={{
          marginTop: 16,
          border: "1px solid blue",
          backgroundColor:
            activeRoomId === listItem._id ? "rgba(0,0,0,0.06)" : "",
        }}
        onClick={() => {
          if (activeRoomId === listItem._id) return;
          setPreviousRoomId(activeRoomId);
          setActiveRoomId(listItem._id);
          setActiveRoomName(listItem.name);
        }}
      >
        <Meta
          style={{ overflow: "elipsis" }}
          avatar={
            <Avatar src="https://zos.alipayobjects.com/rmsportal/ODTLcjxAfvqbxHnVXCYX.png" />
          }
          title={listItem.name}
          description={listItem.text}
        />
      </Card>
    );
  });

  const mappedMessages = messages.map((message, index) => {
    return (
      <div
        key={index}
        style={{
          display: "flex",
          alignItems: "center",
          marginLeft: "1rem",
        }}
      >
        <Avatar src="https://zos.alipayobjects.com/rmsportal/ODTLcjxAfvqbxHnVXCYX.png" />
        <Card
          style={{
            margin: 16,
            border: "1px solid blue",
            borderRadius: "15px 16px 15px 0",
            backgroundColor: message.user === userId ? "" : "lightblue",
          }}
        >
          <Meta description={message.text} />
          {`number ${index + 1}`}
        </Card>
      </div>
    );
  });

  return token ? (
    <div
      style={{
        padding: "1rem",
        border: "1px solid green",
      }}
    >
      <div
        style={{
          padding: ".5rem",
          border: "1px solid green",
          display: "flex",
        }}
      >
        DashboardPage{" "}
        <Button onClick={() => setVisible(true)} type="primary">
          create room
        </Button>
      </div>
      <div style={{ display: "flex" }}>
        <div
          className="room-list-container"
          style={{
            flexBasis: "30%",
            height: "90vh",
            padding: "1rem",
            border: "1px solid green",
            backgroundColor: "#fafafa",
            overflow: "hidden",
          }}
        >
          <div>
            <Search
              bordered={true}
              placeholder="input search text"
              onSearch={() => {}}
              enterButton
              allowClear={true}
            />
          </div>
          <div
            className="room-list"
            style={{ marginTop: "1rem", overflow: "auto", height: "75vh" }}
          >
            <div>{mappedList}</div>
          </div>
        </div>
        <div
          className="message-container"
          style={{
            width: "100%",
            height: "90vh",
            border: "1px solid red",
            position: "relative",
            overflow: "hidden",
          }}
        >
          <div
            style={{
              padding: "1rem",
              border: "1px solid brown",
            }}
          >
            <h4>{activeRoomName}</h4>
            <h5>{"Online: " + socket?.connected}</h5>
          </div>
          <div style={{ overflow: "auto", height: "60vh" }}>
            <div>{mappedMessages}</div>
          </div>
          <div
            style={{
              bottom: 0,
              width: "100%",
              border: "2px cyan",
              padding: "2rem 6rem",
              position: "absolute",
              backgroundColor: "#fafafa",
            }}
          >
            <Input
              onKeyUp={(e) => enterHandler(e)}
              id="send-message"
              onChange={(e) => setMessageToSend(e.target.value)}
              size="large"
              value={messageToSend}
              allowClear={true}
              style={{ width: "100%" }}
              placeholder="Send message..."
              suffix={
                <Button onClick={sendMessage}>
                  <SendOutlined />
                </Button>
              }
            />
          </div>
        </div>
      </div>
      <Modal
        title="Title"
        visible={visible}
        onOk={handleOk}
        onCancel={handleCancel}
      >
        <Input
          onChange={(e) => setRoomName(e.target.value)}
          placeholder="Chatroom name..."
        />
      </Modal>
    </div>
  ) : (
    <Redirect to={ROUTES.login} />
  );
}

export default DashboardPage;