import React from "react";
import dayjs from "dayjs";
import TimestampSeparator from "./TimestampSeparator";

type MessageProps = {
  id: number;
  username: string;
  message: string;
  timestamp: string;
  placeRight: boolean;
  lastTimestamp: string | null;
  lastUsername: string;
};

// Rename to "readTimeDifference" and return obj {className: str, readableTime: str}
const findSpacing = (
  currentTimeStamp: string,
  lastMsgTimestamp: string | null,
  username: string,
  lastUsername: string
): string => {
  const MINUTE = 60000;
  const currentTime = dayjs(currentTimeStamp);
  const lastTime = dayjs(lastMsgTimestamp);
  const timeDifference = currentTime.diff(lastTime);

  if (
    lastMsgTimestamp &&
    username === lastUsername &&
    timeDifference < MINUTE
  ) {
    return "small-msg-margin";
  } else {
    return "medium-msg-margin";
  }
};

const Message = ({
  id,
  username,
  message,
  timestamp,
  placeRight,
  lastTimestamp,
  lastUsername,
}: MessageProps) => {
  const spacingType = findSpacing(
    timestamp,
    lastTimestamp,
    username,
    lastUsername
  );
  const readableTime = dayjs(timestamp).format("h:mm A");

  return (
    <>
      <TimestampSeparator timestamp={timestamp} lastTimestamp={lastTimestamp} />
      <div className={`message ${placeRight && `owner`} ${spacingType}`}>
        <div className="profile-picture"></div>
        <p className="username">{username}</p>
        {spacingType !== "small-msg-margin" && (
          <p className="timestamp">sent: {readableTime}</p>
        )}
        <div className="message-content">
          <p>{message}</p>
        </div>
      </div>
    </>
  );
};

export default Message;
