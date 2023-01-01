import React from "react";
import ImageIcon from "./ImageIcon";

type Props = {
    id: number;
    username: string;
    className?: string;
};

const ProfileImage = (props: Props) => {
  return (
        <ImageIcon 
            src={`${process.env.REACT_APP_S3_BASE_OBJECT_URL}${process.env.REACT_APP_S3_PROFILE_IMAGES_LOCATION as string}${props.id}.png`}
            className={props.className} 
            alt={`${props.username}'s profile image`}
        />
    );
};

export default ProfileImage;
