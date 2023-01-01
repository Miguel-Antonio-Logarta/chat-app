import React from 'react'
import ImageIcon from './ImageIcon';

type Props = {
    className: string;
    groupChatName: string;
    groupChatId: number;
}

const GroupChatIcon = (props: Props) => {
    return (
        <ImageIcon 
            src={`${process.env.REACT_APP_S3_BASE_OBJECT_URL}${process.env.REACT_APP_S3_GC_ICON_LOCATION as string}${props.groupChatId}.png`}
            className={props.className} 
            alt={`${props.groupChatName}'s image icon`}
        />
    );
}

export default GroupChatIcon