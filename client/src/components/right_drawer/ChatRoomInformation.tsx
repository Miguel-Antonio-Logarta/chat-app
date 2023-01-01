import React, { useState, useEffect } from "react";
import { ImExit } from "react-icons/im"
import { MdPersonAddAlt } from "react-icons/md"
import GroupMembersStatus from "./GroupMembersStatus";
import LeaveGroupChat from "./LeaveGroupChat";
import InviteGroupMembers from "./InviteGroupMembers";
import { useSocket } from "../../context/SocketContext";
import { useChat } from "../../context/ChatAppContext";
import GroupChatIcon from "../GroupChatIcon";

type Props = {};

const ChatRoomInformation = (props: Props) => {
  // const {socket, isConnected, currentRoom, setCurrentRoom} = useSocketContext();
  const {currentChatRoom, setCurrentChatRoom} = useChat();
  const { sendMessage, on, off } = useSocket();
  // const [roomName, setRoomName] = useState("");
  // const [onlineUsers, setOnlineUsers] = useState([]);
  // const [offlineUsers, setOfflineUsers] = useState([]);
  const [leavingGroupChat, setLeavingGroupChat] = useState(false);
  const [inviteMembers, setInviteMembers] = useState(false);

  useEffect(() => {
    console.log(`This is the current room ${currentChatRoom?.roomId}`);
  }, [currentChatRoom]);

  useEffect(() => {
    const handleGettingChatInfo = (payload: any) => {
      console.log("Group Chat Info", payload);
      setCurrentChatRoom(payload);
    }
      on("GET_ROOM_INFO", handleGettingChatInfo);
    return () => {
      off("GET_ROOM_INFO", handleGettingChatInfo);
    }
  }, [off, on, setCurrentChatRoom]);

  if (currentChatRoom == null) {
    return (
      <div className="chat-room-info">
        <div className="main-chat-info"></div>
        <div className="chat-room-info-bottom"></div>
      </div>
    )
  }
  else {
    return (
      <>
        {leavingGroupChat && <LeaveGroupChat showSelf={setLeavingGroupChat} roomName={currentChatRoom.roomName} />}
        {inviteMembers && <InviteGroupMembers showSelf={setInviteMembers} roomName={currentChatRoom.roomName} roomId={currentChatRoom.roomId}/>}
        <div className="chat-room-info">
          {/* Work on wrapping these in a div next */}
          <div className="main-chat-info">
            <div className="group-chat-summary">
              <div className="large-server-icon-wrapper">
                {/* <div className="large-server-icon"></div> */}
                <GroupChatIcon 
                  className='large-server-icon' 
                  groupChatId={currentChatRoom.roomId} 
                  groupChatName={currentChatRoom.roomName}
                />
              </div>
              <h2>{currentChatRoom.roomName}</h2>
              <p>{currentChatRoom.onlineUsers.length + currentChatRoom.offlineUsers.length} Members</p>
            </div>
            <button className="invite-member" onClick={() => setInviteMembers(true)}><MdPersonAddAlt className="mdpersonadd-icon"/>Invite People</button>
            <GroupMembersStatus className="online-users" groupMembers={currentChatRoom.onlineUsers} title="Online" />
            <GroupMembersStatus className="offline-users" groupMembers={currentChatRoom.offlineUsers} title="Offline" />
            <button className="leave-group" onClick={() => setLeavingGroupChat(true)}><ImExit />Leave Group Chat</button>
          </div>
          <div className="chat-room-info-bottom"></div>
        </div>
      </>
    );
  }
};

export default ChatRoomInformation;
