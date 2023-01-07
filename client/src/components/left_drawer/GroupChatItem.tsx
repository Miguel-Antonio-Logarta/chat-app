import React, { useEffect, useState } from 'react'
import { useChat } from '../../context/ChatAppContext';
import { useSocket } from '../../context/SocketContext';
import GroupChatIcon from '../GroupChatIcon';
import dayjs from 'dayjs';

type GroupChatItemProps = {
    roomId: number;
    roomName: string;
    description: string;
    createdOn: string;
    isGroupChat: boolean;
  }

const GroupChatItem = (props: GroupChatItemProps) => {
    const [latestMessage, setLatestMessage] = useState<any>(null);
    const { sendMessage, on, off } = useSocket();
    const { currentChatRoom } = useChat();

    const handleClick = (e: React.MouseEvent<HTMLDivElement>) => {
      e.preventDefault();
      sendMessage("GET_MESSAGES", {roomId: props.roomId});
      sendMessage("GET_ROOM_INFO", {roomId: props.roomId});
    }
    
    useEffect(() => {
      console.log("Getting messages for", props.roomId);
      sendMessage("GET_LATEST_MESSAGES", {
        roomId: props.roomId,
        noOfMessages: 1
      })
    }, [props.roomId, sendMessage]);

    useEffect(() => {
      const getLatestMessage = (payload: any) => {
        console.log(payload);
        setLatestMessage((message: any) => {
          if (payload.roomId === props.roomId && payload.messages[0]) {
            return payload.messages[0];
          } else {
            return message;
          }
        });
      }

      on("GET_LATEST_MESSAGES", getLatestMessage);

      return () => {
        off("GET_LATEST_MESSAGES", getLatestMessage);
      }
    }, [on, off, props.roomId])
    
    return (
      <div onClick={handleClick} className={`server-overview ${currentChatRoom?.roomId === props.roomId ? "active" : ""}`}>
        {/* <div className='server-icon'></div> */}
        <GroupChatIcon className='server-icon' groupChatName={props.roomName} groupChatId={props.roomId} />
        <div className='server-info'>
          <h4>{props.roomName}</h4>
          {latestMessage && <p>{`${latestMessage.message} @ ${dayjs(latestMessage.timestamp).format('DD/MM/YYYY')}`}</p>}
        </div>
      </div>
    )
  }

  export default GroupChatItem;