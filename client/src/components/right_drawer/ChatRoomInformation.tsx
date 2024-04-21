import React, { useEffect, useState } from "react";
import { useChat } from "../../context/ChatAppContext";
import { useSocket } from "../../context/SocketContext";
import DirectMessageInformation from "./DirectMessageInformation";
import GroupChatInformation from "./GroupChatInformation";

type Props = {};

const ChatRoomInformation = (props: Props) => {
  const { currentChatRoom, setCurrentChatRoom } = useChat();
  const { on, off } = useSocket();

  useEffect(() => {
    const handleGettingChatInfo = (payload: any) => {
      setCurrentChatRoom(payload);
    };
    on("GET_ROOM_INFO", handleGettingChatInfo);
    return () => {
      off("GET_ROOM_INFO", handleGettingChatInfo);
    };
  }, [off, on, setCurrentChatRoom]);

  if (currentChatRoom == null) {
    return (
      <div className="chat-room-info">
        <div className="main-chat-info"></div>
        <div className="chat-room-info-bottom"></div>
      </div>
    );
  } else if (currentChatRoom.isGroupChat) {
    return <GroupChatInformation />;
  } else if (!currentChatRoom.isGroupChat) {
    return <DirectMessageInformation />;
  } else {
    return <div></div>;
  }
};

export default ChatRoomInformation;
