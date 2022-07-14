import React, { useState, useEffect } from "react";
import { ImExit } from "react-icons/im"
import { MdPersonAddAlt } from "react-icons/md"
import { camelCaseKeys, snakeCaseKeys } from "../utils/Utilities";
import GroupMembersStatus from "./GroupMembersStatus";
import { useSocketContext } from "../context/SocketContext";
import LeaveGroupChat from "./LeaveGroupChat";
import InviteGroupMembers from "./InviteGroupMembers";

type Props = {};

const ChatRoomInformation = (props: Props) => {
  const {socket, isConnected, currentRoom, setCurrentRoom} = useSocketContext();
  const [roomName, setRoomName] = useState("");
  const [onlineUsers, setOnlineUsers] = useState([]);
  const [offlineUsers, setOfflineUsers] = useState([]);
  const [leavingGroupChat, setLeavingGroupChat] = useState(false);
  const [inviteMembers, setInviteMembers] = useState(false);

  useEffect(() => {
    console.log(`This is the current room ${currentRoom}`);
  }, [currentRoom]);

  useEffect(() => {
    if (isConnected) {
      socket.addEventListener("message", (event) => {
        const data = camelCaseKeys(JSON.parse(event.data));
        console.log(data);
        if (data.type === "GET_ROOM_INFO") {
          setRoomName(data.payload.roomName);
          setOnlineUsers(data.payload.onlineUsers);
          setOfflineUsers(data.payload.offlineUsers);
          setCurrentRoom(data.payload.roomId);
        }
        // setRoomName(data.)
      })
    }
  }, [socket, isConnected, setCurrentRoom])

  if (currentRoom == null) {
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
        {leavingGroupChat && <LeaveGroupChat showSelf={setLeavingGroupChat} roomName={roomName} />}
        {inviteMembers && <InviteGroupMembers showSelf={setInviteMembers} roomName={roomName} roomId={currentRoom}/>}
        <div className="chat-room-info">
          {/* Work on wrapping these in a div next */}
          <div className="main-chat-info">
            <div className="group-chat-summary">
              <div className="large-server-icon-wrapper">
                <div className="large-server-icon"></div>
              </div>
              <h2>{roomName}</h2>
              <p>{onlineUsers.length + offlineUsers.length} Members</p>
            </div>
            <button className="invite-member" onClick={() => setInviteMembers(true)}><MdPersonAddAlt className="mdpersonadd-icon"/>Invite People</button>
            <GroupMembersStatus className="online-users" groupMembers={onlineUsers} title="Online" />
            <GroupMembersStatus className="offline-users" groupMembers={offlineUsers} title="Offline" />
            <button className="leave-group" onClick={() => setLeavingGroupChat(true)}><ImExit />Leave Group Chat</button>
          </div>
          <div className="chat-room-info-bottom"></div>
        </div>
      </>
    );
  }
};

export default ChatRoomInformation;
