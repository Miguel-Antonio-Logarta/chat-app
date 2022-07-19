import React from "react";

type Props = {
  className: string;
  groupMembers: Array<any>;
  title: string;
};

const GroupMembersStatus = (props: Props) => {
  // offline-users, online-users
  return (
    <div className={props.className}>
      <div className="online-status online">
        <span>{props.title}</span>
        <div className="online-status-number">{props.groupMembers.length}</div>
      </div>
      <div className="group-chat-member-list">
        {props.groupMembers.map((member) => (
          <React.Fragment key={member.userId}>
            <div className="group-chat-member">
              <div className="profile-picture"></div>
              <h4>{member.username}</h4>
            </div>
          </React.Fragment>
        ))}
      </div>
    </div>
  );
};

export default GroupMembersStatus;
