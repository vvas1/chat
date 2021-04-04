import React from "react";
import io from "socket.io-client";

const token = localStorage.getItem("token");

function ChatroomPage({ match }) {
  const { roomId } = match.params;
  io(process.env.EACT_APP_API_URL, { query: { token } });

  return <div>Chatroompage</div>;
}

export default ChatroomPage;
