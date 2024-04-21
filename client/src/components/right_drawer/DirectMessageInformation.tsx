import React, { useState, useEffect } from "react";
import { ImExit } from "react-icons/im"
import { MdPersonAddAlt } from "react-icons/md"
import GroupMembersStatus from "./GroupMembersStatus";
import LeaveGroupChat from "./LeaveGroupChat";
import InviteGroupMembers from "./InviteGroupMembers";
import { useSocket } from "../../context/SocketContext";
import { useChat } from "../../context/ChatAppContext";
import GroupChatIcon from "../GroupChatIcon";
import { UserInfoType } from "../../types";
import { useAuth } from "../../context/AuthContext";

type Props = {}

type OnlineFriendPropsStatusProps = {};

const OnlineFriendStatus = (props: OnlineFriendPropsStatusProps) => {
    const { userId } = useAuth();
    const { currentChatRoom } = useChat();
    
    return (
        <>
            {currentChatRoom?.onlineUsers.map((friend: UserInfoType) => friend.userId !== userId && <GroupMembersStatus className="online-users" groupMembers={[friend]} title="Online" />)}
            {currentChatRoom?.offlineUsers.map((friend: UserInfoType) => friend.userId !== userId && <GroupMembersStatus className="offline-users" groupMembers={[friend]} title="Offline" />)}
        </>
    );
}

const DirectMessageInformation = (props: Props) => {
    const { userId } = useAuth();
    const { currentChatRoom, setCurrentChatRoom } = useChat();
    const [leavingGroupChat, setLeavingGroupChat] = useState(false);
    const [friend, setFriend] = useState(null);

    useEffect(() => {
        // Find friend
    }, [])

    return (
      <>
        {leavingGroupChat && <LeaveGroupChat showSelf={setLeavingGroupChat} roomName={currentChatRoom!.roomName} />}
        <div className="chat-room-info">
          {/* Work on wrapping these in a div next */}
          <div className="main-chat-info">
            <div className="group-chat-summary">
              <div className="large-server-icon-wrapper">
                <GroupChatIcon 
                  className='large-server-icon' 
                  groupChatId={currentChatRoom!.roomId} 
                  groupChatName={currentChatRoom!.roomName}
                />
              </div>
              <h2>{currentChatRoom!.roomName}</h2>
            </div>
            {/* {currentChatRoom!.onlineUsers.length > 0 && <GroupMembersStatus className="online-users" groupMembers={currentChatRoom!.onlineUsers} title="Online" />} */}
            {/* {currentChatRoom!.offlineUsers.length > 0 && <GroupMembersStatus className="offline-users" groupMembers={currentChatRoom!.offlineUsers} title="Offline" />} */}
            <OnlineFriendStatus />
            <button className="leave-group" onClick={() => setLeavingGroupChat(true)}><ImExit />Leave Group Chat</button>
          </div>
          <div className="chat-room-info-bottom"></div>
        </div>
      </>
    );
}

export default DirectMessageInformation