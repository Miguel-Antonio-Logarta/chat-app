import React from "react";

type Props = {};

const ChatRoomInformation = (props: Props) => {
  return (
    <>
      <div className="chat-room-info">
        <div className="large-server-icon"></div>
        <h2>Kiwilover's group chat</h2>
        <div className="online-status">
          <div className="status-circle online"></div>
          <p>4 Online</p>
          <div className="status-circle offline"></div>
          <p>6 Members</p>
        </div>
        <h3>Members</h3>
        <div className="group-chat-member">
          <div className="profile-picture"></div>
          <h3>Kiwilover22</h3>
        </div>
        <div className="group-actions">
          <button>Invite Members</button>
          <button>Leave Group</button>
        </div>
      </div>
      <div className="chat-room-info-bottom"></div>
    </>
  );
};

export default ChatRoomInformation;
