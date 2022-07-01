import React from "react";
import { ImExit } from "react-icons/im"
import { MdPersonAddAlt } from "react-icons/md"

type Props = {};

const ChatRoomInformation = (props: Props) => {
  return (
    // Whole thing should be scrollable
    <div className="chat-room-info">
      {/* Work on wrapping these in a div next */}
      <div className="main-chat-info">
        <div className="group-chat-summary">
          <div className="large-server-icon-wrapper">
            <div className="large-server-icon"></div>
          </div>
          {/* <div className="large-server-icon"></div> */}
          <h2>Kiwilover's group chat</h2>
          <p>6 Members</p>
        </div>
        <button className="invite-member"><MdPersonAddAlt className="mdpersonadd-icon"/>Invite People</button>
        <div className="online-users">
          <div className="online-status online"><span>Online</span><div className="online-status-number">4</div></div>
          <div className="group-chat-member-list">
            <div className="group-chat-member">
              <div className="profile-picture"></div>
              <h4>Kiwilover22</h4>
            </div>
            <div className="group-chat-member">
              <div className="profile-picture"></div>
              <h4>Kiwilover22</h4>
            </div>
          </div>
        </div>
        <div className="offline-users">
          {/* <p className="online-status">2 Offline</p> */}
          <div className="online-status offline"><span>Offline</span><div className="online-status-number">2</div></div>
          <div className="group-chat-member-list">
            <div className="group-chat-member">
              <div className="profile-picture"></div>
              <h4>Kiwilover22</h4>
            </div>
            <div className="group-chat-member">
              <div className="profile-picture"></div>
              <h4>Kiwilover22</h4>
            </div>
          </div>
        </div>
        <button className="leave-group"><ImExit />Leave Group Chat</button>
      </div>
      {/* <div className="online-status">
        <div className="status-circle online"></div>
        <p>4 Online</p>
        <div className="status-circle offline"></div>
        <p>6 Members</p>
      </div> */}
      {/* <h3>Members</h3> */}
      {/* Move these buttons to chat-room-info-bottom */}
      {/* <div className="group-actions">
        <button>Invite Members</button>
        <button>Leave Group</button>
      </div> */}
      <div className="chat-room-info-bottom"></div>
    </div>
  );
};

export default ChatRoomInformation;
