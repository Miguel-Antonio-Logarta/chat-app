import React from "react";
import dayjs from "dayjs";

type TimestampSeparatorProps = {
  timestamp: string;
  lastTimestamp: string | null;
};

const TimestampSeparator = ({
  lastTimestamp,
  timestamp,
}: TimestampSeparatorProps) => {
  // If message is from today, and last timestamp is from today, then reteurn null
  // If message is from today, and last timestamp is from yesterday, then return "--today, date--"
  // If message is not from today, and last timestamp is from the same day, return null
  // If message is not from today, and last timestamp is not from the same day, return "--date--"
  const currentMsgTime = dayjs(timestamp);
  const lastMsgTime = dayjs(lastTimestamp);
  let readableDate = "";

  if (currentMsgTime.isSame(dayjs(), "day")) {
    if (lastMsgTime.isSame(dayjs(), "day")) {
      return null;
    } else {
      readableDate = "Today, " + currentMsgTime.format("MMMM D");
    }
  } else {
    if (lastMsgTime.isSame(currentMsgTime, "day")) {
      return null;
    } else {
      readableDate = currentMsgTime.format("dddd, MMMM D, YYYY");
    }
  }

  return <div className="timestamp-separator">{readableDate}</div>;
};

export default TimestampSeparator;
